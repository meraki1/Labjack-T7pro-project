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
- **SQLAlchemy**: A popular SQL toolkit and Object-Relational Mapping (ORM) library for Python, providing a high-level interface for interacting with relational databases.
- **MySQL**: An open-source relational database management system chosen for its reliability and efficiency.
- **Labjack T7 Pro Device**: An advanced multifunction DAQ platform with WiFi connectivity and a high-resolution (24-bit) sigma-delta ADC. Additionally, it features a real-time clock (RTC) and 4GB MicroSD card for standalone datalogging.

## Architecture

The architecture of the web application and its components include:

- **Interface (React)**: Responsible for managing the user interface components such as forms and data visualization.
- **Backend (FastAPI)**: Handles critical tasks including data collection, storage, and export functionalities.
- **Database (MySQL)**: Stores all necessary data required for seamless operation.
- **Integration with Labjack T7 Pro Device**: Facilitates seamless data collection from the Labjack T7 Pro device.

## Database

The database structure of the project is outlined below. This section provides insights into the purpose, relationships, and structure of the database entities.

### Schema: labjack_t7pro_database

This schema houses the tables related to the Labjack T7 Pro project.

#### Table: **device**

- **Columns**:
  - **device_id**: Primary key for uniquely identifying each device.
  - **device_name**: Name of the device.

#### Table: **device_channels**

- **Columns**:
  - **channel_id**: Primary key for uniquely identifying each channel.
  - **channel_name**: Name of the channel.

#### Table: **experiment_logs**

- **Columns**:
  - **start_time**: Start time of the experiment.
  - **log_id**: Primary key for uniquely identifying each experiment log.
  - **notes**: Additional notes related to the experiment.
  - **device_id**: Foreign key referencing the **device** table.

#### Table: **experiment_channels**

- **Columns**:
  - **experiment_channel_id**: Primary key for uniquely identifying each experiment channel.
  - **log_id**: Foreign key referencing the **experiment_logs** table.
  - **defined_channel_id**: Foreign key referencing the **device_channels** table.
  - **defined_param_type_id**: Foreign key referencing the **parameter_types** table.

#### Table: **parameter_classes**

- **Columns**:
  - **param_class_id**: Primary key for uniquely identifying each parameter class.
  - **param_class**: Name of the parameter class.

#### Table: **parameter_types**

- **Columns**:
  - **param_type_id**: Primary key for uniquely identifying each parameter type.
  - **param_type**: Name of the parameter type.
  - **param_class_id**: Foreign key referencing the **parameter_classes** table.

#### Table: **experiment_parameters**

- **Columns**:
  - **experiment_param_id**: Primary key for uniquely identifying each experiment parameter.
  - **log_id**: Foreign key referencing the **experiment_logs** table.
  - **param_type_id**: Foreign key referencing the **parameter_types** table.
  - **param_value**: Value associated with the parameter.

#### Table: **experiment_samples**

- **Columns**:
  - **id**: Primary key for uniquely identifying each experiment sample.
  - **file_name**: Name of the file associated with the sample.
  - **start_time**: Start time of the sample.
  - **end_time**: End time of the sample.
  - **experiment_log_id**: Foreign key referencing the **experiment_logs** table.
  - **sample_number**: Number associated with the sample.

#### Table: **parameter_channel_relationships**

- **Columns**:
  - **relationship_id**: Primary key for uniquely identifying each relationship.
  - **channel_id**: Foreign key referencing the **device_channels** table.
  - **param_type_id**: Foreign key referencing the **parameter_types** table.
  - **device_id**: Foreign key referencing the **device** table.
  - **offset**: Offset value for the parameter.
  - **scale**: Scale value for the parameter.

This structure defines the entities and relationships within the Labjack T7 Pro project database, facilitating efficient data management and retrieval.
