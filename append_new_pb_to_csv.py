import os
import subprocess
import pandas as pd

PB_DIR = 'Takatomo Training Data'
MAIN_CSV = 'public/takatomo-training-data/training_logs.csv'
PROCESSED_LIST = 'processed_pb_files.txt'
TEMP_CSV = 'public/takatomo-training-data/new_logs.csv'
EXTRACT_SCRIPT = os.path.join(PB_DIR, 'extract_training_data.py')

# 1. Load processed files list
if os.path.exists(PROCESSED_LIST):
    with open(PROCESSED_LIST, 'r') as f:
        processed = set(line.strip() for line in f if line.strip())
else:
    processed = set()

# 2. Find all .pb files
all_pbs = set(f for f in os.listdir(PB_DIR) if f.endswith('.pb'))
new_pbs = sorted(list(all_pbs - processed))

if not new_pbs:
    print('No new .pb files to process.')
    exit(0)

print(f'New .pb files to process: {new_pbs}')

# 3. Extract logs from new .pb files to TEMP_CSV
pb_paths = [os.path.join(PB_DIR, pb) for pb in new_pbs]
cmd = ['python3', EXTRACT_SCRIPT] + pb_paths
subprocess.run(cmd, check=True, cwd=PB_DIR)
# Move the generated training_logs.csv to TEMP_CSV
os.rename(os.path.join(PB_DIR, 'training_logs.csv'), TEMP_CSV)

# 4. Append only unique rows to MAIN_CSV
main = pd.read_csv(MAIN_CSV) if os.path.exists(MAIN_CSV) else pd.DataFrame()
new = pd.read_csv(TEMP_CSV)
combined = pd.concat([main, new]).drop_duplicates()
combined.to_csv(MAIN_CSV, index=False)

# 5. Update processed files list
with open(PROCESSED_LIST, 'a') as f:
    for pb in new_pbs:
        f.write(pb + '\n')

# 6. Clean up temp file
os.remove(TEMP_CSV)

print('Done! Appended new logs to training_logs.csv and updated processed_pb_files.txt.') 