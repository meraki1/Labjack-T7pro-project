import os
import time
import pandas as pd
from labjack import ljm # Use python311.python.exe Interpretor

def start_data_collecting(experiment):
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15") 

        num_inputs = len(experiment['channel_parameters'])  # Number of input channels to read
        names = list(experiment['channel_parameters'].keys()) # Channels names

        # Create a new directory for the experiment
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment['log_id']}")
        os.makedirs(directory, exist_ok=True)

        data_rows = []
        start_time = time.time()
        end_time = start_time + experiment['duration_of_collection']
        iteration = 0
        while time.time() < end_time:  # Read data for the duration of collection
            for _ in range(int(experiment['sampling_rate'])):  # Read data at the sampling rate
                data = ljm.eReadNames(handle, num_inputs, names)
                timestamp = time.time()
                data_row = {'timestamp': timestamp, 'log_id': experiment['log_id']}
                data_row.update(dict(zip(names, data)))
                data_rows.append(data_row)

                # Save every 1000 rows
                if len(data_rows) % 1000 == 0:
                    file_path = os.path.join(directory, f"experiment_{experiment['log_id']}_{iteration}.parquet.gzip")
                    df = pd.DataFrame(data_rows)
                    df.to_parquet(file_path, compression='gzip', index=False)
                    data_rows = []  # Reset the data rows
                    iteration += 1

            time.sleep(experiment['measurement_interval'])  # Wait for the measurement interval before the next reading

        # Save remaining rows
        if data_rows:
            file_path = os.path.join(directory, f"experiment_{experiment['log_id']}_{iteration}.parquet")
            df = pd.DataFrame(data_rows)
            df.to_parquet(file_path, compression='gzip', index=False)

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
    except Exception as e:
        print("Unexpected error:", e)
    finally:
        # Close the handle to ensure a clean exit.
        ljm.close(handle)
