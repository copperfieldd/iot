package com.changhong.iot.config.instance.dao.impl;

import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.instance.dao.DiskStatsDao;
import com.changhong.iot.config.instance.dao.MemoryStatsDao;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.MemoryStats;
import org.springframework.stereotype.Repository;

@Repository
public class MemoryStatsDaoImpl extends BaseMongoDaoImpl implements MemoryStatsDao{

    @Override
    protected Class getEntityClass() {
        return MemoryStats.class;
    }
}
