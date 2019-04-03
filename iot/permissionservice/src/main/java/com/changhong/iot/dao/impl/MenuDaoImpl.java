package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.dao.MenuDao;
import com.changhong.iot.entity.MenuEntity;
import org.springframework.stereotype.Repository;

@Repository
public class MenuDaoImpl extends BaseMongoDaoImpl implements MenuDao {

    private Class clazz = MenuEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

}
