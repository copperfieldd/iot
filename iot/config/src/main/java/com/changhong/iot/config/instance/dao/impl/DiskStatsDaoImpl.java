package com.changhong.iot.config.instance.dao.impl;

import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.instance.dao.DiskStatsDao;
import com.changhong.iot.config.instance.entity.DiskStats;
import org.springframework.stereotype.Repository;

@Repository
public class DiskStatsDaoImpl extends BaseMongoDaoImpl implements DiskStatsDao{

    @Override
    protected Class getEntityClass() {
        return DiskStats.class;
    }
}
