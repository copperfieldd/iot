package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.UserDao;
import com.changhong.iot.entity.UserEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl extends BaseMongoDaoImpl implements UserDao {

    private Class clazz = UserEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

    @Override
    public long findAdminMax() {

        Query query = new Query();

        query.with(new Sort(Sort.Direction.DESC, "max"));

        UserEntity user = (UserEntity) this.mgt.findOne(query, getEntityClass());

        if (user == null || user.getMax() == null) {
            return 0;
        }

        return user.getMax();
    }
}
