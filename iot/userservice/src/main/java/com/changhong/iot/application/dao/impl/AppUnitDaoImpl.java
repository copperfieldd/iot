package com.changhong.iot.application.dao.impl;

import com.changhong.iot.application.dao.AppUnitDao;
import com.changhong.iot.application.entity.AppUnit;
import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import org.springframework.stereotype.Repository;

@Repository
public class AppUnitDaoImpl extends BaseMongoDaoImpl implements AppUnitDao {

    private Class clazz = AppUnit.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
