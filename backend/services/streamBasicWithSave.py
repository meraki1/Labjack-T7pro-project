import sys
import os
import pandas as pd
from datetime import datetime
from labjack import ljm
from dotenv import load_dotenv

MAX_REQUESTS = 10 # The number of eStreamRead calls that will be performed.
experiment_log_id = 1  # Define your experiment log id here

def start_data_collecting():
    try:
        # Open the LabJack device
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        # Ensure triggered stream is disabled.
        ljm.eWriteName(handle, "STREAM_TRIGGER_INDEX", 0)
        # Enabling internally-clocked stream.
        ljm.eWriteName(handle, "STREAM_CLOCK_SOURCE", 0)

        # Channel names
        aScanListNames = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]
        numAddresses = len(aScanListNames)
        aScanList = ljm.namesToAddresses(numAddresses, aScanListNames)[0]
        scanRate = 10
        scansPerRead = int(scanRate / 2)

        # Create a new directory for the experiment
        load_dotenv()
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment_log_id}")
        os.makedirs(directory, exist_ok=True)

        # Configure and start stream
        scanRate = ljm.eStreamStart(handle, scansPerRead, numAddresses, aScanList, scanRate)
        print("\nStream started with a scan rate of %0.0f Hz." % scanRate)

        print("\nPerforming %i stream reads." % MAX_REQUESTS)
        start = datetime.now()
        totScans = 0
        totSkip = 0  # Total skipped samples

        i = 1
        while i <= MAX_REQUESTS:
            ret = ljm.eStreamRead(handle)

            aData = ret[0]
            scans = len(aData) / numAddresses
            totScans += scans

            # Save raw data to parquet gzip file
            df = pd.DataFrame(aData[0], columns=aScanListNames)
            filename = os.path.join(directory, f'sample_{i}.parquet.gzip')
            df.to_parquet(filename, compression='gzip')

            # Count the skipped samples which are indicated by -9999 values. Missed
            # samples occur after a device's stream buffer overflows and are
            # reported after auto-recover mode ends.
            curSkip = aData.count(-9999.0)
            totSkip += curSkip

            print("\neStreamRead %i" % i)
            ainStr = ""
            for j in range(0, numAddresses):
                ainStr += "%s = %0.5f, " % (aScanListNames[j], aData[j])
            print("  1st scan out of %i: %s" % (scans, ainStr))
            print("  Scans Skipped = %0.0f, Scan Backlogs: Device = %i, LJM = "
                  "%i" % (curSkip/numAddresses, ret[1], ret[2]))
            i += 1

        end = datetime.now()

        print("\nTotal scans = %i" % (totScans))
        tt = (end - start).seconds + float((end - start).microseconds) / 1000000
        print("Time taken = %f seconds" % (tt))
        print("LJM Scan Rate = %f scans/second" % (scanRate))
        print("Timed Scan Rate = %f scans/second" % (totScans / tt))
        print("Timed Sample Rate = %f samples/second" % (totScans * numAddresses / tt))
        print("Skipped scans = %0.0f" % (totSkip / numAddresses))
    except ljm.LJMError:
        ljme = sys.exc_info()[1]
        print(ljme)
    except Exception:
        e = sys.exc_info()[1]
        print(e)

    try:
        print("\nStop Stream")
        ljm.eStreamStop(handle)
    except ljm.LJMError:
        ljme = sys.exc_info()[1]
        print(ljme)
    except Exception:
        e = sys.exc_info()[1]
        print(e)

# Test the function
start_data_collecting()