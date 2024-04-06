import pandas as pd
import pyarrow.parquet as pq

# Define the path to the Parquet file
file_path = r"C:\Users\Karlo Mišković\Desktop\Faks\Zimskii semestar 2023\Projekt IIM\Web App\Labjack-T7pro-project\collected_data\experiment_1\sample_1.parquet.gzip"

# Read Parquet file without decompressing
table = pq.read_table(file_path)

# Convert to Pandas DataFrame
df = table.to_pandas()

# Display DataFrame
print(df)