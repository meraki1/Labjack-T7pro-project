import os
import time
import pandas as pd
from labjack import ljm

def start_data_collecting(experiment):
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        num_inputs = len(experiment.channel_parameters)
        names = [param.channel_name for param in experiment.channel_parameters]

        # Create a new directory for the experiment
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment.log_id}")
        os.makedirs(directory, exist_ok=True)

        # Access experiment_parameters
        sampling_rate = int(experiment.experiment_parameters[6].value)
        duration_of_collection = int(experiment.experiment_parameters[7].value)
        measurement_interval = int(experiment.experiment_parameters[8].value)

        data_rows = []
        start_time = time.time()
        end_time = start_time + duration_of_collection
        iteration = 0
        while time.time() < end_time:
            for _ in range(sampling_rate):
                data = ljm.eReadNames(handle, num_inputs, names)
                timestamp = time.time()
                data_row = {'timestamp': timestamp, 'log_id': experiment.log_id}
                data_row.update(dict(zip(names, data)))
                data_rows.append(data_row)

                if len(data_rows) % 10000 == 0:
                    file_path = os.path.join(directory, f"experiment_{experiment.log_id}_{iteration}.parquet.gzip")
                    df = pd.DataFrame(data_rows)
                    df.to_parquet(file_path, compression='gzip', index=False)
                    data_rows = []
                    iteration += 1

            time.sleep(measurement_interval)

        if data_rows:
            file_path = os.path.join(directory, f"experiment_{experiment.log_id}_{iteration}.parquet")
            df = pd.DataFrame(data_rows)
            df.to_parquet(file_path, compression='gzip', index=False)

        return True  # Data collection completed successfully

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
        return False
    except Exception as e:
        print("Error during data collection:", e)
        return False
    
    finally:
        ljm.close(handle)