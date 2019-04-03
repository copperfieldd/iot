package com.changhong.iot.alarmservice.system;

import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.util.UUIDUtil;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.dao.TAlarmServiceDao;
import com.changhong.iot.alarmservice.dao.TAlarmTypeDao;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.entity.TAlarmType;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.PipedReader;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class Initialization {

    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;
    @Autowired
    private TAlarmTypeDao tAlarmTypeDao;
    @Autowired
    private TAlarmServiceDao tAlarmServiceDao;

    public Initialization(){};

    @PostConstruct
    public void initialization() {

        //初始化系统默认的告警类型
        initializationTAlarmType();

        //初始化系统默认的通知策略

        //将所有的告警规则加入缓存
        cacheRules();

        //将所有的告警子服务加入缓存
        cacheServices();

        //将所有的告警类型加入缓存
        cacheType();


    }

    /**
     * 初始化告警类型到缓存中
     */
    private void cacheType() {
        Map map = Cache.map;
        //将数据库中的告警规则全部放入map中
        List<TAlarmType> list = tAlarmTypeDao.findAll();
        Map typeMap = new ConcurrentHashMap();
        for (TAlarmType tAlarmType : list) {
           typeMap.put(tAlarmType.getAlarmType(),tAlarmType);
        }
        map.put("typeMap", typeMap);
    }

    /**
     * 初始化告警子服务到缓存中
     */
    private void cacheServices() {
        Map map = Cache.map;
        //将数据库中的告警规则全部放入map中
        List<TAlarmService> list = tAlarmServiceDao.findAll();
        Map serviceMap = new ConcurrentHashMap();
        for (TAlarmService tAlarmService : list) {
            serviceMap.put(tAlarmService.getAccessKey(), tAlarmService);
        }
        map.put("serviceMap", serviceMap);
    }

    /**
     * 初始化告警规则到缓存中
     */
    public void cacheRules() {
        Map map = Cache.map;
        //将数据库中的告警规则全部放入map中
        List<TAlarmRule> list = tAlarmRuleDao.findAll();
        Map ruleMap = new ConcurrentHashMap();
        for (TAlarmRule tAlarmRule : list) {
            ruleMap.put(tAlarmRule.getId(), tAlarmRule);
        }
        map.put("ruleMap", ruleMap);

    }

    /**
     * 初始化系统默认的告警类型
     */
    public void initializationTAlarmType() {
        List<TAlarmType> infoList = tAlarmTypeDao.findByProp("alarmType", "sys_info");
        List<TAlarmType> warnList = tAlarmTypeDao.findByProp("alarmType", "sys_warn");
        List<TAlarmType> errorList = tAlarmTypeDao.findByProp("alarmType", "sys_error");
        if (infoList.size() == 0) {
            TAlarmType tAlarmType = new TAlarmType();
            tAlarmType.setId(UUIDUtil.getUUID());
            tAlarmType.setAlarmType("sys_info");
            tAlarmType.setAlarmName("通知");
            tAlarmType.setAlarmDesc("系统默认支持的告警类型：通知");
            tAlarmType.setUpdateTime(new Date());
            tAlarmType.setCreateTime(new Date());
            tAlarmType.setDeletedFlag(false);
            tAlarmTypeDao.save(tAlarmType);
            System.err.println("初始化info成功！！");
        }

        if (warnList.size() == 0) {
            TAlarmType tAlarmType = new TAlarmType();
            tAlarmType.setId(UUIDUtil.getUUID());
            tAlarmType.setAlarmType("sys_warn");
            tAlarmType.setAlarmName("警告");
            tAlarmType.setAlarmDesc("系统默认支持的告警类型：警告");
            tAlarmType.setUpdateTime(new Date());
            tAlarmType.setCreateTime(new Date());
            tAlarmTypeDao.save(tAlarmType);
            System.err.println("初始化warn成功！！");
        }

        if (errorList.size() == 0) {
            TAlarmType tAlarmType = new TAlarmType();
            tAlarmType.setId(UUIDUtil.getUUID());
            tAlarmType.setAlarmType("sys_error");
            tAlarmType.setAlarmName("错误");
            tAlarmType.setAlarmDesc("系统默认支持的告警类型：错误");
            tAlarmType.setUpdateTime(new Date());
            tAlarmType.setCreateTime(new Date());
            tAlarmTypeDao.save(tAlarmType);
            System.err.println("初始化error成功！！");
        }
    }

}
