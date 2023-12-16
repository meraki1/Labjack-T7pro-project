CREATE TABLE device_channels
(
  channel_name VARCHAR(255),
  channel_id INT,
  PRIMARY KEY (channel_id)
);

CREATE TABLE parameter_classes
(
  param_class_id INT,
  param_class varchar(255),
  PRIMARY KEY (param_class_id)
);

CREATE TABLE device
(
  device_id INT,
  device_name VARCHAR(255),
  comments VARCHAR(65536),
  PRIMARY KEY (device_id)
);

CREATE TABLE experiment_logs
(
  start_time INT,
  log_id INT,
  comments VARCHAR(65536),
  device_id INT,
  PRIMARY KEY (log_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id)
);

CREATE TABLE labjack_t7_pro_data_
(
  experiment_timestamp TIMESTAMP,
  labjack_data_id INT,
  channel1_id FLOAT,
  channel1_data FLOAT,
  channel2_id FLOAT,
  channel2_data FLOAT,
  channel3_id FLOAT,
  channel3_data FLOAT,
  channel4_id FLOAT,
  channel4_data FLOAT,
  channel5_id FLOAT,
  channel5_data FLOAT,
  log_id INT,
  PRIMARY KEY (labjack_data_id),
  FOREIGN KEY (log_id) REFERENCES experiment_logs(log_id)
);

CREATE TABLE parameter_types
(
  param_type_id INT,
  param_type VARCHAR(255),
  param_class_id INT,
  PRIMARY KEY (param_type_id),
  FOREIGN KEY (param_class_id) REFERENCES parameter_classes(param_class_id),
  UNIQUE (param_type)
);

CREATE TABLE experiment_parameters
(
  experiment_param_id INT,
  param_type_id INT,
  log_id INT,
  param_value VARCHAR(255),
  PRIMARY KEY (experiment_param_id),
  FOREIGN KEY (param_type_id) REFERENCES parameter_types(param_type_id),
  FOREIGN KEY (log_id) REFERENCES experiment_logs(log_id)
);

CREATE TABLE experiment_channels
(
  experiment_channel_id INT,
  log_id INT,
  param_type_id INT,
  channel_id INT,
  PRIMARY KEY (experiment_channel_id),
  FOREIGN KEY (log_id) REFERENCES experiment_logs(log_id),
  FOREIGN KEY (param_type_id) REFERENCES parameter_types(param_type_id),
  FOREIGN KEY (channel_id) REFERENCES device_channels(channel_id)
);

CREATE TABLE parameter_channel_relationships
(
  relationship_id INT,
  channel_id INT,
  param_type_id INT,
  device_id INT,
  PRIMARY KEY (relationship_id),
  FOREIGN KEY (channel_id) REFERENCES device_channels(channel_id),
  FOREIGN KEY (param_type_id) REFERENCES parameter_types(param_type_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id)
);
