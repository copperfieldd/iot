package com.changhong.iot.service.impl;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.MenuDao;
import com.changhong.iot.dto.*;
import com.changhong.iot.entity.*;
import com.changhong.iot.rpc.GradeService;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.service.MenuService;
import com.changhong.iot.service.RoleService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    @Resource
    private MenuDao menuDaoImpl;

    @Resource
    private RoleService roleServiceImpl;

    @Resource
    private GradeService gradeService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Resource
    private ApiService apiService;

    @Resource
    private OrgService orgService;

    @Override
    public MenuInfoDto find(String tenantId, String menuId) {

        MenuEntity entity = (MenuEntity)menuDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {menuId, tenantId, ConfigValue.NOT_DELETE});

        return (MenuInfoDto) EntityUtil.entityToDto(entity, MenuInfoDto.class);
    }

    @Override
    public MenuInfoDto find(String menuId) {

        MenuEntity entity = (MenuEntity)menuDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {menuId, ConfigValue.NOT_DELETE});

        MenuInfoDto menu = (MenuInfoDto) EntityUtil.entityToDto(entity, MenuInfoDto.class);

        setUrl(menu);

        if (menu.getPid().equals(ConfigValue.TOP_ID)) {
            menu.setPname("/");
        } else {
            MenuEntity menuInfoDto1 = (MenuEntity) menuDaoImpl.find(menu.getPid());
            if (menuInfoDto1 != null) {
                menu.setPname(menuInfoDto1.getName());
            }
        }
        return menu;
    }

    @Override
    public List<MenuOptDto> findByApidId(String apiId) {

        List<MenuEntity> entitys = menuDaoImpl.findByProps(
                new String[] {ConfigField.S_API_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {apiId, ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(entitys, MenuOptDto.class);
    }

    @Override
    public boolean save(MenuEntity menuEntity) throws ByteException {

        MenuEntity entity = (MenuEntity) menuDaoImpl.findMax(ConfigField.I_SORT_NUM);
        int sort = ConfigValue.SORT_STEP_LENGTH;
        if (entity != null) {
            sort += entity.getSortNum();
        }
        Date date = new Date();

        if (EmptyUtil.isEmpty(menuEntity.getPid())) {
            menuEntity.setPid(ConfigValue.TOP_ID);
        }
        if (myThreadLocal.isAppUser()) {
            menuEntity.setAppId(myThreadLocal.getUser().getAppId());
        }
        menuEntity.setId(UUIDUtil.getUUID());
        menuEntity.setValid(true);
        menuEntity.setTenantId(myThreadLocal.getTenantId());
        menuEntity.setCreateTime(date);
        menuEntity.setUpdateTime(date);
        menuEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        menuEntity.setSortNum(sort);

        menuDaoImpl.save(menuEntity);

        return true;
    }

    @Override
    public boolean update(MenuEntity menuEntity) throws ByteException {

        MenuEntity entity = (MenuEntity) menuDaoImpl.find(menuEntity.getId());
        if (entity == null) {
            throw new ByteException(1012);
        }
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }

        menuEntity.setUpdateTime(new Date());

        return menuDaoImpl.updateByParamNotNull(menuEntity);
    }

    @Override
    public void deleteByTenantId(String tenantId) throws ByteException {
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser()) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(tenantId)) {
            throw new ByteException(1006);
        }
        menuDaoImpl.updateOneByProp(
                ConfigField.S_TENANT_ID, tenantId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public void deleteByAppId(String appId) throws ByteException {
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(appId)) {
            throw new ByteException(1006);
        }
        menuDaoImpl.updateOneByProp(
                "appId", appId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String tenantId, String menuId) {

        roleServiceImpl.deleteArrayElementByProp(ConfigField.A_MENU_ID, menuId);

        return menuDaoImpl.updateOneByProps(
                new String[] { ConfigField.S_ID, ConfigField.S_TENANT_ID},
                new Object[] { menuId, tenantId},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String menuId) throws ByteException {

        MenuEntity entity = (MenuEntity) menuDaoImpl.find(menuId);
        if (entity == null) {
            throw new ByteException(1012);
        }
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }

        roleServiceImpl.deleteArrayElementByProp(ConfigField.A_MENU_ID, menuId);

        return menuDaoImpl.updateOneByProp(
                ConfigField.S_ID, menuId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean save(List<MenuEntity> menuEntities) throws ByteException {

        MenuEntity entity = (MenuEntity) menuDaoImpl.findMax(ConfigField.I_SORT_NUM);
        int sort = ConfigValue.SORT_STEP_LENGTH;
        if (entity != null) {
            sort += entity.getSortNum();
        }
        Date date = new Date();

        for (MenuEntity menuEntity : menuEntities) {
            if (EmptyUtil.isEmpty(menuEntity.getPid())) {
                menuEntity.setPid(ConfigValue.TOP_ID);
            }
            if (myThreadLocal.isAppUser()) {
                menuEntity.setAppId(myThreadLocal.getUser().getAppId());
            }
            menuEntity.setId(UUIDUtil.getUUID());
            menuEntity.setValid(true);
            menuEntity.setTenantId(myThreadLocal.getTenantId());
            menuEntity.setCreateTime(date);
            menuEntity.setUpdateTime(date);
            menuEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
            menuEntity.setSortNum(sort);

            sort += ConfigValue.SORT_STEP_LENGTH;
        }

        return menuDaoImpl.saveAll(menuEntities);
    }

    @Override
    public List<MenuOptDto> listMenu(String tenantId, String menuName) {

        List<MenuEntity> menus = null;

        if (EmptyUtil.isNotEmpty(menuName)) {
            menus = menuDaoImpl.findLikeAndProps(
                    new String[] {ConfigField.S_NAME}, new Object[] {menuName},
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
        } else {
            menus = menuDaoImpl.findByProps(
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
        }
        List<MenuOptDto> menuOptDtos = new ArrayList<>();

        if (!ConfigValue.TOP_ID.equals(tenantId)) {

            List<String> menuIds = gradeService.getMenuIdsByTenantId(tenantId);

            List<MenuInfoDto> menuInfoDtos = findMenuByMenuIds(menuIds);

            menuOptDtos.addAll(EntityUtil.entityListToDtoList(menuInfoDtos, MenuOptDto.class));
        }

        menuOptDtos.addAll(EntityUtil.entityListToDtoList(menus, MenuOptDto.class));

        return treeSort(menuOptDtos, ConfigValue.TOP_ID);
    }

    @Override
    public List<MenuInfoDto> findAllMenuByOrgId(String id) throws ByteException {

        List<String> menuIds = findMenuIdsByOrgId(id);

        List<MenuInfoDto> menuOptDtos = findMenuByMenuIds(menuIds);

        setUrl(menuOptDtos);

        return treeSort(ConfigValue.TOP_ID, menuOptDtos);
    }

    @Override
    public List<MenuInfoDto> findAllMenuByAppId(String id) throws ByteException {

        UserDto appManager = orgService.findManagerByAppId(id);

        return findAllMenuByOrgId(appManager.getId());
//        List<MenuEntity> menus = menuDaoImpl.findByProps(
//                new String[] {"appId", ConfigField.I_DELETE_FLAG},
//                new Object[] {id, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);
//
//        return EntityUtil.entityListToDtoList(menus, MenuInfoDto.class);
    }

    @Override
    public List<String> findMenuIdsByOrgId(String id) throws ByteException {

        List<String> menuIds = null;

        //如果是平台管理员，则直接查询租户的api即可
        UserDto user = orgService.findUser(id);
        if (user.getType().equals(ConfigValue.PLATFORM_MANAGER) || user.getType().equals(ConfigValue.TENANT_MANAGER)) {
            menuIds = findAllMenuIdsByTenants(user.getTenantId());
        } else {
            //角色中的api （包括继承来的）
            List<String> pids = orgService.findPids(id);
            pids.add(0, id);
            pids.remove(ConfigValue.TOP_ID);
            menuIds = roleServiceImpl.findAllMenuIdsByOrgIds(pids);

            if (ConfigValue.APPLICATION_MANAGER.equals(user.getType())) {
                List<MenuEntity> menus = menuDaoImpl.findByProps(
                        new String[] {"appId", ConfigField.I_DELETE_FLAG},
                        new Object[] {id, ConfigValue.NOT_DELETE}, ConfigField.I_SORT_NUM);

                for (MenuEntity menuEntity : menus) {
                    if (!menuIds.contains(menuEntity.getId())) {
                        menuIds.add(menuEntity.getId());
                    }
                }
            }
        }

        return menuIds;
    }

    @Override
    public List<MenuOptDto> findAllMenuByRoleId(String roleId) {

        RoleInfoDto roleInfoDto = roleServiceImpl.find(roleId);

        List<String> menuIds = null;

        if (roleInfoDto != null) {
            menuIds = roleInfoDto.getMenuIds();
        }

        List<MenuInfoDto> menuOptDtos = findMenuByMenuIds(menuIds);

        return treeSort(EntityUtil.entityListToDtoList(menuOptDtos, MenuOptDto.class), ConfigValue.TOP_ID);
    }

    @Override
    public boolean sortMenu(String thisId, String nextId) throws ByteException {

        boolean flag = false;

        int sort = ConfigValue.SORT_STEP_LENGTH;

        //  先查询出自己的信息
        MenuEntity entity = (MenuEntity)menuDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {thisId, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1012);
        }

        //  判断是否 不是排在最后
        if (EmptyUtil.isNotEmpty(nextId)) {

            //  获取后面一个元素信息
            MenuEntity nextEntity = (MenuEntity)menuDaoImpl.uniqueByProps(
                    new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {nextId, ConfigValue.NOT_DELETE});

            if (nextEntity != null) {

                //计算出当前元素的sortNum
                sort = nextEntity.getSortNum() - 1;

                //如果当前元素的sortNum正好是步长的倍数，则证明需要重新排序
                if (sort % ConfigValue.SORT_STEP_LENGTH == 0) {

                    List<MenuEntity> list = menuDaoImpl.findByProp(
                            ConfigField.S_PID, nextEntity.getPid(),ConfigField.I_SORT_NUM);

                    if (EmptyUtil.isEmpty(list)) {
                        throw new ByteException(1001);
                    }

                    sort = ConfigValue.SORT_STEP_LENGTH;

                    MenuEntity temp = null;
                    int tempSort = 0;

                    for (MenuEntity menuEntity : list) {

                        if (menuEntity.getId().equals(thisId)) {
                            temp = menuEntity;
                            continue;
                        }
                        if (menuEntity.getId().equals(nextId)) {
                            tempSort = sort;
                            sort += ConfigValue.SORT_STEP_LENGTH;
                        }

                        menuDaoImpl.updateOneByProp(ConfigField.S_ID, menuEntity.getId(),
                                ConfigField.I_SORT_NUM, sort);

                        sort += ConfigValue.SORT_STEP_LENGTH;
                    }

                    menuDaoImpl.updateOneByProp(ConfigField.S_ID, temp.getId(),
                            ConfigField.I_SORT_NUM, tempSort);

                    return true;
                }
                flag = true;
            }
        }

        //  如果是排在最后 获取sortNum最大值+上步长即可
        if (!flag) {

            MenuEntity lastEntity = (MenuEntity)menuDaoImpl.findMax(ConfigField.I_SORT_NUM);

            sort = lastEntity.getSortNum();

            sort += ConfigValue.SORT_STEP_LENGTH - sort % ConfigValue.SORT_STEP_LENGTH;
        }

        return menuDaoImpl.updateOneByProp(ConfigField.S_ID, entity.getId(),
                ConfigField.I_SORT_NUM, sort);

    }

    @Override
    public List<MenuOptDto> findAllMenusByTenant(String tenantId) {

        List<MenuOptDto> menus = null;

        if (!ConfigValue.TOP_ID.equals(tenantId)) {

            List<String> menuIds = gradeService.getMenuIdsByTenantId(tenantId);

            List<MenuInfoDto> menuInfoDtos = findMenuByMenuIds(menuIds);

            menus = EntityUtil.entityListToDtoList(menuInfoDtos, MenuOptDto.class);
        }

        List<MenuEntity> entitys = menuDaoImpl.findByProps(
                new String[] { ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] { tenantId, ConfigValue.NOT_DELETE});

        List<MenuOptDto> list =  EntityUtil.entityListToDtoList(entitys, MenuOptDto.class);

        if (EmptyUtil.isNotEmpty(menus)) {
            menus.addAll(list);
        } else {
            menus = list;
        }

        return treeSort(menus, ConfigValue.TOP_ID);
    }

    public List<String> findAllMenuIdsByTenants(String tenantId) {

        List<MenuOptDto> menus = null;

        if (!ConfigValue.TOP_ID.equals(tenantId)) {

            List<String> menuIds = gradeService.getMenuIdsByTenantId(tenantId);

            List<MenuInfoDto> menuInfoDtos = findMenuByMenuIds(menuIds);

            menus = EntityUtil.entityListToDtoList(menuInfoDtos, MenuOptDto.class);
        }

        List<MenuEntity> entitys = menuDaoImpl.findByProps(
                new String[] { ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] { tenantId, ConfigValue.NOT_DELETE});

        List<MenuOptDto> list =  EntityUtil.entityListToDtoList(entitys, MenuOptDto.class);

        if (EmptyUtil.isNotEmpty(menus)) {
            menus.addAll(list);
        } else {
            menus = list;
        }

        List<String> ids = new ArrayList<>();
        for (MenuOptDto menu : menus) {
            ids.add(menu.getId());
        }

        return ids;
    }

    public List<MenuInfoDto> findMenuByMenuIds(List<String> menuIds) {

        List<MenuEntity> menuEntities = new ArrayList<>();

        if (EmptyUtil.isNotEmpty(menuIds)) {

            List<MenuEntity> list = menuDaoImpl.findAllByPropIn(
                    ConfigField.S_ID, menuIds,
                    new String[] { ConfigField.I_DELETE_FLAG },
                    new Object[] { ConfigValue.NOT_DELETE },
                    ConfigField.S_PID + "," + ConfigField.I_SORT_NUM);

            if (EmptyUtil.isNotEmpty(list)) {
                menuEntities.addAll(list);
            }
        }
        return EntityUtil.entityListToDtoList(menuEntities, MenuInfoDto.class);
    }

    private void setUrl(List<MenuInfoDto> menuOptDtos) {
        if (EmptyUtil.isNotEmpty(menuOptDtos)) {
            for (MenuInfoDto menu : menuOptDtos) {
                setUrl(menu);
            }
        }
    }

    private void setUrl(MenuInfoDto menu) {
        if (menu != null) {
            ApiInfoDto apiInfoDto = apiService.find(menu.getApiId());
            if (apiInfoDto != null) {
                menu.setUrl(apiInfoDto.getDataUrl());
                menu.setApiName(apiInfoDto.getName());
            }
        }
    }

    private List<MenuInfoDto> treeSort(String pid, List<MenuInfoDto> menuOptDtos) {

        List<MenuInfoDto> list = new ArrayList<>();

        for (MenuInfoDto menuOptDto : menuOptDtos) {

            if (pid.equals(menuOptDto.getPid())) {

                list.add(menuOptDto);
            }
        }

        menuOptDtos.removeAll(list);

        for (MenuInfoDto menuOptDto : list) {
            menuOptDto.setChildren(treeSort(menuOptDto.getId(), menuOptDtos));
        }

        return list;
    }

    private List<MenuOptDto> treeSort(List<MenuOptDto> menuOptDtos, String pid) {

        List<MenuOptDto> list = new ArrayList<>();

        for (MenuOptDto menuOptDto : menuOptDtos) {

            if (pid.equals(menuOptDto.getPid())) {

                list.add(menuOptDto);
            }
        }

        menuOptDtos.removeAll(list);

        for (MenuOptDto menuOptDto : list) {
            menuOptDto.setChildren(treeSort(menuOptDtos, menuOptDto.getId()));
        }

        return list;
    }

}
