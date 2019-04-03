package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.CountryDao;
import com.changhong.iot.entity.CountryEntity;
import org.springframework.stereotype.Repository;

@Repository
public class CountryDaoImpl extends BaseMongoDaoImpl implements CountryDao{
    @Override
    protected Class getEntityClass() {
        return CountryEntity.class;
    }
}
