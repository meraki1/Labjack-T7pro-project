from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

class Device(Base):
    __tablename__ = 'device'

    device_id = Column(Integer, primary_key=True, autoincrement=True)
    device_name = Column(String(255), nullable=True)
    comments = Column(Text, nullable=True)
    experimentLogs = relationship("ExperimentLog", backref="device")


class DeviceChannel(Base):
    __tablename__ = 'device_channels'

    channel_id = Column(Integer, primary_key=True, autoincrement=True)
    channel_name = Column(String(255), nullable=True)

class ExperimentChannel(Base):
    __tablename__ = 'experiment_channels'

    experiment_channel_id = Column(Integer, primary_key=True, autoincrement=True)
    experiment_channel_id = Column(Integer, primary_key=True, autoincrement=True)
    log_id = Column(Integer, ForeignKey('experiment_logs.log_id'))  
    channel_id = Column(Integer, ForeignKey('device_channels.channel_id'))  
    param_type_id = Column(Integer, ForeignKey('parameter_types.param_type_id'))

class ExperimentLog(Base):
    __tablename__ = 'experiment_logs'

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(TIMESTAMP, nullable=True)
    comments = Column(Text, nullable=True)
    device_id = Column(Integer, ForeignKey('device.device_id')) 

class ExperimentParameter(Base):
    __tablename__ = 'experiment_parameters'

    experiment_param_id = Column(Integer, primary_key=True, autoincrement=True)
    param_type_id = Column(Integer, ForeignKey('parameter_types.param_type_id')) 
    log_id = Column(Integer, ForeignKey('experiment_logs.log_id'))
    param_value = Column(String(255), nullable=True)

class LabjackT7ProData(Base):
    __tablename__ = 'labjack_t7_pro_data'

    labjack_data_id = Column(Integer, primary_key=True, autoincrement=True)
    experiment_time = Column(TIMESTAMP, nullable=True)
    log_id = Column(Integer, ForeignKey('experiment_logs.log_id')) 
    channel1_id = Column(Float, nullable=True)
    channel1_data = Column(Float, nullable=True)
    channel2_id = Column(Float, nullable=True)
    channel2_data = Column(Float, nullable=True)
    channel3_id = Column(Float, nullable=True)
    channel3_data = Column(Float, nullable=True)
    channel4_id = Column(Float, nullable=True)
    channel4_data = Column(Float, nullable=True)
    channel5_id = Column(Float, nullable=True)
    channel5_data = Column(Float, nullable=True)
    channel6_id = Column(Float, nullable=True)
    channel6_data = Column(Float, nullable=True)
    channel7_id = Column(Float, nullable=True)
    channel7_data = Column(Float, nullable=True)
    channel8_id = Column(Float, nullable=True)
    channel8_data = Column(Float, nullable=True)
    channel9_id = Column(Float, nullable=True)
    channel9_data = Column(Float, nullable=True)
    channel10_id = Column(Float, nullable=True)
    channel10_data = Column(Float, nullable=True)
    channel11_id = Column(Float, nullable=True)
    channel11_data = Column(Float, nullable=True)
    channel12_id = Column(Float, nullable=True)
    channel12_data = Column(Float, nullable=True)
    channel13_id = Column(Float, nullable=True)
    channel13_data = Column(Float, nullable=True)
    channel14_id = Column(Float, nullable=True)
    channel14_data = Column(Float, nullable=True)

class ParameterChannelRelationship(Base):
    __tablename__ = 'parameter_channel_relationships'

    relationship_id = Column(Integer, primary_key=True, autoincrement=True)
    channel_id = Column(Integer, ForeignKey('device_channels.channel_id')) 
    param_type_id = Column(Integer, ForeignKey('parameter_types.param_type_id'))
    device_id = Column(Integer, ForeignKey('device.device_id')) 

class ParameterClass(Base):
    __tablename__ = 'parameter_classes'

    param_class_id = Column(Integer, primary_key=True, autoincrement=True)
    param_class = Column(String(255), nullable=True)

class ParameterType(Base):
    __tablename__ = 'parameter_types'

    param_type_id = Column(Integer, primary_key=True, autoincrement=True)
    param_type = Column(String(255), nullable=True)
    param_class_id = Column(Integer, ForeignKey('parameter_classes.param_class_id')) 
