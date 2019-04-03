package com.changhong.iot.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.application.dto.ApplicationDto;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.TenantDao;
import com.changhong.iot.dao.UnitDao;
import com.changhong.iot.dao.UserDao;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.dto.UserPlatform;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.entity.UnitEntity;
import com.changhong.iot.entity.UserEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.PlatformManagerfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.MD5Util;
import com.changhong.iot.util.UUIDUtil;
import com.mongodb.BasicDBObject;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserDao userDaoImpl;

    @Resource
    private UnitDao unitDaoImpl;

    @Autowired
    private RoleService roleService;

    @Resource
    private TenantDao tenantDao;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public UserEntity findByLoginName(String loginName, int type) {

        UserEntity entity = (UserEntity)userDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_LOGIN_NAME, "type", ConfigField.I_DELETE_FLAG},
                new Object[] {loginName, type, ConfigValue.NOT_DELETE});

        return entity;
    }

    @Override
    public UserDto findById(String id) {

        UserEntity entity = (UserEntity)userDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return (UserDto) EntityUtil.entityToDto(entity, UserDto.class);
    }

    @Override
    public List<UserDto> findByIds(List<String> id) {

        List<UserEntity> list = userDaoImpl.findAllByPropIn(ConfigField.S_ID, id,
                new String[] {ConfigField.I_DELETE_FLAG},
                new Object[] {ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(list, UserDto.class);
    }

    @Override
    public JSONObject getCurrentUserAndTenant(UserDto user) throws ByteException {

        TenantDto tenantDto = null;
        ApplicationDto applicationDto = null;

        if (user == null) {
            throw new ByteException(1001);
        }
        if (!ConfigValue.TOP_ID.equals(user.getTenantId())) {
            TenantEntity tenantEntity = (TenantEntity) tenantDao.find(user.getTenantId());
            tenantDto = (TenantDto) EntityUtil.entityToDto(tenantEntity, TenantDto.class);
        }
        Integer type = user.getType();
        if (type != null && (type.equals(ConfigValue.APPLICATION_MANAGER)
            || type.equals(ConfigValue.APPLICATION_USER) || type.equals(ConfigValue.END_USER))) {

            ApplicationEntity applicationEntity = applicationService.find(user.getAppId());
            applicationDto = (ApplicationDto) EntityUtil.entityToDto(applicationEntity, ApplicationDto.class);
        }

        JSONObject json = new JSONObject();
        json.put("user", user);
        json.put("tenant", tenantDto);
        json.put("application", applicationDto);

        return json;
    }

    @Override
    public UserEntity addUser(UserEntity userEntity) throws ByteException {

        UserEntity userDto = findByLoginName(userEntity.getLoginName(), ConfigValue.BUSINESS_USER);

        if (userDto != null) {
            throw new ByteException(1011);
        }

        UserEntity entity = (UserEntity) userDaoImpl.findMax(ConfigField.I_SORT_NUM);

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
        userEntity.setType(ConfigValue.BUSINESS_USER);
        userEntity.setIsSystem(false);

        userDaoImpl.save(userEntity);

        if (EmptyUtil.isNotEmpty(userEntity.getRoleIds())) {
            roleService.updateRoleByOrgId(userEntity.getId(), userEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        return userEntity;
    }

    @Override
    public PageModel listPlatformManager(int start, int count, PlatformManagerfilter platformManagerfilter, Sort sort) throws ByteException {

        if (sort == null) {
            sort = new Sort();
        }
        if (sort.getName() == null) {
            sort.setName("createTime");
            sort.setOrder("desc");
        }

        PageModel page = userDaoImpl.pageFilterAndPropsAndIn(start, count,
                new String[]{"type", ConfigField.I_DELETE_FLAG},
                new Object[]{ConfigValue.PLATFORM_MANAGER, ConfigValue.NOT_DELETE},
                null, null, platformManagerfilter, null, sort);

        List<UserPlatform> list = EntityUtil.entityListToDtoList(page.getList(), UserPlatform.class);

        page.setList(list);

        return page;
    }

    @Override
    public UserEntity addPlatformManager(UserEntity userEntity) throws ByteException {

        UserEntity userDto = findByLoginName(userEntity.getLoginName(), ConfigValue.PLATFORM_MANAGER);

        if (userDto != null) {
            throw new ByteException(1011);
        }

        Date date = new Date();

        userEntity.setId(UUIDUtil.getUUID());
        userEntity.setValid(true);
        userEntity.setPid(ConfigValue.TOP_ID);
        userEntity.setTenantId(myThreadLocal.getTenantId());
        userEntity.setCreatorName(myThreadLocal.getUserName());
        userEntity.setUserName(userEntity.getLoginName());
        userEntity.setPassword(MD5Util.MD5EncodeUtf8(userEntity.getPassword()));
        userEntity.setCreateTime(date);
        userEntity.setUpdateTime(date);
        userEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        userEntity.setSortNum(2);
        userEntity.setType(ConfigValue.PLATFORM_MANAGER);
        userEntity.setIsSystem(false);

        userDaoImpl.save(userEntity);

        if (EmptyUtil.isNotEmpty(userEntity.getRoleIds())) {
            roleService.updateRoleByOrgId(userEntity.getId(), userEntity.getRoleIds(), MyThreadLocal.getToken());
        }
        return userEntity;
    }

    @Override
    public void updPlatformManager(String id, String name, String password, String remarks) throws ByteException {

        UserEntity userEntity = (UserEntity) userDaoImpl.find(id);

        if (userEntity != null) {

            UserEntity entity = findByLoginName(name, ConfigValue.PLATFORM_MANAGER);

            if (entity != null && !entity.getId().equals(id)) {
                throw new ByteException(1011);
            }

            userEntity.setUserName(name);
            userEntity.setLoginName(name);
            userEntity.setRemarks(remarks);

            if (EmptyUtil.isNotEmpty(password)) {
                userEntity.setPassword(MD5Util.MD5EncodeUtf8(password));
            }

            userDaoImpl.save(userEntity);
        }
    }

    @Override
    public boolean updateUser(UserEntity userEntity) throws ByteException {

        if (userEntity.getLoginName() != null) {
            UserEntity user = (UserEntity) userDaoImpl.find(userEntity.getId());

            if (user == null) {
                throw new ByteException(1012);
            }

            if (!user.getLoginName().equals(userEntity.getLoginName())) {
                UserEntity userDto = findByLoginName(userEntity.getLoginName(), user.getType());
                if (userDto != null) {
                    throw new ByteException(1011);
                }
            }
        }

        if (userEntity.getRoleIds() != null) {
            roleService.updateRoleByOrgId(userEntity.getId(), userEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        userEntity.setUpdateTime(new Date());

        if (EmptyUtil.isNotEmpty(userEntity.getPassword())) {
            userEntity.setPassword(MD5Util.MD5EncodeUtf8(userEntity.getPassword()));
        }

        return userDaoImpl.updateByParamNotNull(userEntity);
    }


    @Override
    public boolean deleteUserByPid(String id) {

        return userDaoImpl.updateMaryByProp(
                ConfigField.S_PID, id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public void deleteByTenantId(String tenantId) {
        userDaoImpl.updateMaryByProp(
                ConfigField.S_TENANT_ID, tenantId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String id, int currType) throws ByteException {

        UserEntity entity = (UserEntity) userDaoImpl.uniqueByProps(
                new String[]{ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[]{id, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1012);
        }
        int type = entity.getType();
        if (entity.getIsSystem() != null && entity.getIsSystem() && type == ConfigValue.PLATFORM_MANAGER) {
            throw new ByteException(1006);
        }
        if (type == ConfigValue.PLATFORM_MANAGER && currType != ConfigValue.PLATFORM_MANAGER) {
            throw new ByteException(1006);
        }
        if (type == ConfigValue.TENANT_MANAGER && currType != ConfigValue.PLATFORM_MANAGER) {
            throw new ByteException(1006);
        }
        if (type == ConfigValue.BUSINESS_USER && (currType != ConfigValue.PLATFORM_MANAGER || currType != ConfigValue.TENANT_MANAGER)) {
            throw new ByteException(1006);
        }
        if (type == ConfigValue.APPLICATION_MANAGER && (currType != ConfigValue.PLATFORM_MANAGER || currType != ConfigValue.TENANT_MANAGER)) {
            throw new ByteException(1006);
        }

        userDaoImpl.updateOneByProp(
                ConfigField.S_ID, id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return true;
    }

    @Override
    public List<UserOptDto> findAllByUnitId(String tenantId, String id) {

        List<UserEntity> userOptDtos = userDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, tenantId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        if (userOptDtos == null) {
            userOptDtos = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(userOptDtos, UserOptDto.class);
    }

    @Override
    public JSONArray findAllByUnitIdTree(String tenantId, String id) {

        List<UserEntity> userOptDtos = userDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, tenantId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        JSONArray array = new JSONArray();

        for (UserEntity user : userOptDtos) {
            net.sf.json.JSONObject obj = new net.sf.json.JSONObject();

            obj.put("id", user.getId());
            obj.put("name", user.getUserName());
            obj.put("isLeaf", true);
            obj.put("type", 1);

            array.add(obj);
        }

        return array;
    }

    @Override
    public boolean batch(List<UserEntity> userEntities) throws ByteException {

        for (UserEntity userEntity : userEntities) {

            UserEntity userDto = findByLoginName(userEntity.getLoginName(), ConfigValue.BUSINESS_USER);

            if (userDto != null) {
                throw new ByteException(1011);
            }

            addUser(userEntity);
        }

        return true;
    }

    @Override
    public List<UserOptDto> recursive(String tenantId, String unitId) {

        List<UserOptDto> userOptDtos = new ArrayList<>();

        List<UnitEntity> unitEntities = unitDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {unitId, tenantId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        if (EmptyUtil.isNotEmpty(unitEntities)) {

            for (UnitEntity unitEntity : unitEntities) {
                userOptDtos.addAll(recursive(tenantId, unitEntity.getId()));
            }
        }

        userOptDtos.addAll(findAllByUnitId(tenantId, unitId));

        return userOptDtos;
    }

    @Override
    public boolean sort(String thisId, String nextId) throws ByteException {

        boolean flag = false;

        int sort = ConfigValue.SORT_STEP_LENGTH;

        //  先查询出自己的信息
        UserEntity entity = (UserEntity)userDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {thisId, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1012);
        }

        //  判断是否 不是排在最后
        if (EmptyUtil.isNotEmpty(nextId)) {

            //  获取后面一个元素信息
            UserEntity nextEntity = (UserEntity)userDaoImpl.uniqueByProps(
                    new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {nextId, ConfigValue.NOT_DELETE});

            if (nextEntity != null) {

                //计算出当前元素的sortNum
                sort = nextEntity.getSortNum() - 1;

                //如果当前元素的sortNum正好是步长的倍数，则证明需要重新排序
                if (sort % ConfigValue.SORT_STEP_LENGTH == 0) {

                    List<UserEntity> list = userDaoImpl.findByProp(
                            ConfigField.S_PID, nextEntity.getPid(),ConfigField.I_SORT_NUM);

                    if (EmptyUtil.isEmpty(list)) {
                        throw new ByteException(1001);
                    }

                    sort = ConfigValue.SORT_STEP_LENGTH;

                    UserEntity temp = null;
                    int tempSort = 0;

                    for (UserEntity userEntity : list) {

                        if (userEntity.getId().equals(thisId)) {
                            temp = userEntity;
                            continue;
                        }
                        if (userEntity.getId().equals(nextId)) {
                            tempSort = sort;
                            sort += ConfigValue.SORT_STEP_LENGTH;
                        }

                        userDaoImpl.updateOneByProp(ConfigField.S_ID, userEntity.getId(),
                                ConfigField.I_SORT_NUM, sort);

                        sort += ConfigValue.SORT_STEP_LENGTH;
                    }

                    userDaoImpl.updateOneByProp(ConfigField.S_ID, temp.getId(),
                            ConfigField.I_SORT_NUM, tempSort);

                    return true;
                }
                flag = true;
            }
        }

        //  如果是排在最后 获取sortNum最大值+上步长即可
        if (!flag) {

            UserEntity lastEntity = (UserEntity)userDaoImpl.findMax(ConfigField.I_SORT_NUM);

            sort = lastEntity.getSortNum();

            sort += ConfigValue.SORT_STEP_LENGTH - sort % ConfigValue.SORT_STEP_LENGTH;
        }

        entity.setSortNum(sort);

        return userDaoImpl.updateOneByProp(ConfigField.S_ID, entity.getId(),
                ConfigField.I_SORT_NUM, sort);
    }

    @Override
    public List<UserOptDto> search(String tenantId, String name) {

        List<UserEntity> userOptDto = userDaoImpl.findLikeAndProps(
                new String[] {ConfigField.S_USER_NAME}, new Object[] {name},
                new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {tenantId, ConfigValue.NOT_DELETE}, null);

        if (userOptDto == null) {
            userOptDto = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(userOptDto, UserOptDto.class);
    }

    @Override
    public void updPassword(String userId, String oldPassword, String newPassword) throws ByteException {

        UserEntity user = (UserEntity) userDaoImpl.find(userId);

        if (user == null) {
            throw new ByteException(1012);
        }

        String md5Password = user.getPassword();

        if (md5Password.equals(MD5Util.MD5EncodeUtf8(oldPassword))) {
            user.setPassword(MD5Util.MD5EncodeUtf8(newPassword));
            user.setUpdateTime(new Date());
            userDaoImpl.save(user);
        } else {
            throw new ByteException(1002);
        }
    }

    @Override
    public void updPassword(String userId, String newPassword) throws ByteException {

        UserEntity user = (UserEntity) userDaoImpl.find(userId);

        if (user == null) {
            throw new ByteException(1012);
        }

        user.setPassword(MD5Util.MD5EncodeUtf8(newPassword));
        user.setUpdateTime(new Date());
        userDaoImpl.save(user);
    }

    @Override
    public UserDto findAdminByTenantId(String tenantId) {

        UserEntity entity = (UserEntity)userDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_TENANT_ID, "isSystem", ConfigField.I_DELETE_FLAG},
                new Object[] {tenantId, true, ConfigValue.NOT_DELETE});

        return (UserDto) EntityUtil.entityToDto(entity, UserDto.class);
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

        List<UserEntity> list = userDaoImpl.findByProps(keys.toArray(new String[0]), vals.toArray());

        Map<String, String> map = new HashMap<>();

        for (UserEntity user : list) {
            map.put(user.getId(), user.getUserName());
        }

        return map;
    }
}
