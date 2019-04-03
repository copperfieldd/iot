package com.changhong.iot.application.service.impl;

import com.changhong.iot.application.dao.AppUnitDao;
import com.changhong.iot.application.dao.AppUserDao;
import com.changhong.iot.application.dao.ApplicationDao;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.AppUserService;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.TenantDao;
import com.changhong.iot.dto.EndUserDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.entity.UnitEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.EndUserfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.util.*;
import com.mongodb.BasicDBObject;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class AppUserServiceImpl implements AppUserService {

    @Resource
    private AppUserDao appUserDaoImpl;

    @Resource
    private AppUnitDao appUnitDaoImpl;

    @Autowired
    private RoleService roleService;

    @Autowired
    private TenantDao tenantDao;

    @Autowired
    private ApplicationDao applicationDao;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public AppUser findByLoginName(String loginName, String appId) {
        AppUser entity = (AppUser)appUserDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_LOGIN_NAME, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {loginName, appId, ConfigValue.NOT_DELETE});

        return entity;
    }

    @Override
    public UserDto findById(String id) {

        AppUser entity = (AppUser)appUserDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return (UserDto) EntityUtil.entityToDto(entity, UserDto.class);
    }

    @Override
    public JSONObject findByIdOrEndUser(String id) {

        AppUser entity = (AppUser)appUserDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        if (entity == null) {
            return null;
        }

        if (entity.getType().equals(ConfigValue.END_USER)) {
            JSONObject obj = JSONObject.fromObject(EntityUtil.entityToDto(entity, EndUserDto.class));
            obj.put("birth", StringUtil.dateToStrShort(entity.getBirth()));
            obj.put("createTime", StringUtil.dateToStrLong(entity.getCreateTime()));

            return obj;
        }

        return JSONObject.fromObject(EntityUtil.entityToDto(entity, UserDto.class));
    }

    @Override
    public List<UserDto> findByIds(List<String> id) {

        List<AppUser> list = appUserDaoImpl.findAllByPropIn(ConfigField.S_ID, id,
                new String[] {ConfigField.I_DELETE_FLAG},
                new Object[] {ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(list, UserDto.class);
    }

    @Override
    public AppUser addUser(AppUser userEntity) throws ByteException {

        AppUser userDto = findByLoginName(userEntity.getLoginName(), userEntity.getAppId());

        if (userDto != null) {
            throw new ByteException(1011);
        }

        AppUser entity = (AppUser) appUserDaoImpl.findMax(ConfigField.I_SORT_NUM);

        int sort = ConfigValue.SORT_STEP_LENGTH;

        if (entity != null) {
            sort += entity.getSortNum();
        }

        Date date = new Date();

        userEntity.setId(UUIDUtil.getUUID());
        userEntity.setValid(true);
        userEntity.setCreatorId(myThreadLocal.getUserId());
        userEntity.setCreatorName(myThreadLocal.getUserName());
        userEntity.setPassword(MD5Util.MD5EncodeUtf8(userEntity.getPassword()));
        userEntity.setCreateTime(date);
        userEntity.setUpdateTime(date);
        userEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        userEntity.setSortNum(sort);
        userEntity.setIsSystem(false);

        appUserDaoImpl.save(userEntity);

        if (EmptyUtil.isNotEmpty(userEntity.getRoleIds())) {
            roleService.updateRoleByOrgId(userEntity.getId(), userEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        return userEntity;
    }

    @Override
    public boolean updateUser(AppUser userEntity) throws ByteException {

        if (userEntity.getLoginName() != null) {
            AppUser userDto = findByLoginName(userEntity.getLoginName(), userEntity.getAppId());

            if (userDto != null && !userDto.getId().equals(userEntity.getId())) {
                throw new ByteException(1011);
            }
        }

        //如果是app管理员自身，则不可更改角色
        if (myThreadLocal.isAppManager() && myThreadLocal.getUserId().equals(userEntity.getId())) {
            if (userEntity.getRoleIds() != null) {
                roleService.updateRoleByOrgId(userEntity.getId(), userEntity.getRoleIds(), MyThreadLocal.getToken());
            }
        }

        userEntity.setUpdateTime(new Date());
        if (EmptyUtil.isNotEmpty(userEntity.getPassword())) {
            userEntity.setPassword(MD5Util.MD5EncodeUtf8(userEntity.getPassword()));
        }
        return appUserDaoImpl.updateByParamNotNull(userEntity);
    }


    @Override
    public boolean deleteUserByPid(String id) {

        boolean flag = appUserDaoImpl.updateMaryByProp(
                ConfigField.S_PID, id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return flag;
    }

    @Override
    public boolean delete(String id, int currType) throws ByteException {

        AppUser entity = (AppUser)appUserDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        if (currType != ConfigValue.PLATFORM_MANAGER || currType != ConfigValue.TENANT_MANAGER) {
            if (entity.getIsSystem() != null && entity.getIsSystem()) {
                throw new ByteException(1006);
            }
        }

        appUserDaoImpl.updateOneByProp(
                ConfigField.S_ID, id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return true;
    }

    @Override
    public void deleteByAppId(String id) {
        appUserDaoImpl.updateOneByProp(
                "appId", id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

    }

    @Override
    public List<UserOptDto> findAllByUnitId(String appId, String id) {

        List<AppUser> userOptDtos = appUserDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {id, appId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        if (userOptDtos == null) {
            userOptDtos = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(userOptDtos, UserOptDto.class);
    }

    @Override
    public boolean batch(List<AppUser> userEntities, String appId) throws ByteException {

        for (AppUser userEntity : userEntities) {

            AppUser userDto = findByLoginName(userEntity.getLoginName(), appId);

            if (userDto != null) {
                throw new ByteException(1011);
            }

            addUser(userEntity);
        }

        return true;
    }

    @Override
    public List<UserOptDto> recursive(String appId, String unitId) {

        List<UserOptDto> userOptDtos = new ArrayList<>();

        List<UnitEntity> unitEntities = appUnitDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {unitId, appId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        if (EmptyUtil.isNotEmpty(unitEntities)) {

            for (UnitEntity unitEntity : unitEntities) {
                userOptDtos.addAll(recursive(appId, unitEntity.getId()));
            }
        }

        userOptDtos.addAll(findAllByUnitId(appId, unitId));

        return userOptDtos;
    }

    @Override
    public boolean sort(String thisId, String nextId) throws ByteException {

        boolean flag = false;

        int sort = ConfigValue.SORT_STEP_LENGTH;

        //  先查询出自己的信息
        AppUser entity = (AppUser)appUserDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {thisId, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1012);
        }

        //  判断是否 不是排在最后
        if (EmptyUtil.isNotEmpty(nextId)) {

            //  获取后面一个元素信息
            AppUser nextEntity = (AppUser)appUserDaoImpl.uniqueByProps(
                    new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {nextId, ConfigValue.NOT_DELETE});

            if (nextEntity != null) {

                //计算出当前元素的sortNum
                sort = nextEntity.getSortNum() - 1;

                //如果当前元素的sortNum正好是步长的倍数，则证明需要重新排序
                if (sort % ConfigValue.SORT_STEP_LENGTH == 0) {

                    List<AppUser> list = appUserDaoImpl.findByProp(
                            ConfigField.S_PID, nextEntity.getPid(),ConfigField.I_SORT_NUM);

                    if (EmptyUtil.isEmpty(list)) {
                        throw new ByteException(1001);
                    }

                    sort = ConfigValue.SORT_STEP_LENGTH;

                    AppUser temp = null;
                    int tempSort = 0;

                    for (AppUser userEntity : list) {

                        if (userEntity.getId().equals(thisId)) {
                            temp = userEntity;
                            continue;
                        }
                        if (userEntity.getId().equals(nextId)) {
                            tempSort = sort;
                            sort += ConfigValue.SORT_STEP_LENGTH;
                        }

                        appUserDaoImpl.updateOneByProp(ConfigField.S_ID, userEntity.getId(),
                                ConfigField.I_SORT_NUM, sort);

                        sort += ConfigValue.SORT_STEP_LENGTH;
                    }

                    appUserDaoImpl.updateOneByProp(ConfigField.S_ID, temp.getId(),
                            ConfigField.I_SORT_NUM, tempSort);

                    return true;
                }
                flag = true;
            }
        }

        //  如果是排在最后 获取sortNum最大值+上步长即可
        if (!flag) {

            AppUser lastEntity = (AppUser)appUserDaoImpl.findMax(ConfigField.I_SORT_NUM);

            sort = lastEntity.getSortNum();

            sort += ConfigValue.SORT_STEP_LENGTH - sort % ConfigValue.SORT_STEP_LENGTH;
        }

        entity.setSortNum(sort);

        return appUserDaoImpl.updateOneByProp(ConfigField.S_ID, entity.getId(),
                ConfigField.I_SORT_NUM, sort);
    }

    @Override
    public List<UserOptDto> search(String appId, String name) {

        List types = new ArrayList<>();
        types.add(ConfigValue.APPLICATION_MANAGER);
        types.add(ConfigValue.APPLICATION_USER);

        List<AppUser> userOptDto = appUserDaoImpl.findLikeAndPropsAndIn(
                new String[] {ConfigField.S_USER_NAME}, new Object[] {name},
                new String[] {"appId", ConfigField.I_DELETE_FLAG},
                new Object[] {appId, ConfigValue.NOT_DELETE},
                new String[] {"type"},
                new List[] {types},
                null);

        if (userOptDto == null) {
            userOptDto = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(userOptDto, UserOptDto.class);
    }

    @Override
    public PageModel endUserList(int start, int count, EndUserfilter endUserfilter, Sort sort) throws ByteException {

        List<String> keys = new ArrayList<>();
        List<Object> vals = new ArrayList<>();

        keys.add("type");
        keys.add(ConfigField.I_DELETE_FLAG);

        vals.add(ConfigValue.END_USER);
        vals.add(ConfigValue.NOT_DELETE);

        if (!myThreadLocal.isPlatformManager()) {
            keys.add(ConfigField.S_TENANT_ID);
            vals.add(myThreadLocal.getTenantId());
        }
        if (myThreadLocal.isAppUser()) {
            keys.add("appId");
            vals.add(myThreadLocal.getUser().getAppId());
        }

        String order = appUserDaoImpl.analysisSort(sort);

        List<String> tenantIds = null;
        if (endUserfilter != null && EmptyUtil.isNotEmpty(endUserfilter.getTenantName())) {
            List<TenantEntity> tenantEntities = tenantDao.findLikeAndProps(
                    new String[]{ConfigField.S_NAME},
                    new Object[]{endUserfilter.getTenantName()}, null, null, order);
            if (EmptyUtil.isNotEmpty(tenantEntities)) {
                tenantIds = new ArrayList<>();
                for (TenantEntity tenantEntity : tenantEntities) {
                    tenantIds.add(tenantEntity.getId());
                }
            }
        }

        List<String> appIds = null;
        if (endUserfilter != null && EmptyUtil.isNotEmpty(endUserfilter.getAppName())) {
            List<ApplicationEntity> applicationEntities = applicationDao.findLikeAndProps(
                    new String[]{"name"},
                    new Object[]{endUserfilter.getAppName()}, null, null, order);
            if (EmptyUtil.isNotEmpty(applicationEntities)) {
                appIds = new ArrayList<>();
                for (ApplicationEntity applicationEntity : applicationEntities) {
                    appIds.add(applicationEntity.getId());
                }
            }
        }

        List<String> inKeys = new ArrayList<>();
        List<Object> inVals = new ArrayList<>();

        if (EmptyUtil.isNotEmpty(tenantIds)) {
            inKeys.add("tenantId");
            inVals.add(tenantIds);
        }
        if (EmptyUtil.isNotEmpty(appIds)) {
            inKeys.add("appId");
            inVals.add(appIds);
        }

        PageModel page = appUserDaoImpl.pageFilterAndPropsAndIn(start, count,
                keys.toArray(new String[0]), vals.toArray(),
                inKeys.toArray(new String[0]), inVals.toArray(), endUserfilter, new String[] {"appName", "tenantName"}, sort);

        page.setList(EntityUtil.entityListToDtoList(page.getList(), EndUserDto.class));

        return page;
    }

    @Override
    public void updPassword(String userId, String oldPassword, String newPassword) throws ByteException {

        AppUser user = (AppUser) appUserDaoImpl.find(userId);

        if (user == null) {
            throw new ByteException(1012);
        }

        String md5Password = user.getPassword();

        if (md5Password.equals(MD5Util.MD5EncodeUtf8(oldPassword))) {
            user.setPassword(MD5Util.MD5EncodeUtf8(newPassword));
            user.setUpdateTime(new Date());
            appUserDaoImpl.save(user);
        } else {
            throw new ByteException(1002);
        }
    }

    @Override
    public void updPassword(String userId, String newPassword) throws ByteException {

        AppUser user = (AppUser) appUserDaoImpl.find(userId);

        if (user == null) {
            throw new ByteException(1012);
        }

        user.setPassword(MD5Util.MD5EncodeUtf8(newPassword));
        user.setUpdateTime(new Date());
        appUserDaoImpl.save(user);
    }

    @Override
    public JSONArray findAllByUnitIdTree(String appId, String id) {

        List<AppUser> userOptDtos = appUserDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {id, appId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        JSONArray array = new JSONArray();

        for (AppUser user : userOptDtos) {
            net.sf.json.JSONObject obj = new net.sf.json.JSONObject();

            obj.put("id", user.getId());
            obj.put("name", user.getUserName());
            obj.put("userType", user.getType());
            obj.put("isLeaf", true);
            obj.put("type", 1);

            array.add(obj);
        }

        return array;
    }

    @Override
    public AppUser findAppManager(String appId) {
        return appUserDaoImpl.findAppManager(appId);
    }

    @Override
    public Map<String, String> listByUserName(String tenantId, String userName) {

        List<String> keys = new ArrayList<>();
        List<Object> vals = new ArrayList<>();

        keys.add(ConfigField.I_DELETE_FLAG);
        vals.add(ConfigValue.NOT_DELETE);

        if (EmptyUtil.isNotEmpty(tenantId)) {
            keys.add(ConfigField.S_TENANT_ID);
            vals.add(tenantId);
        }
        if (EmptyUtil.isNotEmpty(userName)) {
            keys.add(ConfigField.S_USER_NAME);
            vals.add(new BasicDBObject("$regex", userName));
        }

        List<AppUser> list = appUserDaoImpl.findByProps(keys.toArray(new String[0]), vals.toArray());

        Map<String, String> map = new HashMap<>();

        for (AppUser user : list) {
            map.put(user.getId(), user.getUserName());
        }

        return map;
    }
}
