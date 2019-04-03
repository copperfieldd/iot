package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.ApiDao;
import com.changhong.iot.entity.ApiEntity;
import org.springframework.stereotype.Repository;

@Repository
public class ApiDaoImpl extends BaseMongoDaoImpl implements ApiDao {

    private Class clazz = ApiEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
