package com.changhong.iot.alarmservice.dao;

import com.changhong.iot.alarmservice.entity.TAlarmData;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.changhong.iot.alarmservice.entity.TAlarmData;

public interface TAalarmDao extends MongoRepository<TAlarmData,String> {
}
