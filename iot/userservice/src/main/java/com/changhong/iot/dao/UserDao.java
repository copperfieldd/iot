package com.changhong.iot.dao;

import com.changhong.iot.base.dao.BaseMongoDao;

public interface UserDao extends BaseMongoDao {

    long findAdminMax();

}