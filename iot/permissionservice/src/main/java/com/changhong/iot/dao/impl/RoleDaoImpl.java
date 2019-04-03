package com.changhong.iot.dao.impl;

import com.changhong.iot.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.dao.RoleDao;
import com.changhong.iot.entity.RoleEntity;
import com.mongodb.WriteResult;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoleDaoImpl extends BaseMongoDaoImpl implements RoleDao{

    private Class clazz = RoleEntity.class;

    @Override
    protected Class getEntityClass() {
        return clazz;
    }

    @Override
    public boolean deleteArrayElementByProp(String arrayName, Object element) {

        Query query = new Query();

        query.addCriteria(Criteria.where(arrayName).in(element));

        Update update = new Update();

        update.pull(arrayName, element);

        WriteResult result = this.mgt.updateMulti(query, update, getEntityClass());

        return result.wasAcknowledged();
    }

    @Override
    public boolean deleteArrayElemetByNinRoleIdsAndInOrgId(List<String> roleIds, String orgId) {

        Query query = new Query();

        query.addCriteria(Criteria.where(ConfigField.S_ID).nin(roleIds));
        query.addCriteria(Criteria.where(ConfigField.A_ORG_ID).in(orgId));

        Update update = new Update();

        update.pull(ConfigField.A_ORG_ID, orgId);

        WriteResult result = this.mgt.updateMulti(query, update, getEntityClass());

        return result.wasAcknowledged();
    }

    @Override
    public boolean addArrayElementByInRoleIdsAndNinOrgId(List<String> roleIds, String orgId) {

        Query query = new Query();

        query.addCriteria(Criteria.where(ConfigField.S_ID).in(roleIds));
        query.addCriteria(Criteria.where(ConfigField.A_ORG_ID).nin(orgId));

        Update update = new Update();

        update.push(ConfigField.A_ORG_ID, orgId);

        WriteResult result = this.mgt.updateMulti(query, update, getEntityClass());

        return result.wasAcknowledged();
    }
}
