from sqlalchemy import Column, Integer, String, ForeignKey, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ExperimentParameters(Base):
    __tablename__ = 'experiment_parameters'

    experiment_param_id = Column(Integer, primary_key=True, autoincrement=True)
    param_type_id = Column(Integer, ForeignKey('parameter_types.param_type_id')) 
    log_id = Column(Integer, ForeignKey('experiment_logs.log_id'))
    param_value = Column(String(255), nullable=True)

class ExperimentLogs(Base):
    __tablename__ = 'experiment_logs'

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(TIMESTAMP, nullable=True)
    comments = Column(Text, nullable=True)
    device_id = Column(Integer, ForeignKey('device.device_id')) 

class ExperimentChannels(Base):
    __tablename__ = 'experiment_channels'

    experiment_channel_id = Column(Integer, primary_key=True, autoincrement=True)
    log_id = Column(Integer, ForeignKey('experiment_logs.log_id'))  
    defined_channel_id = Column(Integer)  
    defined_param_type_id = Column(Integer)

class Device(Base):
    __tablename__ = 'device'

    device_id = Column(Integer, primary_key=True, autoincrement=True)
    device_name = Column(String(255), nullable=True)

class DeviceChannel(Base):
    __tablename__ = 'device_channels'

    channel_id = Column(Integer, primary_key=True, autoincrement=True)
    channel_name = Column(String(255), nullable=True)

class ParameterClasses(Base):
    __tablename__ = 'parameter_classes'

    param_class_id = Column(Integer, primary_key=True, autoincrement=True)
    param_class = Column(String(255), nullable=True)

class ParameterTypes(Base):
    __tablename__ = 'parameter_types'

    param_type_id = Column(Integer, primary_key=True, autoincrement=True)
    param_type = Column(String(255), nullable=True)
    param_class_id = Column(Integer, ForeignKey('parameter_classes.param_class_id'))

class ParameterChannelRelationships(Base):
    __tablename__ = 'parameter_channel_relationships'

    relationship_id = Column(Integer, primary_key=True, autoincrement=True)
    channel_id = Column(Integer, ForeignKey('device_channels.channel_id')) 
    param_type_id = Column(Integer, ForeignKey('parameter_types.param_type_id'))
    device_id = Column(Integer, ForeignKey('device.device_id'))

# Now that all the classes have been defined, we can add the remaining relationships
    
DeviceChannel.parameter_channel_relationships = relationship('ParameterChannelRelationships', backref='device_channels', uselist=False)
Device.parameter_channel_relationships = relationship('ParameterChannelRelationships', backref='device')
Device.experiment_logs = relationship('ExperimentLogs', backref='device')
ParameterClasses.parameter_types = relationship("ParameterTypes", backref="parameter_classes")
ParameterTypes.parameter_channel_relationships = relationship('ParameterChannelRelationships', backref='parameter_types')
ParameterTypes.experiment_parameters = relationship('ExperimentParameters', backref='parameter_types')
ExperimentLogs.experiment_channels = relationship('ExperimentChannels', backref='experiment_logs')
ExperimentLogs.experiment_parameters = relationship('ExperimentParameters', backref='experiment_logs')
