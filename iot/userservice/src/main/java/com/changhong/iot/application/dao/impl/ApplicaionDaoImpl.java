package com.changhong.iot.application.dao.impl;

import com.changhong.iot.application.dao.ApplicationDao;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicaionDaoImpl extends BaseMongoDaoImpl implements ApplicationDao {

    private Class clazz = ApplicationEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
