package com.changhong.iot.controller;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.AppUserService;
import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.*;
import com.changhong.iot.entity.UserEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.EndUserfilter;
import com.changhong.iot.searchdto.PlatformManagerfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Resource
    private RoleService roleService;

    @Resource
    private UserService userServiceImpl;

    @Resource
    private AppUserService appUserService;

    @Resource
    private TenantService tenantService;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @GetMapping("/current")
    public ServerResponse getCurrentUser() throws ByteException {
        return ServerResponse.createBySuccess(myThreadLocal.getUser());
    }

    @GetMapping("/items")
    public ServerResponse getCurrentUserAndTenant() throws ByteException {

        JSONObject json = userServiceImpl.getCurrentUserAndTenant(myThreadLocal.getUser());

        return ServerResponse.createBySuccess(json);
    }


    @GetMapping("/item")
    public APIResult findById(@RequestParam String id, String appId) {

        net.sf.json.JSONObject obj = appUserService.findByIdOrEndUser(id);

        if (obj == null) {
            UserDto userDto = userServiceImpl.findById(id);
            if (userDto != null) {
                obj = net.sf.json.JSONObject.fromObject(userDto);
            }
        }

//        if (EmptyUtil.isNotEmpty(appId) || myThreadLocal.isAppManager()) {
//            obj = appUserService.findByIdOrEndUser(id);
//        } else {
//            UserDto userDto = userServiceImpl.findById(id);
//            if (userDto != null) {
//                obj = net.sf.json.JSONObject.fromObject(userDto);
//            }
//        }

        if (obj != null) {
            obj = setRole(obj, obj.getString("tenantId"), obj.getString("appId"), id);
        }
        return APIResult.success().setValue(obj);
    }

    private net.sf.json.JSONObject setRole(net.sf.json.JSONObject obj, String tenantId, String appId, String id) {

        if (obj == null) {
            return null;
        }

        obj.remove("token");

        TenantDto tenantDto = tenantService.findById(tenantId);
        if (tenantDto != null) {
            obj.put("tenantName", tenantDto.getName());
        }
        if (EmptyUtil.isNotEmpty(appId)) {
            ApplicationEntity applicationEntity = applicationService.find(appId);
            if (applicationEntity != null) {
                obj.put("appName", applicationEntity.getName());
            }
        }

        ServerResponse<List<RoleOptDto>> serverResponse = roleService.findRolesByOrgId(id, MyThreadLocal.getToken());

        obj.put("role", serverResponse.getValue());

        return obj;
    }


    @PostMapping("/add")
    public APIResult addUser(@RequestBody UserEntity userEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(userEntity, "userName", "loginName", "password");

        if (PasswordUtil.passwordNotVerification(userEntity.getPassword())) {
            return APIResult.failure().setStatus(1017).setValue("password");
        }

        if (myThreadLocal.isPlatformManager() && EmptyUtil.isEmpty(userEntity.getTenantId())) {
            return APIResult.failure().setStatus(1009).setValues("tenantId");
        } else if (EmptyUtil.isEmpty(userEntity.getTenantId())) {
            userEntity.setTenantId(myThreadLocal.getTenantId());
        }
        if(EmptyUtil.isEmpty(userEntity.getAppId()) && myThreadLocal.isAppManager()) {
            userEntity.setAppId(myThreadLocal.getUser().getAppId());
        }

        if (EmptyUtil.isNotEmpty(userEntity.getAppId())) {
            Integer type = userEntity.getType();
            if (type == null || (!type.equals(ConfigValue.APPLICATION_USER) && !type.equals(ConfigValue.END_USER))) {
                return APIResult.failure().setStatus(1009).setValues("type");
            } else if (type.equals(ConfigValue.APPLICATION_USER) && EmptyUtil.isEmpty(userEntity.getPid())) {
                return APIResult.failure().setStatus(1009).setValues("pid");
            }
        } else if (EmptyUtil.isEmpty(userEntity.getPid())) {
            return APIResult.failure().setStatus(1009).setValues("pid");
        }

        Object user = null;
        if (EmptyUtil.isNotEmpty(userEntity.getAppId())) {
            AppUser appUser = (AppUser) EntityUtil.entityToDto(userEntity, AppUser.class);
            user = appUserService.addUser(appUser);
            ((AppUser)user).setPassword(null);
        } else {
            user = userServiceImpl.addUser(userEntity);
            ((UserEntity)user).setPassword(null);
        }
        return APIResult.success().setMessage("保存成功！").setValue(user);
    }

    @GetMapping("/listPlatformManager")
    public ServerResponse listPlatformManager(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        PlatformManagerfilter platformManagerfilter = JsonUtil.string2Obj(filter, PlatformManagerfilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        PageModel pageModel = userServiceImpl.listPlatformManager(start, count, platformManagerfilter, sortEntity);

        return ServerResponse.createBySuccess(pageModel);
    }

    @PostMapping("/addPlatformManager")
    public APIResult addPlatformManager(@RequestBody UserEntity userEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(userEntity, "loginName", "password");

        if (PasswordUtil.passwordNotVerification(userEntity.getPassword())) {
            return APIResult.failure().setStatus(1017).setValues("password");
        }

        UserEntity user = userServiceImpl.addPlatformManager(userEntity);

        return APIResult.success().setMessage("保存成功！").setValue(user);
    }

    @PostMapping("/updPlatformManager")
    public ServerResponse updPlatformManager(@RequestBody UserEntity userEntity) throws ByteException {

        String id = userEntity.getId();
        String remarks = userEntity.getRemarks();
        String name = userEntity.getLoginName();

        if (EmptyUtil.isEmpty(id)) {
            return ServerResponse.createByError(1009, "id");
        }
        if (EmptyUtil.isEmpty(name)) {
            return ServerResponse.createByError(1009, "loginName");
        }
        userServiceImpl.updPlatformManager(id, name, null, remarks);

        return ServerResponse.createBySuccessMessage("修改成功！");
    }

    @PostMapping("/upd")
    public APIResult updateUser(@RequestBody UserEntity userEntity) throws ByteException {

        if (EmptyUtil.isEmpty(userEntity.getId())) {
            return APIResult.failure().setStatus(1009).setValues("id");
        }

        if (EmptyUtil.isNotEmpty(userEntity.getPassword()) && PasswordUtil.passwordNotVerification(userEntity.getPassword())) {
            return APIResult.failure().setStatus(1017).setValues("password");
        }

        if (myThreadLocal.isPlatformManager() && EmptyUtil.isEmpty(userEntity.getTenantId())) {
            return APIResult.failure().setStatus(1009).setValues("tenantId");
        } else if (EmptyUtil.isEmpty(userEntity.getTenantId())) {
            userEntity.setTenantId(myThreadLocal.getTenantId());
        }
        if(EmptyUtil.isEmpty(userEntity.getAppId()) && myThreadLocal.isAppManager()) {
            userEntity.setAppId(myThreadLocal.getUser().getAppId());
        }

        userEntity.setCreateTime(null);
        userEntity.setDeleteFlag(null);
        userEntity.setUpdateTime(null);
        userEntity.setSortNum(null);
        userEntity.setValid(null);
        userEntity.setPassword(null);
        userEntity.setType(null);

        if (EmptyUtil.isNotEmpty(userEntity.getAppId())) {
            AppUser appUser = (AppUser) EntityUtil.entityToDto(userEntity, AppUser.class);
            appUserService.updateUser(appUser);
        } else {
            userServiceImpl.updateUser(userEntity);
        }

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteUserById(@RequestParam String id, String appId) throws ByteException {

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            appUserService.delete(id, myThreadLocal.getUser().getType());
        } else {
            userServiceImpl.delete(id, myThreadLocal.getUser().getType());
        }

        return APIResult.success().setMessage("删除成功！");
    }

    @PostMapping("/password/upd/designation")
    public ServerResponse updPasswordDesignation(@RequestBody String body) throws ByteException {

        JSONObject obj = JSONObject.parseObject(body);

        String userId = null;
        String newPassword = null;
        String appId = null;

        if (obj.containsKey("userId") && obj.containsKey("newPassword")) {
            userId = obj.getString("userId");
            newPassword = obj.getString("newPassword");
        } else {
            return ServerResponse.createByError(1004);
        }

        if (obj.containsKey("appId")) {
            appId = obj.getString("appId");
        }

        if (PasswordUtil.passwordNotVerification(newPassword)) {
            return ServerResponse.createByError(1004, "newPassword");
        }

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            appUserService.updPassword(userId, newPassword);
        } else {
            int type;
            if (obj.containsKey("type")) {
                type = obj.getIntValue("type");
            } else {
                return ServerResponse.createByError(1009, "type");
            }
            if (type == ConfigValue.APPLICATION_MANAGER || type == ConfigValue.APPLICATION_USER || type == ConfigValue.END_USER) {
                appUserService.updPassword(userId, newPassword);
            } else {
                userServiceImpl.updPassword(userId, newPassword);
            }
        }

        return ServerResponse.createBySuccess();
    }


    @PostMapping("/password/upd")
    public APIResult updPassword(@RequestBody String body) throws ByteException {

        JSONObject obj = JSONObject.parseObject(body);

        String oldPassword = null;
        String newPassword = null;

        if (obj.containsKey("oldPassword") && obj.containsKey("newPassword")) {
            oldPassword = obj.getString("oldPassword");
            newPassword = obj.getString("newPassword");
        } else {
            return APIResult.failure().setStatus(1004);
        }

        if (PasswordUtil.passwordNotVerification(newPassword)) {
            return APIResult.failure().setStatus(1017).setValues("password");
        }

        if (myThreadLocal.isAppUser()) {
            appUserService.updPassword(myThreadLocal.getUserId(), oldPassword, newPassword);
        } else {
            userServiceImpl.updPassword(myThreadLocal.getUserId(), oldPassword, newPassword);
        }
        return APIResult.success().setMessage("修改成功！");
    }

    @PostMapping("/batch")
    public APIResult batch(@RequestBody List<UserEntity> userEntities) throws ByteException {

        for (UserEntity userEntity : userEntities) {

            ParamUtil.checkParamNotNullAndNotEmpty(userEntity, "userName", "loginName", "password");

            if (EmptyUtil.isNotEmpty(userEntity.getPassword()) && PasswordUtil.passwordNotVerification(userEntity.getPassword())) {
                return APIResult.failure().setStatus(1017).setValues("password");
            }

            if (myThreadLocal.isPlatformManager() && EmptyUtil.isEmpty(userEntity.getTenantId())) {
                return APIResult.failure().setStatus(1009).setValues("tenantId");
            } else if (EmptyUtil.isEmpty(userEntity.getTenantId())) {
                userEntity.setTenantId(myThreadLocal.getTenantId());
            }
            if(EmptyUtil.isEmpty(userEntity.getAppId()) && myThreadLocal.isAppManager()) {
                userEntity.setAppId(myThreadLocal.getUser().getAppId());
            }

            if (EmptyUtil.isNotEmpty(userEntity.getAppId())) {
                Integer type = userEntity.getType();
                if (type == null || (!type.equals(ConfigValue.APPLICATION_USER) && !type.equals(ConfigValue.END_USER))) {
                    return APIResult.failure().setStatus(1004).setValues("type");
                } else if (type.equals(ConfigValue.APPLICATION_USER) && EmptyUtil.isEmpty(userEntity.getPid())) {
                    return APIResult.failure().setStatus(1009).setValues("pid");
                }
            } else if (EmptyUtil.isEmpty(userEntity.getPid())) {
                return APIResult.failure().setStatus(1009).setValues("pid");
            }

            if (EmptyUtil.isNotEmpty(userEntity.getAppId())) {
                AppUser appUser = (AppUser) EntityUtil.entityToDto(userEntity, AppUser.class);
                appUserService.addUser(appUser);
            } else {
                userServiceImpl.addUser(userEntity);
            }
        }

        return APIResult.success().setMessage("保存成功！").setValue(userEntities);
    }

    @GetMapping("/recursive")
    public APIResult recursive(@RequestParam String id, String appId) throws ByteException {

        List<UserOptDto> userOptDtos = null;

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            userOptDtos = appUserService.recursive(myThreadLocal.getUser().getAppId(), id);
        } else {
            userOptDtos = userServiceImpl.recursive(myThreadLocal.getTenantId(), id);
        }

        return APIResult.success().setValue(userOptDtos);
    }

    @GetMapping("/sort")
    public APIResult sort(@RequestParam String thisId, String nextId, String appId) throws ByteException {

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            appUserService.sort(thisId, nextId);
        } else {
            userServiceImpl.sort(thisId, nextId);
        }

        return APIResult.success().setMessage("排序成功！");
    }

    @GetMapping("/search")
    public APIResult search(@RequestParam String name, String appId) throws ByteException {

        List<UserOptDto> userOptDtos = null;

        if (myThreadLocal.isAppManager() || EmptyUtil.isNotEmpty(appId)) {
            userOptDtos = appUserService.search(myThreadLocal.getUser().getAppId(), name);
        } else {
            userOptDtos = userServiceImpl.search(myThreadLocal.getTenantId(), name);
        }

        return APIResult.success().setValue(userOptDtos);
    }

    @GetMapping("/endList")
    public ServerResponse endUserList(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        EndUserfilter endUserfilter = JsonUtil.string2Obj(filter, EndUserfilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        PageModel page = appUserService.endUserList(start, count, endUserfilter, sortEntity);

        List<EndUserDto> users = page.getList();

        for (EndUserDto user : users) {
            TenantDto tenantDto = tenantService.findById(user.getTenantId());
            user.setTenantName(tenantDto == null ? "" : tenantDto.getName());
            ApplicationEntity applicationEntity = applicationService.find(user.getAppId());
            user.setAppName(applicationEntity == null ? "" : applicationEntity.getName());
            UserDto userDto = appUserService.findById(user.getCreatorId());
            user.setCreatorName(userDto == null ? "" : userDto.getUserName());
        }

        return ServerResponse.createBySuccess(page);
    }

    @GetMapping("/manager")
    public ServerResponse findManagerByAppId(@RequestParam String appId) {

        AppUser appManager = appUserService.findAppManager(appId);

        return ServerResponse.createBySuccess(EntityUtil.entityToDto(appManager, UserDto.class));
    }

    @GetMapping("/listByIds")
    public ServerResponse findByOrgIds(@RequestParam List<String> ids) {

        List list = userServiceImpl.findByIds(ids);
        list.addAll(appUserService.findByIds(ids));

        return ServerResponse.createBySuccess(list);
    }


    @GetMapping("/listByUserName")
    public ServerResponse listByUserName(String userName) throws ByteException {

        Map<String, String> map = null;

        if (myThreadLocal.isAppUser()) {
            map = appUserService.listByUserName(myThreadLocal.getTenantId(), userName);
        } else if (myThreadLocal.isPlatformManager()){
            map = appUserService.listByUserName(null, userName);
            map.putAll(userServiceImpl.listByUserName(null, userName));
        } else {
            map = appUserService.listByUserName(myThreadLocal.getTenantId(), userName);
            map.putAll(userServiceImpl.listByUserName(myThreadLocal.getTenantId(), userName));
        }

        return ServerResponse.createBySuccess(map);
    }


}
