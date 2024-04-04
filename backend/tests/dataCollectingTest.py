import sys
import os
sys.path.append(r'C:\Users\Karlo Mišković\Desktop\Faks\Zimskii semestar 2023\Projekt IIM\Web App\Labjack-T7pro-project\backend')
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import ExperimentSample
from database import get_db
from datetime import datetime

# Mocked LabJack class
class MockLabJack:
    def __init__(self, experiment):
        self.aScanListNames = [param.channel_name for param in experiment.channel_parameters]
        self.numAddresses = len(self.aScanListNames)
        self.scanRate = int(experiment.experiment_parameters[6].value) # Herz
        self.scansPerRead = int(self.scanRate / 2)

    def eStreamRead(self):
        # Generate random data for each channel
        aData = np.random.uniform(-1, 1, (self.scansPerRead, self.numAddresses)).flatten().tolist()
        return [aData, 0, 0]

def save_sample(i, aData, handle, directory, start_time_sample, db: Session, experiment):
    scans = len(aData) // handle.numAddresses

    # Reshape the data to a 2D array where each row is a scan
    reshaped_data = np.reshape(aData, (scans, handle.numAddresses))

    # Save raw data to parquet gzip file
    df = pd.DataFrame(reshaped_data, columns=handle.aScanListNames)
    full_filename = os.path.join(directory, f'sample_{i}.parquet.gzip')
    filename = os.path.basename(full_filename) 
    df.to_parquet(full_filename, compression='gzip')

    end_time_sample = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    
    # Create an instance of ExperimentSample and add it to the session
    new_sample = ExperimentSample(file_name=filename,
                                         start_time=datetime.strptime(start_time_sample, '%Y-%m-%d %H:%M:%S.%f'),
                                         end_time=datetime.strptime(end_time_sample, '%Y-%m-%d %H:%M:%S.%f'),
                                         experiment_log_id=experiment.log_id,
                                         sample_number=i)
    db.add(new_sample)
    db.commit()
    db.refresh(new_sample)

def start_data_collecting(experiment, db):
    MAX_REQUESTS = int(experiment.experiment_parameters[7].value) # The number of eStreamRead calls that will be performed.

    # Use the mocked LabJack device
    handle = MockLabJack(experiment)

    # Create a new directory for the experiment
    load_dotenv() 
    base_directory = os.getenv("base_directory")
    directory = os.path.join(base_directory, f"experiment_{experiment.log_id}")
    os.makedirs(directory, exist_ok=True)

    print("\nPerforming %i stream reads." % MAX_REQUESTS)

    i = 1
    try:
        while i <= MAX_REQUESTS:
            start_time_sample = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
            ret = handle.eStreamRead()
            aData = ret[0]

            # Call the save_sample function directly
            save_sample(i, aData, handle, directory, start_time_sample, db, experiment)

            print("\neStreamRead %i" % i)
            ainStr = ""
            for j in range(0, handle.numAddresses):
                ainStr += "%s = %0.5f, " % (handle.aScanListNames[j], aData[j])
            print("  1st scan out of %i: %s" % (MAX_REQUESTS, ainStr))  
            i += 1

        return {"status": "Data collection completed successfully"}

    except Exception as e:
        print(f"An error occurred during data collection: {e}")
        return {"status": "Data collection failed"}