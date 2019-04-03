package com.changhong.iot.service.impl;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.ApiDao;
import com.changhong.iot.dto.ApiInfoDto;
import com.changhong.iot.dto.ApplicationDto;
import com.changhong.iot.dto.RoleInfoDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.ApiEntity;
import com.changhong.iot.entity.ServiceEntity;
import com.changhong.iot.rpc.ApplicationService;
import com.changhong.iot.rpc.GradeService;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.rpc.TenantService;
import com.changhong.iot.searchdto.Apifilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.service.RoleService;
import com.changhong.iot.service.ServiceService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ApiServiceImpl implements ApiService {

    @Resource
    private ApiDao apiDaoImpl;

    @Resource
    private RoleService roleServiceImpl;

    @Resource
    private GradeService gradeService;

    @Resource
    private TenantService tenantService;

    @Resource
    private OrgService orgService;

    @Resource
    private ServiceService serviceService;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public ApiInfoDto findByPath(String path) {

        ApiEntity entity = (ApiEntity) apiDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_DATA_URL, ConfigField.I_DELETE_FLAG},
                new Object[] {path, ConfigValue.NOT_DELETE});

        return (ApiInfoDto) EntityUtil.entityToDto(entity, ApiInfoDto.class);
    }

    @Override
    public ApiInfoDto find(String apiId) {

        ApiEntity entity = (ApiEntity) apiDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {apiId, ConfigValue.NOT_DELETE});

        return (ApiInfoDto) EntityUtil.entityToDto(entity, ApiInfoDto.class);
    }

    @Override
    public ApiInfoDto find(String tenantId, String apiId) {

        ApiEntity entity = (ApiEntity) apiDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {apiId, tenantId, ConfigValue.NOT_DELETE});

        return (ApiInfoDto) EntityUtil.entityToDto(entity, ApiInfoDto.class);
    }

    @Override
    public boolean save(ApiEntity apiEntity) throws ByteException {

        Date date = new Date();

        apiEntity.setId(UUIDUtil.getUUID());
        apiEntity.setValid(true);
        apiEntity.setTenantId(myThreadLocal.getTenantId());
        apiEntity.setCreatorId(myThreadLocal.getUserId());
        apiEntity.setCreatorName(myThreadLocal.getUserName());
        apiEntity.setCreateTime(date);
        apiEntity.setUpdateTime(date);
        apiEntity.setDeleteFlag(ConfigValue.NOT_DELETE);

        apiDaoImpl.save(apiEntity);

        return true;
    }

    @Override
    public boolean update(ApiEntity apiEntity) throws ByteException {

        ApiEntity entity = (ApiEntity) apiDaoImpl.find(apiEntity.getId());
        if (entity == null) {
            throw new ByteException(1012);
        }
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }

        apiEntity.setUpdateTime(new Date());

        return apiDaoImpl.updateByParamNotNull(apiEntity);
    }

    @Override
    public void deleteByAppId(String appId) throws ByteException {
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(appId)) {
            throw new ByteException(1006);
        }
        apiDaoImpl.updateOneByProp(
                "appId", appId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String tenantId, String apiId) {

        roleServiceImpl.deleteArrayElementByProp(ConfigField.A_API_ID, apiId);

        return apiDaoImpl.updateOneByProps(
                new String[] { ConfigField.S_ID, ConfigField.S_TENANT_ID},
                new Object[] { apiId, tenantId},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean delete(String apiId) throws ByteException {

        ApiEntity entity = (ApiEntity) apiDaoImpl.find(apiId);
        if (entity == null) {
            throw new ByteException(1012);
        }
        //如果是app用户，并且该接口不是该应用的
        if (myThreadLocal.isAppUser() && !myThreadLocal.getUser().getAppId().equals(entity.getAppId())) {
            throw new ByteException(1006);
        } else if (myThreadLocal.isTenantManager() && !myThreadLocal.getTenantId().equals(entity.getTenantId())) {
            throw new ByteException(1006);
        }

        roleServiceImpl.deleteArrayElementByProp(ConfigField.A_API_ID, apiId);

        return apiDaoImpl.updateOneByProp(
                ConfigField.S_ID, apiId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public PageModel listByServiceId(int start, int count, String serviceId, Apifilter apifilter, Sort sort) throws ByteException {

        if (sort == null) {
            sort = new Sort();
        }
        if (sort.getName() == null) {
            sort.setName("serviceId");
        }

        PageModel page = apiDaoImpl.pageFilterAndPropsAndIn(start, count,
                new String[] {"serviceId", ConfigField.I_DELETE_FLAG},
                new Object[] {serviceId, ConfigValue.NOT_DELETE},
                null, null, apifilter, null, sort);

        List<ApiInfoDto> list = EntityUtil.entityListToDtoList(page.getList(), ApiInfoDto.class);

        page.setList(list);

        return page;
    }

    @Override
    public PageModel listByAppId(int start, int count, String appId, Apifilter apifilter, Sort sort) throws ByteException {

        if (sort == null) {
            sort = new Sort();
        }

        if (sort.getName() == null) {
            sort.setName("appId");
        }

        PageModel page = apiDaoImpl.pageFilterAndPropsAndIn(start, count,
                new String[] {"appId", ConfigField.I_DELETE_FLAG},
                new Object[] {appId, ConfigValue.NOT_DELETE},
                null, null, apifilter, null, sort);

        List<ApiInfoDto> list = EntityUtil.entityListToDtoList(page.getList(), ApiInfoDto.class);

        page.setList(list);

        return page;
    }

    public PageModel list(int start, int count, String tenantId, String apiName, boolean isGetPublic) throws ByteException {

        PageModel page = null;

        if (EmptyUtil.isNotEmpty(apiName)) {
            page = apiDaoImpl.pageLikeAndProps(start, count,
                    new String[] {ConfigField.S_NAME}, new Object[] {apiName},
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_TYPE, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.PRIVATE_API, ConfigValue.NOT_DELETE}, null);
        } else {
            page = apiDaoImpl.pageByProps(start, count,
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_TYPE, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.PRIVATE_API, ConfigValue.NOT_DELETE});
        }

        Set<ApiInfoDto> set = new HashSet<>();
        if (!ConfigValue.TOP_ID.equals(tenantId)) {
            //  获取等级中的apiIds
            List<String> apiIds = gradeService.getApiIdsByTenantId(tenantId);
            set.addAll(findApiByApiIds(apiIds));
        }
        if (isGetPublic) {
            set.addAll(findPublicApiByTenantId(tenantId));
        }

        List<ApiInfoDto> list = EntityUtil.entityListToDtoList(page.getList(), ApiInfoDto.class);
        if (list.size() < count) {
            int size = set.size();
            List<ApiInfoDto> apis = new ArrayList<>(set);
            int length = count - list.size();
            for (int i = 0; i < length && i < size; i++) {
                list.add(apis.get(i));
            }
        }

        page.setList(list);
        page.setTotalCount(page.getTotalCount() + set.size());

        return page;
    }

    @Override
    public List<ApiInfoDto> findAllApiByOrgId(String id, boolean isGetPublic) throws ByteException {

        List<ApiInfoDto> apiOptDtos = findApiByApiIds(findAllApiIdByOrgId(id, isGetPublic));

        return apiOptDtos;
    }

    @Override
    public List<String> findAllApiIdByOrgId(String id, boolean isGetPublic) throws ByteException {

        List<String> apiIds = new ArrayList<>();

        //如果是平台管理员，则直接查询租户的api即可
        UserDto user = orgService.findUser(id);
        if (user.getType().equals(ConfigValue.PLATFORM_MANAGER) || user.getType().equals(ConfigValue.TENANT_MANAGER)) {
            List<ApiInfoDto> apis = findAllApiByTenantId(user.getTenantId(), isGetPublic);
            for (ApiInfoDto api : apis) {
                apiIds.add(api.getId());
            }
        } else {
            //角色中的api （包括继承来的）
            List<String> pids = orgService.findPids(id);
            pids.add(0, id);
            pids.remove(ConfigValue.TOP_ID);
            apiIds.addAll(roleServiceImpl.findAllApiIdsByOrgIds(pids));

            if (ConfigValue.APPLICATION_MANAGER.equals(user.getType())) {
                List<ApiEntity> list = findByAppId(user.getAppId(), isGetPublic);
                for (ApiEntity apiEntity : list) {
                    if (!apiIds.contains(apiEntity.getId())) {
                        apiIds.add(apiEntity.getId());
                    }
                }
            }
        }

        return apiIds;
    }

    @Override
    public List<String> findAllApiIdByOrgIdAuthenticity(String id, int type, String tenantId, String appId) throws ByteException {

        List<String> apiIds = new ArrayList<>();

        //如果是平台管理员，则直接查询租户的api即可
        if (ConfigValue.PLATFORM_MANAGER == type || ConfigValue.TENANT_MANAGER == type) {
            List<ApiInfoDto> apis = findAllApiByTenantId(tenantId, false);
            for (ApiInfoDto api : apis) {
                apiIds.add(api.getId());
            }
        } else {
            //角色中的api （包括继承来的）
            List<String> pids = orgService.findPids(id);
            pids.add(0, id);
            pids.remove(ConfigValue.TOP_ID);
            apiIds.addAll(roleServiceImpl.findAllApiIdsByOrgIds(pids));

            if (ConfigValue.APPLICATION_MANAGER.equals(type)) {
                List<ApiEntity> list = findByAppId(appId, false);
                for (ApiEntity apiEntity : list) {
                    if (!apiIds.contains(apiEntity.getId())) {
                        apiIds.add(apiEntity.getId());
                    }
                }
            }
        }

        return apiIds;
    }

    @Override
    public List<ApiInfoDto> findAllApiByRoleId(String roleId) {

        RoleInfoDto roleInfoDto = roleServiceImpl.find(roleId);

        List<String> apiIds = null;

        if (roleInfoDto != null) {
            apiIds = roleInfoDto.getApiIds();
        }

        return findApiByApiIds(apiIds);
    }

    @Override
    public List<ApiInfoDto> findAllApiByTenantId(String tenantId, boolean isGetPublic) throws ByteException {

        Set<ApiInfoDto> apis = new HashSet<>();

        List<ApiEntity> entitys = apiDaoImpl.findByProps(
                    new String[] { ConfigField.S_TENANT_ID, ConfigField.I_TYPE, ConfigField.I_DELETE_FLAG},
                    new Object[] { tenantId, ConfigValue.PRIVATE_API, ConfigValue.NOT_DELETE});

        apis.addAll(EntityUtil.entityListToDtoList(entitys, ApiInfoDto.class));

        if (!ConfigValue.TOP_ID.equals(tenantId)) {
            //  获取等级中的apiIds
            List<String> apiIds = gradeService.getApiIdsByTenantId(tenantId);
            apis.addAll(findApiByApiIds(apiIds));
        }

        if (isGetPublic) {
            apis.addAll(findPublicApiByTenantId(tenantId));
        }

        ArrayList<ApiInfoDto> list = new ArrayList<>(apis);
        list.sort((a, b) -> {
            int i = compareTo(a.getServiceId(), b.getServiceId());
            if (i == 0) {
                i = compareTo(a.getAppId(), b.getAppId());
            }
            return i;
        });
        return list;
    }

    @Override
    public PageModel findAllApiByTenantId(String tenantId, boolean isGetPublic, int start, int count) throws ByteException {

        List<ApiInfoDto> list = findAllApiByTenantId(tenantId, isGetPublic);

        int size = list.size();

        if (size < start) {
            start = count = size;
        } else if (size >= start && size >= start + count) {
            count += start;
        } else {
            count = size;
        }

        return PageModel.indexToPage(list.size(), list.subList(start, count));
    }

    public int compareTo(String a, String b) {

        int i;

        if (a != null && b != null) {
            i = a.compareTo(b);
        } else if (a == null && b == null) {
            i = 0;
        } else if (a == null) {
            i = -1;
        } else {
            i = 1;
        }

        return i;
    }

    @Override
    public List<ApiEntity> findByAppId(String appId, boolean isGetPublic) {

        return apiDaoImpl.findByProps(
                new String[] {"appId", ConfigField.I_DELETE_FLAG, isGetPublic ? null : ConfigField.I_TYPE},
                new Object[] {appId, ConfigValue.NOT_DELETE, ConfigValue.PRIVATE_API});

    }

    private List<ApiInfoDto> findPublicApiByTenantId(String tenantId) throws ByteException {

        List<String> pids = tenantService.findPids(tenantId);
        pids.add(0, tenantId);

        List<ApiEntity> entitys = apiDaoImpl.findAllByPropIn(ConfigField.S_TENANT_ID, pids,
                new String[] {ConfigField.I_TYPE, ConfigField.I_DELETE_FLAG},
                new Object[] {ConfigValue.PUBLIC_API, ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(entitys, ApiInfoDto.class);
    }

    private List<String> findPublicApiIdsByTenantId(String tenantId) throws ByteException {

        List<ApiInfoDto> apis = findPublicApiByTenantId(tenantId);

        List<String> ids = new ArrayList<>();

        for (ApiInfoDto api : apis) {
            ids.add(api.getId());
        }
        return ids;
    }

    @Override
    public List<ApiInfoDto> findApiByApiIds(List<String> apiIds) {

        if (EmptyUtil.isNotEmpty(apiIds)) {
            List<ApiEntity> list = apiDaoImpl.findAllByPropIn(
                    ConfigField.S_ID, apiIds,
                    new String[] { ConfigField.I_DELETE_FLAG }, new Object[] { ConfigValue.NOT_DELETE },
                    "serviceId,appId");

            if (EmptyUtil.isNotEmpty(list)) {
                return EntityUtil.entityListToDtoList(list, ApiInfoDto.class);
            }
        }

        return new ArrayList<>();
    }

    @Override
    public void setComplexName(List<ApiInfoDto> list) {

        if (EmptyUtil.isNotEmpty(list)) {
            for (ApiInfoDto api : list) {
                api.setComplexName(getComplexName(api));
            }
        }
    }

    @Override
    public String getComplexName(ApiInfoDto api) {

        String name = "";

        if (EmptyUtil.isNotEmpty(api.getServiceId())) {
            ServiceEntity entity = serviceService.find(api.getServiceId());
            if (entity != null) {
                name = entity.getName();
            }
        } else if (EmptyUtil.isNotEmpty(api.getAppId())) {
            ApplicationDto entity = applicationService.findById(api.getAppId());
            if (entity != null) {
                name = entity.getName();
            }
        }

        return name;
    }

    @Override
    public void importApi(InputStream in, String fileName) throws ByteException, IOException {

//        List<Map<String, Object>> list = ExcelUtil.readExcel(in, fileName);
    }
}
