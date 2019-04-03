package com.changhong.iot.alarmservice.dao.impl;

import com.changhong.iot.alarmservice.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.alarmservice.entity.TAlarmType;
import org.springframework.stereotype.Repository;

import com.changhong.iot.alarmservice.dao.TAlarmTypeDao;

@Repository
public class TAlarmTypeDaoImpl extends BaseMongoDaoImpl<TAlarmType> implements TAlarmTypeDao {
    @Override
    protected Class<TAlarmType> getEntityClass() {
        return TAlarmType.class;
    }
}
