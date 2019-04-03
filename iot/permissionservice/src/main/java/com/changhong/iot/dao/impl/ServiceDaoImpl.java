package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.ServiceDao;
import com.changhong.iot.entity.ServiceEntity;
import org.springframework.stereotype.Repository;

@Repository
public class ServiceDaoImpl extends BaseMongoDaoImpl implements ServiceDao {

    private Class clazz = ServiceEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
