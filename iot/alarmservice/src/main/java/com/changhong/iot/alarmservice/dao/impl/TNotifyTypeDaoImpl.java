package com.changhong.iot.alarmservice.dao.impl;

import com.changhong.iot.alarmservice.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.alarmservice.entity.TNotifyType;
import org.springframework.stereotype.Repository;

import com.changhong.iot.alarmservice.dao.TNotifyTypeDao;

@Repository
public class TNotifyTypeDaoImpl extends BaseMongoDaoImpl<TNotifyType> implements TNotifyTypeDao {
    @Override
    protected Class getEntityClass() {
        return TNotifyType.class;
    }

}
