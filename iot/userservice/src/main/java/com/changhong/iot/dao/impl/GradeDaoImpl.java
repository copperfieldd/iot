package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.GradeDao;
import com.changhong.iot.entity.GradeEntity;
import org.springframework.stereotype.Repository;

@Repository
public class GradeDaoImpl extends BaseMongoDaoImpl implements GradeDao {

    private Class clazz = GradeEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
