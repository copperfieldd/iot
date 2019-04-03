package com.changhong.iot.application.service.impl;

import com.changhong.iot.application.base.BaseServiceImpl;
import com.changhong.iot.application.dao.AppUnitDao;
import com.changhong.iot.application.dao.AppUserDao;
import com.changhong.iot.application.dao.ApplicationDao;
import com.changhong.iot.application.dao.ApplicationRepository;
import com.changhong.iot.application.entity.AppUnit;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.TenantDao;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.rpc.ApiService;
import com.changhong.iot.rpc.MenuService;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.Appfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.impl.TenantServiceImpl;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.MD5Util;
import com.changhong.iot.util.UUIDUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class ApplicationServiceImpl extends BaseServiceImpl<ApplicationEntity> implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationDao applicationDao;

    @Autowired
    private AppUnitDao appUnitDaoImpl;

    @Autowired
    private AppUserDao appUserDao;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ApiService apiService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private TenantDao tenantDao;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public MongoRepository getRepository() {
        return applicationRepository;
    }


    @Override
    public Map<String, String> addAppAndOther(ApplicationEntity entity) throws ByteException {

        Date date = new Date();
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(entity.getName()));
        query.addCriteria(Criteria.where("tenantId").is(entity.getTenantId()));

        ApplicationEntity applicationEntity = mongoTemplate.findOne(query, ApplicationEntity.class);
        if (applicationEntity != null) {
            throw new ByteException(1011);
        }

        entity.setCreatorName(myThreadLocal.getUserName());
        entity.setCreatorId(myThreadLocal.getUserId());
        entity.setId(UUIDUtil.getUUID());
        entity.setId(UUIDUtil.getUUID());
        entity.setCreateTime(date);
        entity.setUpdateTime(date);
        entity.setDeleteFlag(ConfigValue.NOT_DELETE);
        applicationRepository.save(entity);

        AppUnit appUnit = new AppUnit();
        appUnit.setId(UUIDUtil.getUUID());
        appUnit.setAppId(entity.getId());
        appUnit.setCreateTime(date);
        appUnit.setUpdateTime(date);
        appUnit.setDeleteFlag(ConfigValue.NOT_DELETE);
        appUnit.setName(entity.getName());
        appUnit.setPid(ConfigValue.TOP_ID);
        appUnit.setRemarks("顶级组织机构");
        appUnit.setSortNum(1);
        appUnit.setType(ConfigValue.CORP);
        appUnit.setTenantId(entity.getTenantId());
        appUnitDaoImpl.save(appUnit);

        String userName = null;
        long max = appUserDao.findAdminMax();
        userName = "app" + TenantServiceImpl.getAdminSuffix(max);

        AppUser appUser = new AppUser();
        appUser.setId(UUIDUtil.getUUID());
        appUser.setAppId(entity.getId());
        appUser.setTenantId(entity.getTenantId());
        appUser.setCreateTime(date);
        appUser.setUpdateTime(date);
        appUser.setDeleteFlag(ConfigValue.NOT_DELETE);
        appUser.setIsSystem(true);
        appUser.setLoginName(userName);
        appUser.setUserName(userName);
        appUser.setMax(++max);
        appUser.setPassword(MD5Util.MD5EncodeUtf8(entity.getPassword()));
        appUser.setPid(appUnit.getId());
        appUser.setRemarks("应用管理员");
        appUser.setSortNum(1);
        appUser.setType(ConfigValue.APPLICATION_MANAGER);

        appUserDao.save(appUser);

        String roleId = entity.getRoleId();
        List<String> roleIds = new ArrayList<>();
        roleIds.add(roleId);
        roleService.updateRoleByOrgId(appUser.getId(), roleIds, MyThreadLocal.getToken());

        Map<String, String> map = new HashMap<>();

        map.put("id", entity.getId());
        map.put("userId", appUser.getId());
        map.put("userName", appUser.getUserName());
        map.put("loginName", appUser.getLoginName());

        return map;
    }

    @Override
    public void updateApp(ApplicationEntity applicationEntity) throws ByteException {

        ApplicationEntity entity = (ApplicationEntity) applicationDao.find(applicationEntity.getId());

        if (entity == null) {
            throw new ByteException(1012);
        }

        applicationEntity.setUpdateTime(new Date());
        applicationDao.updateByParamNotNull(applicationEntity);

        if (EmptyUtil.isNotEmpty(applicationEntity.getRoleId()) && !myThreadLocal.isAppUser()) {
            AppUser appManager = appUserDao.findAppManager(applicationEntity.getId());
            List<String> roleIds = new ArrayList<>();
            roleIds.add(applicationEntity.getRoleId());
            roleService.updateRoleByOrgId(appManager.getId(), roleIds, MyThreadLocal.getToken());
        }

    }

    @Override
    public void deleteByTenantId(String id) throws ByteException {

        Query query = new Query();
        Update update = new Update();

        query.addCriteria(Criteria.where("tenantId").is(id));
        update.set("updateTime", new Date());
        update.set("deleteFlag", ConfigValue.DELETE);

        List<ApplicationEntity> list = mongoTemplate.find(query, ApplicationEntity.class);
        mongoTemplate.updateMulti(query, update, ApplicationEntity.class);

        for (ApplicationEntity app : list) {

            appUnitDaoImpl.updateOneByProp(
                    "appId", app.getId(),
                    new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                    new Object[] { new Date(), ConfigValue.DELETE});

            appUserDao.updateOneByProp(
                    "appId", app.getId(),
                    new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                    new Object[] { new Date(), ConfigValue.DELETE});

            roleService.deleteByAppId(app.getId(), MyThreadLocal.getToken());
            apiService.deleteByAppId(app.getId(), MyThreadLocal.getToken());
            menuService.deleteByAppId(app.getId(), MyThreadLocal.getToken());
        }
    }

    @Override
    public PageModel page(int start, int count, Appfilter appfilter, com.changhong.iot.searchdto.Sort sort) throws ByteException {

        String order = applicationDao.analysisSort(sort);

        List<String> tenantIds = null;
        if (appfilter != null && EmptyUtil.isNotEmpty(appfilter.getTenantName())) {
            tenantIds = new ArrayList<>();
            List<TenantEntity> tenantEntities = tenantDao.findLikeAndProps(
                    new String[]{ConfigField.S_NAME},
                    new Object[]{appfilter.getTenantName()}, null, null, order);
            if (EmptyUtil.isNotEmpty(tenantEntities)) {
                for (TenantEntity tenantEntity : tenantEntities) {
                    tenantIds.add(tenantEntity.getId());
                }
            }
        }

        if (sort == null) {
            sort = new Sort();
        }
        if (sort.getName() == null) {
            sort.setName("createTime");
            sort.setOrder("desc");
        }

        PageModel page = applicationDao.pageFilterAndPropsAndIn(start, count,
                new String[] {"deleteFlag"}, new Object[] {0},
                tenantIds == null ? null : new String[] {"tenantId"}, new Object[] {tenantIds},
                appfilter, new String[] {"tenantName"}, sort);

        return page;
    }

    @Override
    public PageModel page(String tenantId, int start, int count, Appfilter appfilter, com.changhong.iot.searchdto.Sort sort) throws ByteException {

        String order = applicationDao.analysisSort(sort);

        if (sort == null) {
            sort = new Sort();
        }

        if (sort.getName() == null) {
            sort.setName("createTime");
            sort.setOrder("desc");
        }

        PageModel page = applicationDao.pageFilterAndPropsAndIn(start, count,
                new String[] {"tenantId", "deleteFlag"}, new Object[] {tenantId, 0},
                null, null,
                appfilter, new String[] {"tenantName"}, sort);

        return page;
    }

    @Override
    public List<ApplicationEntity> all(String tenantId, String name) {
        Query query = new Query();
        if (EmptyUtil.isNotEmpty(tenantId)) {
            query.addCriteria(Criteria.where("tenantId").is(tenantId));
        }
        if (EmptyUtil.isNotEmpty(name)) {
            query.addCriteria(Criteria.where("name").regex(name));
        }
        query.addCriteria(Criteria.where("deleteFlag").is(0));
        return mongoTemplate.find(query, ApplicationEntity.class);
    }

    @Override
    public void deleteApp(String id) throws ByteException {

        if (myThreadLocal.isAppUser()) {
            throw new ByteException(1006);
        }

        Query query = new Query();
        Update update = new Update();

        query.addCriteria(Criteria.where("id").is(id));
        update.set("updateTime", new Date());
        update.set("deleteFlag", ConfigValue.DELETE);

        mongoTemplate.updateMulti(query, update, ApplicationEntity.class);

        appUnitDaoImpl.updateOneByProp(
                "appId", id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        appUserDao.updateOneByProp(
                "appId", id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        roleService.deleteByAppId(id, MyThreadLocal.getToken());
        apiService.deleteByAppId(id, MyThreadLocal.getToken());
        menuService.deleteByAppId(id, MyThreadLocal.getToken());
    }

}
