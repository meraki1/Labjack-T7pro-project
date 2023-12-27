import time
from labjack import ljm # Use python311.python.exe Interpretor

try:
    # Open the LabJack device
    handle = ljm.openS("T7", "ETHERNET", "192.168.88.15") 

    num_inputs = 5  # Number of input channels to read (we have 5)
    names = ["AIN0", "AIN1", "AIN2", "AIN3", "AIN4"]

    start_time = time.time()
    for i in range(1000):  # Read data 1000 times to simulate 1-second data reception
        data = ljm.eReadNames(handle, num_inputs, names)
        print(f"Iteration {i+1}: {data}")
    end_time = time.time()

    elapsed_time = end_time - start_time
    inputs_per_sec = 1000 * num_inputs / elapsed_time

    print(f"\nPython Test: Received {num_inputs} inputs per second: {inputs_per_sec:.2f}")
except ljm.LJMError as e:
    print("Failed to communicate with the device:", e)
except Exception as e:
    print("Unexpected error:", e)
finally:
    # Always close the handle to ensure a clean exit.
    ljm.close(handle)
