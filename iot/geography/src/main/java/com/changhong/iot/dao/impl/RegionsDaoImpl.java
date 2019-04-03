package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.RegionsDao;
import com.changhong.iot.entity.RegionsEntity;
import org.springframework.stereotype.Repository;

@Repository
public class RegionsDaoImpl extends BaseMongoDaoImpl implements RegionsDao {
    @Override
    protected Class getEntityClass() {
        return RegionsEntity.class;
    }
}
