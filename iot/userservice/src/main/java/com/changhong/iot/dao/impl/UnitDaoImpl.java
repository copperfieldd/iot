package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.UnitDao;
import com.changhong.iot.entity.UnitEntity;
import org.springframework.stereotype.Repository;

@Repository
public class UnitDaoImpl extends BaseMongoDaoImpl implements UnitDao {

    private Class clazz = UnitEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
