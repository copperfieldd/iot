package com.changhong.iot.application.dao.impl;

import com.changhong.iot.application.dao.AppUserDao;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.entity.UserEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class AppUserDaoImpl extends BaseMongoDaoImpl implements AppUserDao {

    private Class clazz = AppUser.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

    @Override
    public long findAdminMax() {

        Query query = new Query();

        query.with(new Sort(Sort.Direction.DESC, "max"));

        AppUser user = (AppUser) this.mgt.findOne(query, getEntityClass());

        if (user == null || user.getMax() == null) {
            return 0;
        }

        return user.getMax();
    }

    @Override
    public AppUser findAppManager(String appId) {
        AppUser entity = (AppUser)uniqueByProps(
                new String[] {"appId","type", ConfigField.I_DELETE_FLAG},
                new Object[] {appId, ConfigValue.APPLICATION_MANAGER, ConfigValue.NOT_DELETE});

        return entity;

    }

}
