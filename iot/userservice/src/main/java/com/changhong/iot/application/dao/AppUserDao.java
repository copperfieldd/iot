package com.changhong.iot.application.dao;

import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.base.dao.BaseMongoDao;

public interface AppUserDao extends BaseMongoDao {

    long findAdminMax();

    public AppUser findAppManager(String appId);

}