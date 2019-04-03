package com.changhong.iot.alarmservice.dao.impl;

import com.changhong.iot.alarmservice.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.alarmservice.dao.TAlarmDataDao;
import com.changhong.iot.alarmservice.entity.TAlarmData;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Repository
@Service
public class TAlarmDataDaoImpl extends BaseMongoDaoImpl<TAlarmData> implements TAlarmDataDao {
    @Override
    protected Class<TAlarmData> getEntityClass() {
        return null;
    }
}
