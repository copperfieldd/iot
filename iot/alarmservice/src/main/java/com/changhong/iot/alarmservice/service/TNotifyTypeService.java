package com.changhong.iot.alarmservice.service;

import com.changhong.iot.alarmservice.entity.TNotifyType;

import java.util.Map;

public interface TNotifyTypeService {
    Map addTNotifyType(TNotifyType tNotifyType) throws Exception;

    Map deleteTNotifyType(String id,boolean flag) throws Exception;

    Map updateTNotifyType(TNotifyType tNotifyType)throws Exception;

    Map searchTNotifyType(Integer start, Integer count, String name, String notifyName, String serviceName, String startTime, String endTime) throws Exception;
}
