import time
from labjack import ljm

def start_data_collecting():
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        # Channel names
        aNames = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]
        numFrames = len(aNames)

        aAddresses, aTypes = ljm.namesToAddresses(numFrames, aNames)

        # Initialize parameters
        sample_rate = 500
        scanRate = int(sample_rate / numFrames)
        scansPerRead = scanRate
        duration_of_collection = 5.0  # in seconds

        # Configure and start the stream
        actual_scan_rate = ljm.eStreamStart(handle, scansPerRead, numFrames, aAddresses, scanRate)
        print(f"Stream started at {actual_scan_rate} Hz")

        start_time = time.perf_counter()
        end_time = start_time + duration_of_collection
        total_samples = 0
        raw_data = [] 
        while time.perf_counter() < end_time:
            # Read the data from the stream
            result = ljm.eStreamRead(handle)
            aData = result[0][0:numFrames*scansPerRead]
            total_samples += len(aData)
            raw_data.append(aData)

            # Print the DeviceScanBacklog and LJMScanBacklog
            deviceScanBacklog = result[2]
            ljmScanBacklog = result[3]
            print(f"DeviceScanBacklog: {deviceScanBacklog}, LJMScanBacklog: {ljmScanBacklog}")

            # Check if the total duration has exceeded
            if time.perf_counter() >= end_time:
                break

        # Stop the stream
        ljm.eStreamStop(handle)

        # Calculate the actual sampling rate
        actual_duration = time.perf_counter() - start_time
        actual_sampling_rate = total_samples / actual_duration
        print(f"Actual sampling rate: {actual_sampling_rate} samples per second")
        print(f"Actual duration of collection: {actual_duration} seconds")

        print(f"Total number of samples collected: {total_samples}")

        # Print the raw data
        print("Raw data:")
        for data in raw_data:
            print(data)
    
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