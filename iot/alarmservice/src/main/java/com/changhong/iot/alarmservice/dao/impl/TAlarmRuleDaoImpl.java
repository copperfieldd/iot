package com.changhong.iot.alarmservice.dao.impl;

import com.changhong.iot.alarmservice.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import org.springframework.stereotype.Repository;

@Repository
public class TAlarmRuleDaoImpl extends BaseMongoDaoImpl<TAlarmRule> implements TAlarmRuleDao {
    @Override
    protected Class<TAlarmRule> getEntityClass() {
        return TAlarmRule.class;
    }
}
