package com.changhong.iot.alarmservice.test;

import com.changhong.iot.alarmservice.dao.TAlarmDataDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmData;
import com.changhong.iot.alarmservice.system.Cache;
import com.changhong.iot.alarmservice.util.UUIDUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
public class TestDemo {

    @Autowired
    private TAlarmDataDao tAlarmDataDaol;

    @RequestMapping("test")
    public Map test(){
       for (int i = 0;i<20;i++) {
           TAlarmData tAlarmData = new TAlarmData();
           tAlarmData.setId(UUIDUtil.getUUID());
           tAlarmData.setAlarmName("告警" + i);
           tAlarmData.setAlarmData("米荣的告警数据" + i);
           tAlarmData.setServiceName("米荣服务" + i);
           tAlarmData.setAlarmType("田田田米荣类型" + i);
           tAlarmData.setAlarmStatus(1);
           tAlarmData.setCreateTime(new Date());
           tAlarmDataDaol.save(tAlarmData);
       }
        return APIResult.getSuccess();
    }
    @RequestMapping("test1")
    public Map test1(){
        Map map = Cache.map;
        map.put("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aaaaaaaaaaaaaaaaaaaaaaa");
        return Cache.map;
    }
}
