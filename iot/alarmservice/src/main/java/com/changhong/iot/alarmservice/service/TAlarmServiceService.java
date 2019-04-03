package com.changhong.iot.alarmservice.service;

import com.changhong.iot.alarmservice.entity.TAlarmService;

import java.util.Map;

public interface TAlarmServiceService {

    Map addAlarmService(TAlarmService tAlarmService) throws Exception;

    Map deleteAlarmService(String id, boolean flag) throws Exception;

    Map updateAlarmService(TAlarmService tAlarmService) throws Exception;

    Map searchAlarmService(Integer start, Integer count, String name, String startTime, String serviceName) throws Exception;
}
