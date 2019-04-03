package com.changhong.iot.service.impl;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.*;
import com.changhong.iot.dao.GradeDao;
import com.changhong.iot.dto.*;
import com.changhong.iot.entity.GradeEntity;
import com.changhong.iot.rpc.ApiService;
import com.changhong.iot.rpc.Checkpermiss;
import com.changhong.iot.rpc.MenuService;
import com.changhong.iot.searchdto.Gradefilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.*;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class GradeServiceImpl implements GradeService {

    @Resource
    private GradeDao gradeDaoImpl;

    @Resource
    private TenantService tenantServiceImpl;

    @Resource
    private Checkpermiss checkPermiss;

    @Resource
    private ApiService apiService;

    @Resource
    private MenuService menuService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public GradeDto findById(String id) {

        GradeEntity entity = (GradeEntity)gradeDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return (GradeDto) EntityUtil.entityToDto(entity, GradeDto.class);
    }

    @Override
    public GradeDto findById(String tenantId, String id) {

        GradeEntity entity = (GradeEntity)gradeDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, tenantId, ConfigValue.NOT_DELETE});

        return (GradeDto) EntityUtil.entityToDto(entity, GradeDto.class);
    }

    @Override
    public GradeEntity addGrade(GradeEntity gradeEntity) throws ByteException {

        checkPermiss(myThreadLocal.getUserId(), gradeEntity.getMenuIds(), gradeEntity.getApiIds());

        Date date = new Date();

        gradeEntity.setId(UUIDUtil.getUUID());
        gradeEntity.setValid(true);
        gradeEntity.setTenantId(myThreadLocal.getTenantId());
        gradeEntity.setCreatorName(myThreadLocal.getUserName());
        gradeEntity.setCreatorId(myThreadLocal.getUserId());
        gradeEntity.setCreateTime(date);
        gradeEntity.setUpdateTime(date);
        gradeEntity.setDeleteFlag(ConfigValue.NOT_DELETE);

        gradeDaoImpl.save(gradeEntity);

        return gradeEntity;
    }

    @Override
    public boolean updateGrade(GradeEntity gradeEntity) throws ByteException {

        if (!myThreadLocal.isPlatformManager()) {
            throw new ByteException(1006);
        }

        checkPermiss(myThreadLocal.getUserId(), gradeEntity.getMenuIds(), gradeEntity.getApiIds());

        gradeEntity.setUpdateTime(new Date());

        return gradeDaoImpl.updateByParamNotNull(gradeEntity);
    }

    @Override
    public boolean deleteGradeById(String tenantId, String id) throws ByteException {

        if (!myThreadLocal.isPlatformManager()) {
            throw new ByteException(1006);
        }

        List<TenantOptDto> tenantOptDtos = tenantServiceImpl.findByGradeId(id);

        if (EmptyUtil.isNotEmpty(tenantOptDtos)) {
            throw  new ByteException(1001);
        }

        boolean flag = gradeDaoImpl.updateOneByProps(
                new String[] { ConfigField.S_ID, ConfigField.S_TENANT_ID},
                new Object[] { id, tenantId},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return flag;
    }

    @Override
    public boolean delete(String id) throws ByteException {

        List<TenantOptDto> tenantOptDtos = tenantServiceImpl.findByGradeId(id);

        if (EmptyUtil.isNotEmpty(tenantOptDtos)) {
            throw  new ByteException(1001);
        }

        boolean flag = gradeDaoImpl.updateOneByProp(
                ConfigField.S_ID, id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return flag;
    }


    @Override
    public PageModel listGrade(String tenantId, int start, int count, String name) {

        PageModel<GradeEntity> page = null;

        if (EmptyUtil.isNotEmpty(name)) {

            page = gradeDaoImpl.pageLikeAndProps(start, count,
                    new String[] {ConfigField.S_NAME}, new Object[] {name},
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE}, null);

        } else {
            page = gradeDaoImpl.pageByProps(start, count,
                    new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {tenantId, ConfigValue.NOT_DELETE});
        }

        return page;
    }

    @Override
    public PageModel<GradeEntity> listGrade(String tenantId, int start, int count, Gradefilter filter, Sort sort) throws ByteException {

        if (sort == null) {
            sort = new Sort();
        }
        if (sort.getName() == null) {
            sort.setName("createTime");
            sort.setOrder("desc");
        }

        return gradeDaoImpl.pageFilterAndPropsAndIn(start, count,
                new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {tenantId, ConfigValue.NOT_DELETE}, null, null, filter, null, sort);
    }

    @Override
    public List<String> getMenuIdsByTenantId(String tenantId) {

        if (ConfigValue.TOP_ID.equals(tenantId)) {
            return new ArrayList<>();
        }

        TenantDto tenantDto = tenantServiceImpl.findById(tenantId);
        if (tenantDto == null) {
            return new ArrayList<>();
        }

        String gradeId = tenantDto.getGradeId();
        if (EmptyUtil.isEmpty(gradeId)) {
            return new ArrayList<>();
        }

        GradeDto gradeDto = findById(gradeId);
        if (gradeDto == null) {
            return new ArrayList<>();
        }

        return gradeDto.getMenuIds();
    }

    @Override
    public List<String> getApiIdsByTenantId(String tenantId) {

        if (ConfigValue.TOP_ID.equals(tenantId)) {
            return new ArrayList<>();
        }

        TenantDto tenantDto = tenantServiceImpl.findById(tenantId);
        if (tenantDto == null) {
            return new ArrayList<>();
        }

        String gradeId = tenantDto.getGradeId();
        if (EmptyUtil.isEmpty(gradeId)) {
            return new ArrayList<>();
        }

        GradeDto gradeDto = findById(gradeId);
        if (gradeDto == null) {
            return new ArrayList<>();
        }

        return gradeDto.getApiIds();
    }

    public void checkPermiss(String orgId, List<String> menuIds, List<String> apiIds) throws ByteException {

        JSONObject object = new JSONObject();
        object.put("orgId", orgId);
        object.put("menuIds", menuIds);
        object.put("apiIds", apiIds);

        ServerResponse serverResponse = checkPermiss.checkPermiss(object.toString(), MyThreadLocal.getToken());

        if (serverResponse.getStatus() != 0) {
            throw new ByteException(serverResponse.getStatus(), serverResponse.getValue());
        }
    }

}
