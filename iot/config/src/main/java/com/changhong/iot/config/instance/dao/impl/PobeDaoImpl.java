package com.changhong.iot.config.instance.dao.impl;

import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.instance.dao.PobeDao;
import com.changhong.iot.config.instance.entity.PobeEntity;
import org.springframework.stereotype.Repository;

@Repository
public class PobeDaoImpl extends BaseMongoDaoImpl implements PobeDao{

    @Override
    protected Class getEntityClass() {
        return PobeEntity.class;
    }
}
