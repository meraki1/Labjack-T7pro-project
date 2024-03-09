import time
import pandas as pd
import numpy as np
from labjack import ljm

def start_data_collecting(experiment):
    try:
        # Open the LabJack device
        device_handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        # Define the channels to be read
        channel_names = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]
        num_channels = len(channel_names)

        # Get the addresses of the channels
        channel_addresses = ljm.namesToAddresses(num_channels, channel_names)[0]
        
        # Initialize scan parameters
        desired_scan_rate = 1000
        actual_scan_rate = desired_scan_rate
        scans_per_read = int(desired_scan_rate / 2)
        data_buffer = np.zeros(num_channels * scans_per_read)

        # Define the duration of data collection and the interval between measurements
        collection_duration = 1.0  # in seconds
        measurement_interval = 0.0  # in seconds (adjust as needed)

        collection_start_time = time.time()
        collection_end_time = collection_start_time + collection_duration

        # Start the stream
        actual_scan_rate = ljm.eStreamStart(device_handle, scans_per_read, num_channels, channel_addresses, actual_scan_rate)
        print(f"Stream started at {actual_scan_rate} Hz")

        while time.time() < collection_end_time:
            data_rows = []         

            # Read from the stream
            data_buffer, device_scan_backlog, ljm_scan_backlog = ljm.eStreamRead(device_handle)

            # Convert the list to a NumPy array and reshape it to account for interleaved channels
            data_array = np.array(data_buffer).reshape(-1, num_channels)

            for i in range(data_array.shape[0]):
                for j in range(num_channels):
                    data_row = {'channel': channel_names[j], 'reading': data_array[i, j]}
                    data_rows.append(data_row)

            # Print the backlog information
            print(f"Device Scan Backlog: {device_scan_backlog}")
            print(f"LJM Scan Backlog: {ljm_scan_backlog}")

            # Pause for the measurement interval
            time.sleep(measurement_interval)
            
            # Print the data collected during the sample time
            if data_rows:
                df = pd.DataFrame(data_rows)
                print(df.head)
        
        # Stop the stream
        ljm.eStreamStop(device_handle)
    
        return True  # Data collection completed successfully

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
        return False
    except Exception as e:
        print("Error during data collection:", e)
        return False
    
    finally:
        ljm.close(device_handle)

# Define the experiment name
experiment_name = "Your experiment name"

# Call the function to start data collection
start_data_collecting(experiment_name)