package com.changhong.iot.alarmservice.service;

import java.util.Map;

import com.changhong.iot.alarmservice.entity.TAlarmData;

import javax.servlet.http.HttpServletResponse;

public interface TAlarmDataService {
    Map addAlarmData(TAlarmData tAlarmData) throws Exception;

    Map alarmDataList(Integer start, Integer count, String alarmName, String serviceName, String alarmType, String alarmData, String startTime, String endTime) throws Exception;

    void exportExcel(Integer start, Integer count, String alarmName, String serviceName, String alarmType, String alarmData, String startTime, String endTime, Integer excelType, HttpServletResponse response) throws Exception;
}
