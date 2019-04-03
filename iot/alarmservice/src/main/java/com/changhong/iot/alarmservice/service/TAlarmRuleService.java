package com.changhong.iot.alarmservice.service;

import com.changhong.iot.alarmservice.entity.TAlarmRule;

import java.util.Map;

public interface TAlarmRuleService {

    void addTAlarmRule(TAlarmRule tAlarmRule) throws Exception;

    Map deleteTAlarmRule(String id)throws Exception;

    void updateTAlarmRule(TAlarmRule tAlarmRule) throws Exception;

    Map findAll(Integer start, Integer count, String ruleName, String serviceName, String notity, String startTime, String endTime) throws Exception;

    Map item(String id) throws Exception;
}
