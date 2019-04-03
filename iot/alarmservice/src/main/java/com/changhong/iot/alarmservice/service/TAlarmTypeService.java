package com.changhong.iot.alarmservice.service;

import com.changhong.iot.alarmservice.entity.TAlarmType;

import java.util.Map;

public interface TAlarmTypeService {
    Map addTAlarmType(TAlarmType tAlarmType) throws Exception;

    Map deleteTalrmType(String id,boolean flag) throws Exception;

    Map updateTAlarmType(TAlarmType tAlarmType) throws Exception;

    Map searchTAlarmType(Integer start, Integer count, String alarmName, String alarmType, String startTime, String endTime) throws Exception;
}
