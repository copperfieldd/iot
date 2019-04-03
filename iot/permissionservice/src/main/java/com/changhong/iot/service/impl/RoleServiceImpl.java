package com.changhong.iot.service.impl;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.*;
import com.changhong.iot.dao.RoleDao;
import com.changhong.iot.dto.RoleDto;
import com.changhong.iot.dto.RoleInfoDto;
import com.changhong.iot.dto.RoleOptDto;
import com.changhong.iot.entity.RoleEntity;
import com.changhong.iot.service.RoleService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import com.mongodb.BasicDBObject;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class RoleServiceImpl implements RoleService {

    @Resource
    private RoleDao roleDaoImpl;

    @Resource
    private Checkpermiss checkPermiss;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public RoleInfoDto find(String tenantId, String roleId) {

        RoleEntity entity = (RoleEntity)roleDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {roleId, tenantId, ConfigValue.NOT_DELETE});

        return (RoleInfoDto) EntityUtil.entityToDto(entity, RoleInfoDto.class);
    }

    @Override
    public RoleInfoDto find(String roleId) {

        RoleEntity entity = (RoleEntity)roleDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {roleId, ConfigValue.NOT_DELETE});

        return (RoleInfoDto) EntityUtil.entityToDto(entity, RoleInfoDto.class);
    }

    @Override
    public boolean save(RoleEntity roleEntity) throws ByteException {

        checkPermiss.checkPermiss(myThreadLocal.getUserId(), roleEntity.getMenuIds(), roleEntity.getApiIds());

        RoleEntity entity = (RoleEntity) roleDaoImpl.findMax(ConfigField.I_SORT_NUM);
        int sort = ConfigValue.SORT_STEP_LENGTH;
        if (entity != null) {
            sort += entity.getSortNum();
        }
        Date date = new Date();

        if (myThreadLocal.isAppUser()) {
            roleEntity.setAppId(myThreadLocal.getUser().getAppId());
        }
        roleEntity.setValid(true);
        roleEntity.setId(UUIDUtil.getUUID());
        roleEntity.setTenantId(myThreadLocal.getTenantId());
        roleEntity.setCreatorName(myThreadLocal.getUserName());
        roleEntity.setCreatorId(myThreadLocal.getUserId());
        roleEntity.setCreateTime(date);
        roleEntity.setUpdateTime(date);
        roleEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        roleEntity.setSortNum(sort);

        roleDaoImpl.save(roleEntity);

        return true;
    }

    @Override
    public boolean update(RoleEntity roleEntity) throws ByteException {

        RoleEntity entity = (RoleEntity) roleDaoImpl.find(roleEntity.getId());
        if (entity == null) {
            throw new ByteException(1012);
        }
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }

        checkPermiss.checkPermiss(myThreadLocal.getUserId(), roleEntity.getMenuIds(), roleEntity.getApiIds());

        roleEntity.setUpdateTime(new Date());

        return roleDaoImpl.updateByParamNotNull(roleEntity);
    }

    @Override
    public boolean delete(String tenantId, String roleId) throws ByteException {

        RoleInfoDto roleInfoDto = find(tenantId, roleId);

        if (roleInfoDto == null) {
            throw new ByteException(1012);
        }

        return roleDaoImpl.updateOneByProps(
                new String[] { ConfigField.S_ID, ConfigField.S_TENANT_ID},
                new Object[] { roleId, tenantId},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public void deleteByAppId(String appId) throws ByteException {
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(appId)) {
            throw new ByteException(1006);
        }

        roleDaoImpl.updateOneByProp(
                "appId", appId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String roleId) throws ByteException {

        RoleEntity entity = (RoleEntity) roleDaoImpl.find(roleId);
        if (entity == null) {
            throw new ByteException(1012);
        }
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }


        return roleDaoImpl.updateOneByProp(
                ConfigField.S_ID, roleId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public PageModel list(int start, int count, String tenantId, String name) {

        PageModel page = null;

        if (EmptyUtil.isNotEmpty(name)) {
            page = roleDaoImpl.pageLikeAndProps(start, count,
                    new String[] {ConfigField.S_NAME}, new Object[] {name},
                    new String[] {ConfigField.S_TENANT_ID, "appId", ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, new BasicDBObject("$exists", 0), ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
        } else {
            page = roleDaoImpl.pageByProps(start, count,
                    new String[] {ConfigField.S_TENANT_ID, "appId", ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, new BasicDBObject("$exists", 0), ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
        }

        page.setList(EntityUtil.entityListToDtoList(page.getList(), RoleDto.class));

        return page;
    }

    @Override
    public PageModel listByAppId(int start, int count, String appId, String name) {

        PageModel page = null;

        if (EmptyUtil.isNotEmpty(name)) {
            page = roleDaoImpl.pageLikeAndProps(start, count,
                    new String[] {ConfigField.S_NAME}, new Object[] {name},
                    new String[] {"appId", ConfigField.I_DELETE_FLAG},
                    new Object[] {appId, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);

        } else {
            page = roleDaoImpl.pageByProps(start, count,
                    new String[] {"appId", ConfigField.I_DELETE_FLAG},
                    new Object[] {appId, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
        }

        page.setList(EntityUtil.entityListToDtoList(page.getList(), RoleDto.class));

        return page;
    }

    @Override
    public List<Map<String, Object>> optRole(String tenantId) {

        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = null;

        List<RoleEntity> roles = roleDaoImpl.findByProps(new String[]{ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[]{tenantId, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);

        for (RoleEntity role : roles) {
            map = new HashMap<>();
            map.put("id", role.getId());
            map.put("name", role.getName());

            list.add(map);
        }

        return list;
    }

    @Override
    public List<RoleOptDto> findAllRolesByOrgId(String id) {

        List<RoleEntity> roleOptDtos = null;

        roleOptDtos = roleDaoImpl.findByProps(
                new String[]{ConfigField.A_ORG_ID, ConfigField.I_DELETE_FLAG},
                new Object[]{id, ConfigValue.NOT_DELETE});

        if (EmptyUtil.isEmpty(roleOptDtos)) {
            roleOptDtos = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(roleOptDtos, RoleOptDto.class);
    }

    @Override
    public List<RoleOptDto> findAllRoleByMenuId(String menuId) {

        List<String> ids = new ArrayList<>();
        ids.add(menuId);

        List<RoleOptDto> roleOptDtos = roleDaoImpl.findAllByPropIn(ConfigField.A_MENU_ID, ids,
                    new String[]{ConfigField.I_DELETE_FLAG}, new Object[]{ConfigValue.NOT_DELETE});

        if (EmptyUtil.isEmpty(roleOptDtos)) {
            roleOptDtos = new ArrayList<>();
        }

        return roleOptDtos;
    }

    @Override
    public List<RoleOptDto> findAllRoleByApiId(String apiId) {

        List<String> ids = new ArrayList<>();
        ids.add(apiId);

        List<RoleOptDto> roleOptDtos = roleDaoImpl.findAllByPropIn(ConfigField.A_API_ID, ids,
                    new String[]{ConfigField.I_DELETE_FLAG}, new Object[]{ConfigValue.NOT_DELETE});

        if (EmptyUtil.isEmpty(roleOptDtos)) {
            roleOptDtos = new ArrayList<>();
        }

        return roleOptDtos;
    }

    @Override
    public List<String> findAllMenuIdsByOrgId(String orgId) {

        List<String> orgIds = new ArrayList();
        orgIds.add(orgId);

        return findAllMenuIdsByOrgIds(orgIds);
    }

    @Override
    public List<String> findAllMenuIdsByOrgIds(List<String> orgId) {

        List<String> menuIds = new ArrayList<>();

        List<RoleEntity> roleEntities = roleDaoImpl.findAllByPropIn(ConfigField.A_ORG_ID, orgId,
                new String[]{ConfigField.I_DELETE_FLAG},
                new Object[]{ConfigValue.NOT_DELETE});

        List<String> ids = null;
        if (EmptyUtil.isNotEmpty(roleEntities)) {
            for (RoleEntity roleEntity : roleEntities) {
                ids = roleEntity.getMenuIds();
                if (EmptyUtil.isNotEmpty(ids)) {
                    menuIds.addAll(ids);
                }
            }
        }

        return menuIds;
    }

    @Override
    public List<String> findAllApiIdsByOrgId(String orgId) throws ByteException {

        List<String> orgIds = new ArrayList();
        orgIds.add(orgId);

        return findAllApiIdsByOrgIds(orgIds);
    }

    @Override
    public List<String> findAllApiIdsByOrgIds(List<String> orgId) throws ByteException {

        List<String> apiIds = new ArrayList<>();

        List<RoleEntity> roleEntities = roleDaoImpl.findAllByPropIn(ConfigField.A_ORG_ID, orgId,
                new String[]{ConfigField.I_DELETE_FLAG},
                new Object[]{ConfigValue.NOT_DELETE});

        List<String> ids = null;
        if (EmptyUtil.isNotEmpty(roleEntities)) {
            for (RoleEntity roleEntity : roleEntities) {
                ids = roleEntity.getApiIds();
                if (EmptyUtil.isNotEmpty(ids)) {
                    apiIds.addAll(ids);
                }
            }
        }

        return apiIds;
    }

    @Override
    public boolean deleteArrayElementByProp(String arrayName, Object element) {
        return roleDaoImpl.deleteArrayElementByProp(arrayName, element);
    }

    @Override
    public boolean updateRoleByOrgId(String orgId, List<String> roleIds) {

        roleDaoImpl.deleteArrayElemetByNinRoleIdsAndInOrgId(roleIds, orgId);
        roleDaoImpl.addArrayElementByInRoleIdsAndNinOrgId(roleIds, orgId);

        return true;
    }
}
