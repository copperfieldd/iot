package com.changhong.iot.controller;

import com.changhong.iot.application.entity.AppUnit;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.service.AppUnitService;
import com.changhong.iot.application.service.AppUserService;
import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.RoleOptDto;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UnitOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.UnitEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.service.UnitService;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.*;
import net.sf.json.JSONObject;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/unit")
public class UnitController {

    @Resource
    private UnitService unitServiceImpl;

    @Resource
    private AppUnitService appUnitService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Resource
    private RoleService roleService;

    @Resource
    private RedisTemplate redisTemplate;

    @GetMapping("/item")
    public APIResult findById(@RequestParam String id, String appId) {

        UnitDto unitDto = unitServiceImpl.findById(id);

        if (unitDto == null) {
            unitDto = appUnitService.findById(id);
        }

//        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
//            unitDto = appUnitService.findById(id);
//        } else {
//            unitDto = unitServiceImpl.findById(id);
//        }

        JSONObject json = setRole(unitDto);

        return APIResult.success().setValue(json);
    }

    private net.sf.json.JSONObject setRole(UnitDto unitDto) {

        if (unitDto == null) {
            return null;
        }

        net.sf.json.JSONObject obj = net.sf.json.JSONObject.fromObject(unitDto);

        obj.remove("token");

        ServerResponse<List<RoleOptDto>> serverResponse = roleService.findRolesByOrgId(unitDto.getId(), MyThreadLocal.getToken());

        obj.put("role", serverResponse.getValue());

        return obj;
    }

    @PostMapping("/add")
    public APIResult addUnit(@RequestBody UnitEntity unitEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(unitEntity, "name", "pid");

        if (myThreadLocal.isPlatformManager() && EmptyUtil.isEmpty(unitEntity.getTenantId())) {
            return APIResult.failure().setStatus(1009).setValues("tenantId");
        }

        if (unitEntity.getType() == null) {
            unitEntity.setType(2);
        }
        if (EmptyUtil.isEmpty(unitEntity.getTenantId())) {
            unitEntity.setTenantId(myThreadLocal.getTenantId());
        }
        if (EmptyUtil.isEmpty(unitEntity.getAppId()) && myThreadLocal.isAppManager()) {
            unitEntity.setAppId(myThreadLocal.getUser().getAppId());
        }

        Object unit = null;
        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(unitEntity.getAppId())) {
            AppUnit appUnit = (AppUnit) EntityUtil.entityToDto(unitEntity, AppUnit.class);
            unit = appUnitService.addUnit(appUnit);
        } else {
            unit = unitServiceImpl.addUnit(unitEntity);
        }

        return APIResult.success().setMessage("保存成功！").setValue(unit);
    }

    @PostMapping("/upd")
    public APIResult updateUnit(@RequestBody UnitEntity unitEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(unitEntity, "id");
        ParamUtil.setParamNullIgnore(unitEntity, "id", "name", "pid", "remarks", "roleIds", "type");

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(unitEntity.getAppId())) {
            AppUnit appUnit = (AppUnit) EntityUtil.entityToDto(unitEntity, AppUnit.class);
            appUnitService.updateUnit(appUnit);
        } else {
            unitServiceImpl.updateUnit(unitEntity);
        }

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteUnitById(@RequestParam String id, String appId) throws ByteException {

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            appUnitService.delete(id);
        } else {
            unitServiceImpl.delete(id);
        }

        return APIResult.success().setMessage("删除成功！");
    }

    @GetMapping("/top")
    public APIResult topByUserId(String id, String appId) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = myThreadLocal.getUserId();
        }

        UnitDto unitDto = null;
        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            unitDto = appUnitService.top(id);
        } else {
            unitDto = unitServiceImpl.top(id);
        }

        return APIResult.success().setValue(unitDto);
    }

    @GetMapping("/parent")
    public APIResult parentByUserId(String id, String appId) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = myThreadLocal.getUserId();
        }

        UnitDto unitDto = null;
        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            unitDto = appUnitService.parent(id);
        } else {
            unitDto = unitServiceImpl.parent(id);
        }

        return APIResult.success().setValue(unitDto);
    }

    @GetMapping("/children")
    public APIResult childrenById(String id, String tenantId, String appId) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = ConfigValue.TOP_ID;
        }

        List list = null;

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            if (EmptyUtil.isEmpty(appId)) {
                appId = myThreadLocal.getUser().getAppId();
                if (EmptyUtil.isEmpty(appId)) {
                    return APIResult.failure().setStatus(1009).setValues("appId");
                }
            }
            list = appUnitService.children(appId, id, true);
        } else {
            if (EmptyUtil.isEmpty(tenantId)) {
                if (id.equals(ConfigValue.TOP_ID)){
                    tenantId = myThreadLocal.getTenantId();
                } else {
                    UnitDto unitDto = unitServiceImpl.findById(id);
                    if (unitDto == null) {
                        return APIResult.failure().setStatus(1012);
                    } else {
                        tenantId = unitDto.getTenantId();
                    }
                }
            }
            list = unitServiceImpl.children(tenantId, id, true);
        }

        return APIResult.success().setValue(list);
    }

    @PostMapping("/batch")
    public APIResult batch(@RequestBody List<UnitEntity> unitEntities) throws ByteException {

        for (UnitEntity unitEntity : unitEntities) {

            ParamUtil.checkParamNotNullAndNotEmpty(unitEntity, "name", "pid", "type");

            if (myThreadLocal.isPlatformManager() && EmptyUtil.isEmpty(unitEntity.getTenantId())) {
                return APIResult.failure().setStatus(1009).setValues("tenantId");
            }

            if (EmptyUtil.isEmpty(unitEntity.getTenantId())) {
                unitEntity.setTenantId(myThreadLocal.getTenantId());
            }
            if (EmptyUtil.isEmpty(unitEntity.getAppId()) && myThreadLocal.isAppManager()) {
                unitEntity.setAppId(myThreadLocal.getUser().getAppId());
            }
        }

        if (myThreadLocal.isAppManager()) {
            List<AppUnit> list = EntityUtil.entityListToDtoList(unitEntities, AppUnit.class);
            appUnitService.batch(list);
        } else {
            unitServiceImpl.batch(unitEntities);
        }

        return APIResult.success().setMessage("保存成功！").setValue(unitEntities);
    }

    @GetMapping("/sort")
    public APIResult sort(@RequestParam String thisId, String nextId, String appId) throws ByteException {

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            appUnitService.sort(thisId, nextId);
        } else {
            unitServiceImpl.sort(thisId, nextId);
        }

        return APIResult.success().setMessage("排序成功！");
    }

    @GetMapping("/search")
    public APIResult search(@RequestParam String name, String tenantId, String appId) throws ByteException {

        if (EmptyUtil.isEmpty(name)) {
            return APIResult.failure().setStatus(1009).setValues("name");
        }

        if (EmptyUtil.isEmpty(tenantId)) {
            tenantId = myThreadLocal.getTenantId();
        }

        List<UnitOptDto> unitOptDtos = null;

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            if (EmptyUtil.isEmpty(appId)) {
                appId = myThreadLocal.getUser().getAppId();
            }
            unitOptDtos = appUnitService.search(appId, name);
        } else {
            unitOptDtos = unitServiceImpl.search(tenantId, name);
        }
        return APIResult.success().setValue(unitOptDtos);
    }

    @GetMapping("/pids")
    public ServerResponse getPids(@RequestParam String id, String appId) throws ByteException {

        List<String> ids = unitServiceImpl.getPids(id);

        if (EmptyUtil.isEmpty(ids)) {
            ids = appUnitService.getPids(id);
        }

//        List<String> ids = null;
//        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
//            ids = appUnitService.getPids(id);
//        } else {
//            ids = unitServiceImpl.getPids(id);
//        }

        return ServerResponse.createBySuccess(ids);
    }

    @GetMapping("/listByIds")
    public ServerResponse findByOrgIds(@RequestParam List<String> ids) {

        List list = unitServiceImpl.findByIds(ids);
        list.addAll(appUnitService.findByIds(ids));

        return ServerResponse.createBySuccess(list);
    }
}