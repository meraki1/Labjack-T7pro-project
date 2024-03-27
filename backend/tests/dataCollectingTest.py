import sys
import os
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv

MAX_REQUESTS = 10 # The number of eStreamRead calls that will be performed.
experiment_log_id = 3  # Define your experiment log id here

# Mocked LabJack class
class MockLabJack:
    def __init__(self):
        self.aScanListNames = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]
        self.numAddresses = len(self.aScanListNames)
        self.scanRate = 500
        self.scansPerRead = int(self.scanRate / 2)

    def eStreamRead(self):
        # Generate random data for each channel
        aData = np.random.uniform(-1, 1, (self.scansPerRead, self.numAddresses)).flatten().tolist()
        return [aData, 0, 0]

# Test function
def test_start_data_collecting():
    try:
        # Use the mocked LabJack device
        handle = MockLabJack()

        # Create a new directory for the experiment
        load_dotenv()  # take environment variables from .env.
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment_log_id}")
        os.makedirs(directory, exist_ok=True)

        print("\nPerforming %i stream reads." % MAX_REQUESTS)
        start = datetime.now()
        totScans = 0

        i = 1
        while i <= MAX_REQUESTS:
            ret = handle.eStreamRead()

            aData = ret[0]
            scans = len(aData) // handle.numAddresses
            totScans += scans

            # Reshape the data to a 2D array where each row is a scan
            reshaped_data = np.reshape(aData, (scans, handle.numAddresses))

            # Save raw data to parquet gzip file
            df = pd.DataFrame(reshaped_data, columns=handle.aScanListNames)
            filename = os.path.join(directory, f'sample_{i}.parquet.gzip')
            df.to_parquet(filename, compression='gzip')

            print("\neStreamRead %i" % i)
            ainStr = ""
            for j in range(0, handle.numAddresses):
                ainStr += "%s = %0.5f, " % (handle.aScanListNames[j], reshaped_data[0][j])
            print("  1st scan out of %i: %s" % (scans, ainStr))
            i += 1

        end = datetime.now()

        print("\nTotal scans = %i" % (totScans))
        tt = (end - start).seconds + float((end - start).microseconds) / 1000000
        print("Time taken = %f seconds" % (tt))
        print("Timed Scan Rate = %f scans/second" % (totScans / tt))
        print("Timed Sample Rate = %f samples/second" % (totScans * handle.numAddresses / tt))
    except Exception:
        e = sys.exc_info()[1]
        print(e)

# Test the function
test_start_data_collecting()