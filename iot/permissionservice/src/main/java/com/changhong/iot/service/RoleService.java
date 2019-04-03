package com.changhong.iot.service;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.RoleInfoDto;
import com.changhong.iot.dto.RoleOptDto;
import com.changhong.iot.entity.RoleEntity;

import java.util.List;
import java.util.Map;

public interface RoleService {

    public RoleInfoDto find(String roleId);

    public RoleInfoDto find(String tenantId, String roleId);

    public boolean save(RoleEntity roleEntity) throws ByteException;

    public boolean update(RoleEntity roleEntity) throws ByteException;

    public boolean delete(String tenantId, String roleId) throws ByteException;

    public void deleteByAppId(String appId) throws ByteException;

    public boolean delete(String roleId) throws ByteException;

    public PageModel list(int start, int count, String tenantId, String name);

    public PageModel listByAppId(int start, int count, String appId, String name);

    public List<Map<String, Object>> optRole(String tenantId);

    public List<RoleOptDto> findAllRolesByOrgId(String orgId) throws ByteException;

    public List<RoleOptDto> findAllRoleByMenuId(String menuId);

    public List<RoleOptDto> findAllRoleByApiId(String apiId);

    public List<String> findAllMenuIdsByOrgId(String orgId) throws ByteException;

    public List<String> findAllMenuIdsByOrgIds(List<String> orgId) throws ByteException;

    public List<String> findAllApiIdsByOrgId(String orgId) throws ByteException;

    public List<String> findAllApiIdsByOrgIds(List<String> orgId) throws ByteException;

    public boolean deleteArrayElementByProp(String arrayName, Object element);

    public boolean updateRoleByOrgId(String orgId, List<String> roleIds);

}
