package com.changhong.iot.application.controller;

import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.AppUserService;
import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.RoleOptDto;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.Appfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.util.*;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： ApplicationController
 * 包名：com.changhong.iot.application.controller
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/29 10:03
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/10/29 10:03
 * 修改备注：
 */
@RestController
@RequestMapping("/api/app")
public class ApplicationController {

    @Resource
    private ApplicationService applicationService;

    @Resource
    private TenantService tenantService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Resource
    private AppUserService appUserService;

    @Resource
    private RoleService roleService;

    @GetMapping("/item")
    public ServerResponse item(@RequestParam String id) {

        ApplicationEntity applicationEntity = applicationService.find(id);

        return ServerResponse.createBySuccess(applicationEntity);
    }

    @GetMapping("/items")
    public ServerResponse tenantManager(@RequestParam String id) {

        JSONObject obj = null;

        ApplicationEntity applicationEntity = applicationService.find(id);
        if (applicationEntity != null) {
            obj = JSONObject.fromObject(applicationEntity);
            obj.remove("createTime");
            obj.remove("updateTime");

            TenantDto tenantDto = tenantService.findById(applicationEntity.getTenantId());
            if (tenantDto != null) {
                obj.put("tenantName", tenantDto.getName());
            }
            AppUser appManager = appUserService.findAppManager(id);
             if (appManager != null) {
                obj.put("user", EntityUtil.entityToDto(appManager, UserOptDto.class));

                ServerResponse<List<RoleOptDto>> response = roleService.findRolesByOrgId(appManager.getId(), MyThreadLocal.getToken());

                obj.put("role", response.getValue());
            } else {
                 obj.put("user", null);
                 obj.put("role", new Object[0]);
             }
        }
        return ServerResponse.createBySuccess(obj);
    }

    @GetMapping("/opt")
    public ServerResponse opt(String tenantId) throws ByteException {

        if (EmptyUtil.isEmpty(tenantId)) {
            tenantId = myThreadLocal.getTenantId();
        }

        JSONArray array = new JSONArray();
        JSONObject obj = null;

        List<ApplicationEntity> all = applicationService.all(tenantId, null);

        for (ApplicationEntity entity : all) {
            obj = new JSONObject();
            obj.put("id", entity.getId());
            obj.put("name", entity.getName());

            array.add(obj);
        }

        return ServerResponse.createBySuccess(array);
    }

    @PostMapping("/add")
    public ServerResponse add(@RequestBody ApplicationEntity applicationEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(applicationEntity, "name", "roleId", "password");

        if (PasswordUtil.passwordNotVerification(applicationEntity.getPassword())) {
            return ServerResponse.createByError(1004);
        }

        if (EmptyUtil.isEmpty(applicationEntity.getTenantId())) {
            if (myThreadLocal.isPlatformManager()) {
                return ServerResponse.createByError(1009,"tenantId");
            }
            applicationEntity.setTenantId(myThreadLocal.getTenantId());
        }

        Map<String, String> map = applicationService.addAppAndOther(applicationEntity);

        return ServerResponse.createBySuccess("保存成功！", map);
    }

    @PostMapping("/upd")
    public ServerResponse upd(@RequestBody ApplicationEntity applicationEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(applicationEntity, "id");
        ParamUtil.setParamNullIgnore(applicationEntity, "id", "name", "remarks", "roleId");

        applicationService.updateApp(applicationEntity);

        return ServerResponse.createBySuccess("修改成功！");
    }

    @GetMapping("/del")
    public ServerResponse del(@RequestParam String id) throws ByteException {

        applicationService.deleteApp(id);

        return ServerResponse.createBySuccess("删除成功！");
    }

    @GetMapping("/list")
    public ServerResponse list(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        Appfilter appfilter = JsonUtil.string2Obj(filter, Appfilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        PageModel page = null;

        if (myThreadLocal.isPlatformManager()) {
            page = applicationService.page(start, count, appfilter, sortEntity);
        } else if (myThreadLocal.isTenantManager()){
            page = applicationService.page(myThreadLocal.getTenantId(), start, count, appfilter, sortEntity);
        } else {
            ApplicationEntity applicationEntity = applicationService.find(myThreadLocal.getUser().getAppId());
            List<ApplicationEntity> apps = new ArrayList<>();
            if (applicationEntity != null) {
                apps.add(applicationEntity);
            }
            page = PageModel.indexToPage(apps.size(), apps);
        }

        List<ApplicationEntity> list = page.getList();
        JSONArray array = new JSONArray();
        JSONObject obj = null;

        for (ApplicationEntity app : list) {
            TenantDto tenantDto = tenantService.findById(app.getTenantId());
            AppUser appManager = appUserService.findAppManager(app.getId());
            obj = new JSONObject();

            obj.put("id", app.getId());
            obj.put("name", app.getName());
            obj.put("tenantId", app.getTenantId());
            obj.put("remarks", app.getRemarks());
            obj.put("creatorName", app.getCreatorName());
            obj.put("createTime", app.getCreateTime());
            obj.put("tenantName", tenantDto == null ? "" :tenantDto.getName());
            obj.put("userId", appManager == null ? "" : appManager.getId());
            obj.put("type", appManager == null ? "" : appManager.getType());
            obj.put("loginName", appManager == null ? "" : appManager.getLoginName());

            array.add(obj);
        }
        page.setList(array);

        return ServerResponse.createBySuccess(page);
    }

    @GetMapping("/all")
    public ServerResponse all(String tenantId, String name) {

        List<ApplicationEntity> all = applicationService.all(tenantId, name);

        JSONArray array = new JSONArray();
        JSONObject obj = null;

        for (ApplicationEntity app : all) {
            obj = new JSONObject();

            obj.put("id", app.getId());
            obj.put("name", app.getName());
            obj.put("tenantId", app.getTenantId());
            obj.put("creatorName", app.getCreatorName());
            obj.put("createTime", app.getCreateTime());

            array.add(obj);
        }

        return ServerResponse.createBySuccess(array);
    }

}
