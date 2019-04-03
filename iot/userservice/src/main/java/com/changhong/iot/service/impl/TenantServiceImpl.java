package com.changhong.iot.service.impl;

import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.GradeDao;
import com.changhong.iot.dao.TenantDao;
import com.changhong.iot.dao.UserDao;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.TenantOptDto;
import com.changhong.iot.entity.*;
import com.changhong.iot.rpc.MenuService;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.searchdto.Tenantfilter;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.service.UnitService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.MD5Util;
import com.changhong.iot.util.UUIDUtil;
import com.mongodb.BasicDBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class TenantServiceImpl implements TenantService {

    @Resource
    private TenantDao tenantDaoImpl;

    @Resource
    private UnitService unitServiceImpl;

    @Resource
    private UserDao userDao;

    @Autowired
    private RoleService roleService;

    @Resource
    private MenuService menuService;

    @Resource
    private GradeDao gradeDao;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public TenantDto findById(String id) {

        TenantEntity entity = (TenantEntity)tenantDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        TenantDto tenantDto = (TenantDto) EntityUtil.entityToDto(entity, TenantDto.class);
        setGradeName(tenantDto);
        return tenantDto;
    }

    @Override
    public List<TenantOptDto> findByTenantId(String id) {

        List<TenantEntity> entity = tenantDaoImpl.findByProps(
                new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        if (entity == null) {
            entity = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(entity, TenantOptDto.class);
    }

    @Override
    public TenantDto findById(String tenantId, String id) {

        TenantEntity entity = (TenantEntity)tenantDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, tenantId, ConfigValue.NOT_DELETE});

        return (TenantDto) EntityUtil.entityToDto(entity, TenantDto.class);
    }

    @Override
    public Map<String, Object> addTenant(TenantEntity tenantEntity) throws ByteException {

        Date date = new Date();

        TenantEntity entity = (TenantEntity) tenantDaoImpl.uniqueByProps(
                new String[]{ConfigField.S_NAME, ConfigField.S_TENANT_ID},
                new Object[]{tenantEntity.getName(), myThreadLocal.getTenantId()});
        if (entity != null) {
            throw new ByteException(1011);
        }

        //添加租户
        tenantEntity.setId(UUIDUtil.getUUID());
        tenantEntity.setValid(true);
        tenantEntity.setTenantId(myThreadLocal.getTenantId());
        tenantEntity.setCreateTime(date);
        tenantEntity.setUpdateTime(date);
        tenantEntity.setDeleteFlag(ConfigValue.NOT_DELETE);

        tenantDaoImpl.save(tenantEntity);


        //添加顶级组织机构
        UnitEntity unitEntity = new UnitEntity();
        unitEntity.setName(tenantEntity.getName());
        unitEntity.setPid(ConfigValue.TOP_ID);
        unitEntity.setType(ConfigValue.CORP);
        unitEntity.setRemarks("");
        unitEntity.setTenantId(tenantEntity.getId());
        unitServiceImpl.addUnit(unitEntity);

        //添加租户管理员
        String userName = null;
        long max = userDao.findAdminMax();
        userName = "admin" + getAdminSuffix(max);

        UserEntity userEntity = new UserEntity();

        userEntity.setId(UUIDUtil.getUUID());
        userEntity.setLoginName(userName);
        userEntity.setUserName(userName);
        userEntity.setPid(unitEntity.getId());
        userEntity.setTelephone("");
        userEntity.setRemarks("");
        userEntity.setTenantId(tenantEntity.getId());
        userEntity.setValid(true);
        userEntity.setPassword(MD5Util.MD5EncodeUtf8(tenantEntity.getPassword()));
        userEntity.setCreateTime(date);
        userEntity.setUpdateTime(date);
        userEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        userEntity.setSortNum(0);
        userEntity.setType(ConfigValue.TENANT_MANAGER);
        userEntity.setIsSystem(true);
        userEntity.setMax(++max);

        userDao.save(userEntity);

//        //给租户管理员添加角色
//        String roleId = tenantEntity.getRoleId();
//        List<String> roleIds = new ArrayList<>();
//        roleIds.add(roleId);
//        roleService.updateRoleByOrgId(userEntity.getId(), roleIds, MyThreadLocal.getToken());


        Map<String, Object> map = new HashMap<>();

        map.put("id", tenantEntity.getId());
        map.put("userId", userEntity.getId());
        map.put("userName", userEntity.getUserName());
        map.put("loginName", userEntity.getLoginName());

        return map;
    }

    @Override
    public boolean updateTenant(TenantEntity tenantEntity) throws ByteException {

        tenantEntity.setUpdateTime(new Date());

        if (!myThreadLocal.isPlatformManager()) {
            tenantEntity.setGradeId(null);
        }

        return tenantDaoImpl.updateByParamNotNull(tenantEntity);
    }

    @Override
    public boolean deleteTenantById(String tenantId, String id) throws ByteException {

        if (!myThreadLocal.isPlatformManager()) {
            throw new ByteException(1006);
        }

        tenantDaoImpl.updateOneByProps(
                new String[] { ConfigField.S_ID, ConfigField.S_TENANT_ID},
                new Object[] { id, tenantId},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        unitServiceImpl.deleteAllAndChildren(id);
        applicationService.deleteByTenantId(id);

        return true;
    }

    @Override
    public PageModel listTenante(int start, int count, Tenantfilter tenantfilter, Sort sort) throws ByteException {

        String order = tenantDaoImpl.analysisSort(sort);

        if (sort == null || EmptyUtil.isEmpty(sort.getName())) {
            sort = new Sort();
            sort.setName("createTime");
            sort.setOrder("desc");
        }

        List<String> gradeIds = null;
        if (tenantfilter != null && EmptyUtil.isNotEmpty(tenantfilter.getGradeName())) {
            gradeIds = new ArrayList<>();
            List<GradeEntity> gradeEntities = gradeDao.findLikeAndProps(
                    new String[]{ConfigField.S_NAME},
                    new Object[]{tenantfilter.getGradeName()}, null, null, order);
            if (EmptyUtil.isNotEmpty(gradeEntities)) {
                for (GradeEntity gradeEntity : gradeEntities) {
                    gradeIds.add(gradeEntity.getId());
                }
            }
        }

        String tenantIdKey = null;
        if (myThreadLocal.isPlatformManager()) {
            tenantIdKey = ConfigField.S_TENANT_ID;
        } else {
            tenantIdKey = ConfigField.S_ID;
        }

        PageModel page = tenantDaoImpl.pageFilterAndPropsAndIn(start, count,
                new String[]{tenantIdKey, ConfigField.I_DELETE_FLAG},
                new Object[]{myThreadLocal.getTenantId(), ConfigValue.NOT_DELETE},
                gradeIds == null ? null : new String[] {"gradeId"}, new Object[] {gradeIds},
                tenantfilter, new String[]{"gradeName"}, sort);

        List<TenantDto> list = EntityUtil.entityListToDtoList(page.getList(), TenantDto.class);

        setGradeName(list);

        page.setList(list);

        return page;
    }

    @Override
    public List<TenantOptDto> allTenant(String tenantId, String name) {

        List<TenantEntity> list = null;

        if (EmptyUtil.isNotEmpty(name)) {
            list = tenantDaoImpl.findLikeAndProps(new String[] {ConfigField.S_NAME}, new Object[] {name},
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE}, null);
        } else {
            list = tenantDaoImpl.findByProps(
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE});
        }

        return EntityUtil.entityListToDtoList(list, TenantOptDto.class);
    }

    @Override
    public List<TenantOptDto> findByGradeId(String id) {

        List<TenantEntity> entity = tenantDaoImpl.findByProps(
                new String[] {ConfigField.S_GRADE_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(entity, TenantOptDto.class);
    }

    @Override
    public List<String> findPids(String tenantId) throws ByteException {

        List<String> ids = new ArrayList<>();
        ids.add(tenantId);
        TenantDto tenant = null;

        while (!ConfigValue.TOP_ID.equals(tenantId)) {
            tenant = findById(tenantId);
            if (tenant == null) {
                throw new ByteException(1001);
            }
            tenantId = tenant.getTenantId();
            ids.add(tenantId);
        }

        return ids;
    }

    @Override
    public Map<String, String> listByName(String name) throws ByteException {

        List<String> keys = new ArrayList<>();
        List<Object> vals = new ArrayList<>();

        keys.add(ConfigField.I_DELETE_FLAG);
        vals.add(ConfigValue.NOT_DELETE);

        if (myThreadLocal.isPlatformManager()) {
            keys.add(ConfigField.S_TENANT_ID);
            vals.add(myThreadLocal.getTenantId());
        } else {
            keys.add(ConfigField.S_ID);
            vals.add(myThreadLocal.getTenantId());
        }

        if (EmptyUtil.isNotEmpty(name)) {
            keys.add(ConfigField.S_NAME);
            vals.add(new BasicDBObject("$regex", name));
        }

        List<TenantEntity> list = tenantDaoImpl.findByProps(keys.toArray(new String[0]), vals.toArray());

        Map<String, String> map = new HashMap<>();

        for (TenantEntity entity : list) {
            map.put(entity.getId(), entity.getName());
        }

        return map;
    }

    private void setGradeName(List<TenantDto> list) {
        if (EmptyUtil.isNotEmpty(list)){
            for (TenantDto tenantDto : list) {
                setGradeName(tenantDto);
            }
        }
    }
    private void setGradeName(TenantDto tenantDto) {
        if (tenantDto != null){
            GradeEntity gradeEntity = (GradeEntity) gradeDao.find(tenantDto.getGradeId());
            if (gradeEntity != null) {
                tenantDto.setGradeName(gradeEntity.getName());
            }
        }
    }

    /**
     *
     * 如：传入0返回001，传入100返回101，传入999返回1000
     */
    public static String getAdminSuffix(long max) {

        max++;
        String m = String.valueOf(max);

        for (int i = m.length(); i < 3; i++) {
            m = "0" + m;
        }

        return m;
    }

}
