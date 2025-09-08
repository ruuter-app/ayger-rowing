#!/usr/bin/env python3
"""
Script to extract training data from Protocol Buffer (.pb) files
using the training.proto schema.
"""

import os
import glob
import json
from datetime import datetime
import pandas as pd
from google.protobuf import text_format
from google.protobuf.json_format import MessageToDict

# Import the generated protobuf classes
try:
    import training_pb2
except ImportError:
    print("Error: training_pb2.py not found. Please compile the proto file first:")
    print("protoc --python_out=. training.proto")
    exit(1)


def compile_proto():
    """Compile the training.proto file to generate Python classes."""
    if not os.path.exists('training_pb2.py'):
        print("Compiling training.proto...")
        os.system('protoc --python_out=. training.proto')
        if not os.path.exists('training_pb2.py'):
            print("Error: Failed to compile training.proto")
            print("Make sure you have protobuf compiler installed:")
            print("pip install protobuf")
            exit(1)


def parse_training_file(file_path):
    """Parse a single training file and return the data."""
    try:
        with open(file_path, 'rb') as f:
            training_data = training_pb2.Training()
            training_data.ParseFromString(f.read())
        
        # Convert to dictionary for easier handling
        data_dict = MessageToDict(training_data)
        
        # Add filename for reference
        data_dict['filename'] = os.path.basename(file_path)
        
        return data_dict
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return None


def extract_all_training_data():
    """Extract data from all .pb files in the current directory."""
    # Find all .pb files
    pb_files = glob.glob("*.pb")
    
    if not pb_files:
        print("No .pb files found in current directory")
        return []
    
    print(f"Found {len(pb_files)} training files")
    
    all_data = []
    for file_path in sorted(pb_files):
        print(f"Processing {file_path}...")
        data = parse_training_file(file_path)
        if data:
            all_data.append(data)
    
    return all_data


def save_to_json(data, filename="training_data.json"):
    """Save extracted data to JSON file."""
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    print(f"Data saved to {filename}")


def save_to_csv(data, filename="training_data.csv"):
    """Save extracted data to CSV file."""
    # Flatten the data structure for CSV
    flattened_data = []
    
    for training in data:
        meta = training.get('meta', {})
        logs = training.get('logs', [])
        
        # Convert timestamp to readable format
        start_time = meta.get('startTime', 0)
        # Ensure start_time is an int
        if isinstance(start_time, str):
            try:
                start_time_int = int(start_time)
            except ValueError:
                start_time_int = 0
        else:
            start_time_int = start_time
        if start_time_int:
            start_datetime = datetime.fromtimestamp(start_time_int)
            meta['startDateTime'] = start_datetime.isoformat()
        else:
            meta['startDateTime'] = ''
        
        # Create a row for each training session
        training_row = {
            'filename': training.get('filename', ''),
            'startTime': start_time,
            'startDateTime': meta.get('startDateTime', ''),
            'duration': meta.get('duration', 0),
            'distance': meta.get('distance', 0),
            'type': meta.get('type', ''),
            'mode': meta.get('mode', ''),
            'splitDistance': meta.get('splitDistance', 0),
            'restDuration': meta.get('restDuration', 0),
            'numLogs': len(logs)
        }
        
        flattened_data.append(training_row)
    
    df = pd.DataFrame(flattened_data)
    df.to_csv(filename, index=False)
    print(f"Summary data saved to {filename}")


def save_logs_to_csv(data, filename="training_logs.csv"):
    """Save individual training logs to CSV file."""
    all_logs = []
    
    for training in data:
        meta = training.get('meta', {})
        logs = training.get('logs', [])
        filename_base = training.get('filename', '')
        
        start_time = meta.get('startTime', 0)
        
        for log in logs:
            log_row = {
                'filename': filename_base,
                'startTime': start_time,
                'delta': log.get('delta', 0),
                'distance': log.get('distance', 0),
                'strokerate': log.get('strokerate', 0),
                'heartrate': log.get('heartrate', 0),
                'longitude': log.get('position', {}).get('longitude', None),
                'latitude': log.get('position', {}).get('latitude', None)
            }
            all_logs.append(log_row)
    
    df = pd.DataFrame(all_logs)
    df.to_csv(filename, index=False)
    print(f"Detailed logs saved to {filename}")


def print_summary(data):
    """Print a summary of the extracted data."""
    print(f"\n=== TRAINING DATA SUMMARY ===")
    print(f"Total training sessions: {len(data)}")
    
    if not data:
        return
    
    # Calculate statistics
    total_distance = sum(t.get('meta', {}).get('distance', 0) for t in data)
    total_duration = sum(t.get('meta', {}).get('duration', 0) for t in data)
    total_logs = sum(len(t.get('logs', [])) for t in data)
    
    print(f"Total distance: {total_distance:,} meters ({total_distance/1000:.2f} km)")
    print(f"Total duration: {total_duration:,} seconds ({total_duration/3600:.2f} hours)")
    print(f"Total data points: {total_logs:,}")
    
    # Training types
    types = {}
    modes = {}
    for training in data:
        meta = training.get('meta', {})
        training_type = meta.get('type', 'UNKNOWN')
        training_mode = meta.get('mode', 'UNKNOWN')
        
        types[training_type] = types.get(training_type, 0) + 1
        modes[training_mode] = modes.get(training_mode, 0) + 1
    
    print(f"\nTraining types: {types}")
    print(f"Training modes: {modes}")
    
    # Date range
    timestamps = [t.get('meta', {}).get('startTime', 0) for t in data if t.get('meta', {}).get('startTime', 0)]
    if timestamps:
        # Convert string timestamps to integers if needed
        numeric_timestamps = []
        for ts in timestamps:
            if isinstance(ts, str):
                try:
                    numeric_timestamps.append(int(ts))
                except ValueError:
                    continue
            else:
                numeric_timestamps.append(ts)
        
        if numeric_timestamps:
            min_date = datetime.fromtimestamp(min(numeric_timestamps))
            max_date = datetime.fromtimestamp(max(numeric_timestamps))
            print(f"Date range: {min_date.date()} to {max_date.date()}")


def main():
    """Main function to extract and process training data."""
    print("=== Takatomo Training Data Extractor ===")
    
    # Compile proto file if needed
    compile_proto()
    
    # Extract all training data
    data = extract_all_training_data()
    
    if not data:
        print("No training data found or all files failed to parse")
        return
    
    # Print summary
    print_summary(data)
    
    # Save data in different formats
    save_to_json(data)
    save_to_csv(data)
    save_logs_to_csv(data)
    
    print("\n=== EXTRACTION COMPLETE ===")
    print("Files created:")
    print("- training_data.json (complete data)")
    print("- training_data.csv (summary per training session)")
    print("- training_logs.csv (detailed logs with timestamps)")


if __name__ == "__main__":
    main() 