package com.changhong.iot.dao;

import com.changhong.iot.base.dao.BaseMongoDao;

import java.util.List;

public interface RoleDao extends BaseMongoDao {

    /**
     * 删除数组元素，当arrayName中有element元素时，删除arrayName中的element
     */
    public boolean deleteArrayElementByProp(String arrayName, Object element);

    /**
     * 删除数组元素，当角色id不存在于roleIds中，并且orgIds中有orgId时，删除orgIds中的orgId
     */
    public boolean deleteArrayElemetByNinRoleIdsAndInOrgId(List<String> roleIds, String orgId);

    /**
     * 添加数组元素，当角色id存在于roleIds中，并且orgIds中没有有orgId时，添加orgId到orgIds中
     */
    public boolean addArrayElementByInRoleIdsAndNinOrgId(List<String> roleIds, String orgId);
}
