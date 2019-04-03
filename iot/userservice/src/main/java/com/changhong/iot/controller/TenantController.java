package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.TenantOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.searchdto.Tenantfilter;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.JsonUtil;
import com.changhong.iot.util.ParamUtil;
import com.changhong.iot.util.PasswordUtil;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenant")
public class TenantController {

    @Resource
    private TenantService tenantServiceImpl;

    @Resource
    private UserService userService;

    @Resource
    private RoleService roleService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @GetMapping("/item")
    public APIResult getTenantById(@RequestParam String id) {

        TenantDto tenantDto = tenantServiceImpl.findById(id);

        return APIResult.success().setValue(tenantDto);
    }

    @GetMapping("/items")
    public APIResult items(@RequestParam String id) {

        TenantDto tenantDto = tenantServiceImpl.findById(id);

        JSONObject obj = null;

        if (tenantDto != null) {
            obj = JSONObject.fromObject(tenantDto);
            obj.remove("startTime");
            obj.remove("createTime");

            UserDto admin = userService.findAdminByTenantId(tenantDto.getId());

            if (admin != null) {
                obj.put("user", admin);

//                ServerResponse<List<RoleOptDto>> response = roleService.findRolesByOrgId(admin.getId(), MyThreadLocal.getToken());
//                obj.put("role", response.getValue());
            }
        }

        return APIResult.success().setValue(obj);
    }

    @PostMapping("/add")
    public APIResult addTenant(@RequestBody TenantEntity tenantEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(tenantEntity, "name", "gradeId", "password");

        if (PasswordUtil.passwordNotVerification(tenantEntity.getPassword())) {
            return APIResult.failure().setStatus(1017).setValues("password");
        }

        Map<String, Object> map = tenantServiceImpl.addTenant(tenantEntity);

        return APIResult.success().setValue(map).setMessage("添加成功！");
    }

    @PostMapping("/upd")
    public APIResult updateTenant(@RequestBody TenantEntity tenantEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(tenantEntity, "id");
        ParamUtil.setParamNullIgnore(tenantEntity, "id", "name", "gradeId", "tag", "remarks");

        tenantServiceImpl.updateTenant(tenantEntity);

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteTenant(@RequestParam String id) throws ByteException {

        tenantServiceImpl.deleteTenantById(myThreadLocal.getTenantId(), id);

        return APIResult.success().setMessage("删除成功！");
    }

    @GetMapping("/list")
    public APIResult listTenant(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        Tenantfilter tenantfilter = JsonUtil.string2Obj(filter, Tenantfilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);
        PageModel pageModel = null;

        pageModel = tenantServiceImpl.listTenante(start, count, tenantfilter, sortEntity);
        List<TenantDto> list = pageModel.getList();
        for (TenantDto tenantDto : list) {
            UserDto admin = userService.findAdminByTenantId(tenantDto.getId());
            tenantDto.setLoginName(admin.getLoginName());
            tenantDto.setUserId(admin.getId());
            tenantDto.setType(admin.getType());
        }

        return APIResult.success().setValue(pageModel);
    }

    @GetMapping("/all")
    public APIResult listTenantAll(String name) throws ByteException {

        List<TenantOptDto> tenantOptDtos = tenantServiceImpl.allTenant(myThreadLocal.getTenantId(), name);

        return APIResult.success().setValue(tenantOptDtos);
    }

    @GetMapping("/pids")
    public ServerResponse getPids(@RequestParam String id) throws ByteException {

        return ServerResponse.createBySuccess(tenantServiceImpl.findPids(id));
    }

    @GetMapping("/listByName")
    public ServerResponse listByName(String name) throws ByteException {

        Map<String, String> map = tenantServiceImpl.listByName(name);

        return ServerResponse.createBySuccess(map);
    }

}
