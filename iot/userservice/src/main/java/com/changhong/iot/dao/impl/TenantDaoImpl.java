package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.TenantDao;
import com.changhong.iot.entity.TenantEntity;
import org.springframework.stereotype.Repository;

@Repository
public class TenantDaoImpl extends BaseMongoDaoImpl implements TenantDao {

    private Class clazz = TenantEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
