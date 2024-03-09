import os
import time
import pandas as pd
from labjack import ljm

def start_data_collecting(experiment):
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        # Channel names (ex. ain0 etc.)
        NumAddresses = len(experiment.channel_parameters)
        aScanList = [param.channel_name for param in experiment.channel_parameters]

        # Create a new directory for the experiment
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment.log_id}")
        os.makedirs(directory, exist_ok=True)

        # Access experiment_parameters
        sample_time = int(500) # miliseconds
        SampleRate = int(experiment.experiment_parameters[6].value) # Herz
        duration_of_collection = float(experiment.experiment_parameters[7].value) /1000 # from ms to seconds
        measurement_interval = float(experiment.experiment_parameters[8].value) / 1000 # from ms to seconds

        start_time = time.time()
        end_time = start_time + duration_of_collection

        # Start the stream
        ScanRate = SampleRate / NumAddresses
        ScansPerRead = 1
        ljm.eStreamStart(handle, ScansPerRead, NumAddresses, ljm.namesToAddresses(NumAddresses, *aScanList))

        while time.time() < end_time:
            data_rows = []
            iteration = 0
            sample_start_time = time.time()
            sample_end_time = sample_start_time + sample_time

            while time.time() < sample_end_time and time.time() < end_time: 
                # Read from the stream
                data = ljm.eStreamRead(handle)
                timestamp = time.time()
                data_row = {'timestamp': timestamp, 'log_id': experiment.log_id}
                data_row.update(dict(zip(aScanList, data)))
                data_rows.append(data_row)

                time.sleep(measurement_interval)

            # Save the data collected during the sample time
            if data_rows:
                file_path = os.path.join(directory, f"experiment_{experiment.log_id}_{iteration}.parquet.gzip")
                df = pd.DataFrame(data_rows)
                df.to_parquet(file_path, compression='gzip', index=False)
                data_rows = []
                iteration += 1

        # Stop the stream
        ljm.eStreamStop(handle)

        return True  # Data collection completed successfully

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
        return False
    except Exception as e:
        print("Error during data collection:", e)
        return False
    
    finally:
        ljm.close(handle)