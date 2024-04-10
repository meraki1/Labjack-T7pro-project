# Labjack T7 Pro Project

This project presents a comprehensive system for collecting, storing, and visualizing data from the prognostic failure simulator. It comprises an information system, specifically a web application, which efficiently gathers data from sensors via defined libraries from the Labjack T7 Pro device, storing them into parquet.gzip files.

## Features

- **Device Configuration**: Simplify the configuration of device settings for seamless operation.
- **Experiment Setup**: Effortlessly set up experiments to gather relevant data.
- **Real-time Data Collection**: Utilize the Labjack T7 Pro device for efficient real-time data collection.
- **Data Visualization**: Utilize intuitive visualization tools to analyze and interpret collected data effectively.
- **Experiment Results Review**: Review and analyze experiment results comprehensively for informed decision-making.
- **Data Export**: Export collected data into CSV files for further analysis and reporting.

## Technologies Used

The project leverages several technologies and frameworks:

- **FastAPI**: A modern, high-performance web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **React**: A JavaScript library renowned for building dynamic and responsive user interfaces.
- **TypeScript**: An open-source language extending JavaScript with static type definitions, enhancing code maintainability and scalability.
- **MySQL**: An open-source relational database management system chosen for its reliability and efficiency.
- **Labjack T7 Pro Device**: An advanced multifunction DAQ platform with WiFi connectivity and a high-resolution (24-bit) sigma-delta ADC. Additionally, it features a real-time clock (RTC) and 4GB MicroSD card for standalone datalogging.

## Architecture

The architecture of the web application and its components include:

- **Interface (React)**: Responsible for managing the user interface components such as forms and data visualization.
- **Backend (FastAPI)**: Handles critical tasks including data collection, storage, and export functionalities.
- **Database (MySQL)**: Stores all necessary data required for seamless operation.
- **Integration with Labjack T7 Pro Device**: Facilitates seamless data collection from the Labjack T7 Pro device.

## Database

The system relies on a MySQL database to store all necessary data securely and efficiently.
