package com.changhong.iot.service;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.MenuInfoDto;
import com.changhong.iot.dto.MenuOptDto;
import com.changhong.iot.entity.MenuEntity;

import java.util.List;

public interface MenuService {

    public MenuInfoDto find(String menuId);

    public MenuInfoDto find(String tenantId, String menuId);

    public boolean save(MenuEntity menuEntity) throws ByteException;

    public boolean update(MenuEntity menuEntity) throws ByteException;

    public boolean delete(String menuId) throws ByteException;

    public void deleteByTenantId(String tenantId) throws ByteException;

    public void deleteByAppId(String appId) throws ByteException;

    public boolean delete(String tenantId, String menuId);

    public boolean save(List<MenuEntity> menus) throws ByteException;

    public List<MenuOptDto> listMenu(String tenantId, String menuName);

    public boolean sortMenu(String thisId, String nextId) throws ByteException;

    public List<MenuInfoDto> findAllMenuByOrgId(String id) throws ByteException;

    public List<MenuInfoDto> findAllMenuByAppId(String id) throws ByteException;

    public List<String> findMenuIdsByOrgId(String id) throws ByteException;

    public List<MenuOptDto> findByApidId(String apiId);

    public List<MenuOptDto> findAllMenuByRoleId(String roleId);

    public List<MenuOptDto> findAllMenusByTenant(String tenantId);

    public List<MenuInfoDto> findMenuByMenuIds(List<String> menuIds);

}
