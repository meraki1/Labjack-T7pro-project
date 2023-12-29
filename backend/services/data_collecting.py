import time
import pandas as pd
from labjack import ljm # Use python311.python.exe Interpretor

def start_experiment(experiment):
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15") 

        num_inputs = len(experiment['channel_parameters'])  # Number of input channels to read
        names = list(experiment['channel_parameters'].keys()) # Channels names

        data_rows = []
        start_time = time.time()
        end_time = start_time + experiment['duration_of_collection']
        while time.time() < end_time:  # Read data for the duration of collection
            for _ in range(int(experiment['sampling_rate'])):  # Read data at the sampling rate
                data = ljm.eReadNames(handle, num_inputs, names)
                timestamp = time.time()
                data_row = {'timestamp': timestamp, 'log_id': experiment['log_id']}
                data_row.update(dict(zip(names, data)))
                data_rows.append(data_row)
            time.sleep(experiment['measurement_interval'])  # Wait for the measurement interval before the next reading

        # Convert the data rows to a DataFrame and save to a Parquet file
        df = pd.DataFrame(data_rows)
        file_path = experiment.get('file_path', f"experiment_{experiment['log_id']}.parquet")
        df.to_parquet(file_path)

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
    except Exception as e:
        print("Unexpected error:", e)
    finally:
        # Close the handle to ensure a clean exit.
        ljm.close(handle)

