import sys
import os
import pandas as pd
import numpy as np
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import ExperimentSample
from database import get_db
from datetime import datetime
from labjack import ljm

def save_sample(i, aData, numAddresses, aScanListNames, directory, start_time_sample, db: Session, experiment, dict_channel_offset_scale):
    scans = len(aData) // numAddresses

    # Reshape the data to a 2D array where each row is a scan
    reshaped_data = np.reshape(aData, (scans, numAddresses))

    # Convert the numpy array to a pandas DataFrame
    df = pd.DataFrame(reshaped_data, columns=aScanListNames)

    # Apply scale and offset to each data row
    for channel_name, data in df.items():
        if channel_name in dict_channel_offset_scale:
            scale = dict_channel_offset_scale[channel_name]['scale']
            offset = dict_channel_offset_scale[channel_name]['offset']
            df[channel_name] = data.apply(lambda x: scale * x + offset)

    # Save raw data to parquet gzip file
    full_filename = os.path.join(directory, f'sample_{i}.parquet.gzip')
    filename = os.path.basename(full_filename) 
    df.to_parquet(full_filename, compression='gzip')

    end_time_sample = datetime.now()
    
    # Create an instance of ExperimentSample and add it to the session
    new_sample = ExperimentSample(file_name=filename,
                                         start_time=start_time_sample,
                                         end_time=end_time_sample,
                                         experiment_log_id=experiment.log_id,
                                         sample_number=i)
    db.add(new_sample)
    db.commit()
    db.refresh(new_sample)

def start_data_collecting(experiment, db, dict_channel_offset_scale):
    try:
        MAX_REQUESTS = int(experiment.experiment_parameters[7].value) # The number of eStreamRead calls that will be performed.

        # Open first found LabJack
        handle = ljm.openS("T7", "ETHERNET", "192.168.88.15")

        aScanListNames = [param.channel_name for param in experiment.channel_parameters]
        numAddresses = len(aScanListNames)
        aScanList = ljm.namesToAddresses(numAddresses, aScanListNames)[0]
        scanRate = int(experiment.experiment_parameters[6].value) # Herz
        scansPerRead = int(scanRate / 2)

        # Create a new directory for the experiment
        load_dotenv() 
        base_directory = os.getenv("base_directory")
        directory = os.path.join(base_directory, f"experiment_{experiment.log_id}")
        os.makedirs(directory, exist_ok=True)

        print("\nPerforming %i stream reads." % MAX_REQUESTS)
        
        # Configure and start stream
        scanRate = ljm.eStreamStart(handle, scansPerRead, numAddresses, aScanList, scanRate)
        print("\nStream started with a scan rate of %0.0f Hz." % scanRate)

        print("\nPerforming %i stream reads." % MAX_REQUESTS)
        
        i = 1
        try:
            while i <= MAX_REQUESTS:
                start_time_sample = datetime.now()
                try:
                    ret = ljm.eStreamRead(handle)
                except ljm.LJMError:
                    print("An error occurred during the stream read.")
                    continue
                
                aData = ret[0]
                scans = len(aData) / numAddresses

                curSkip = aData.count(-9999.0)

                # Call the save_sample function directly
                save_sample(i, aData, numAddresses, aScanListNames, directory, start_time_sample, db, experiment, dict_channel_offset_scale)

                print("\neStreamRead %i" % i)
                ainStr = ""
                for j in range(0, numAddresses):
                    ainStr += "%s = %0.5f, " % (aScanListNames[j], aData[j])
                print("  1st scan out of %i: %s" % (MAX_REQUESTS, ainStr))
                print("  Scans Skipped = %0.0f, Scan Backlogs: Device = %i, LJM = "
                    "%i" % (curSkip/numAddresses, ret[1], ret[2]))
                
                i += 1

            return {"status": "Data collection completed successfully"}

        except Exception as e:
            print(f"An error occurred during data collection: {e}")
            return {"status": "Data collection failed"}
        
    except ljm.LJMError:
        ljme = sys.exc_info()[1]
        print(ljme)
    except Exception:
        e = sys.exc_info()[1]
        print(e)
    finally:
        print("\nStop Stream")
        ljm.eStreamStop(handle)