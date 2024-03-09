import time
from labjack import ljm

def start_data_collecting():
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        ljm.eWriteName(handle, "STREAM_RESOLUTION_INDEX", 0)

        # Channel names
        aNames = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]
        numFrames = len(aNames)

        aAddresses, aTypes = ljm.namesToAddresses(numFrames, aNames)

        # Define the duration of data collection and the interval between measurements
        collection_duration = 5.0  # in seconds
        measurement_interval = 0.0  # in seconds (adjust as needed)

        # Initialize parameters
        sample_rate = 30000
        scanRate = int(sample_rate / numFrames)
        scansPerRead = scanRate

        # Configure and start the stream
        actual_scan_rate = ljm.eStreamStart(handle, scansPerRead, numFrames, aAddresses, scanRate)
        print(f"Stream started at {actual_scan_rate} Hz")

        # Set the end time
        end_time = time.perf_counter() + collection_duration

        # Initialize storage for total samples
        total_samples = 0

        # Record the start time
        start_time = time.perf_counter()

        # Read data from the stream until the end time is reached
        while time.perf_counter() < end_time:
            # Read the data from the stream
            aData, deviceScanBacklog, ljmScanBacklog = ljm.eStreamRead(handle)
            print(aData)
            
            total_samples += len(aData)

            # # Store the raw data
            # raw_data.append(aData)

            # Print the DeviceScanBacklog and LJMScanBacklog
            print(f"DeviceScanBacklog: {deviceScanBacklog}, LJMScanBacklog: {ljmScanBacklog}")

            time.sleep(measurement_interval)

        # Stop the stream
        ljm.eStreamStop(handle)

        # Calculate the actual sampling rate
        actual_duration = time.perf_counter() - start_time    

        print(f"Actual duration of collection: {actual_duration} seconds")
        print(f"Total number of samples collected: {total_samples}")

        return True  # Data collection completed successfully

    except ljm.LJMError as e:
        print("Failed to communicate with the device:", e)
        return False
    except Exception as e:
        print("Error during data collection:", e)
        return False
    
    finally:
        ljm.close(handle)

# Test the function
start_data_collecting()