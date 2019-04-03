package com.changhong.iot.alarmservice.dao.impl;

import com.changhong.iot.alarmservice.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import org.springframework.stereotype.Repository;

import com.changhong.iot.alarmservice.dao.TAlarmServiceDao;

@Repository
public class TAlarmServiceDaoImpl extends BaseMongoDaoImpl<TAlarmService> implements TAlarmServiceDao {
    @Override
    protected Class<TAlarmService> getEntityClass() {
        return TAlarmService.class;
    }
}
