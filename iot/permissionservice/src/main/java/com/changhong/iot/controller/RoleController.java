package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApiInfoDto;
import com.changhong.iot.dto.MenuInfoDto;
import com.changhong.iot.dto.RoleInfoDto;
import com.changhong.iot.dto.RoleOptDto;
import com.changhong.iot.entity.RoleEntity;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.service.MenuService;
import com.changhong.iot.service.RoleService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.ParamUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Resource
    private RoleService roleServiceImpl;

    @Resource
    private RedisTemplate redisTemplate;

    @Resource
    private ApiService apiService;

    @Resource
    private MenuService menuService;

    @Resource
    private OrgService orgService;

    @Resource
    private MyThreadLocal myThreadLocal;
    
    @GetMapping("/item")
    public APIResult findRoleByRoleId(@RequestParam("id") String roleId) throws ByteException {

        RoleInfoDto roleInfoDto = roleServiceImpl.find(roleId);

        JSONObject json = setApiNameAndMenuName(roleInfoDto);

        return APIResult.success().setValue(json);
    }

    private JSONObject setApiNameAndMenuName(RoleInfoDto roleInfoDto) throws ByteException {

        if (roleInfoDto == null) {
            return null;
        }
        JSONObject obj = JSONObject.fromObject(roleInfoDto);

        if (EmptyUtil.isNotEmpty(roleInfoDto.getApiIds())) {
            List<ApiInfoDto> apiByApiIds = apiService.findApiByApiIds(roleInfoDto.getApiIds());
            apiService.setComplexName(apiByApiIds);
            obj.put("api", apiByApiIds);
        }
        if (EmptyUtil.isNotEmpty(roleInfoDto.getMenuIds())) {
            List<MenuInfoDto> menuByMenuIds = menuService.findMenuByMenuIds(roleInfoDto.getMenuIds());
            obj.put("menu", menuByMenuIds);
        }
        if (EmptyUtil.isNotEmpty(roleInfoDto.getOrgIds())) {
            JSONArray array = orgService.findByUserIds(roleInfoDto.getOrgIds());
            obj.put("org", array);
        }

        return obj;
    }

    @PostMapping("/add")
    public APIResult addRole(@RequestBody RoleEntity roleEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(roleEntity, "name");

        roleServiceImpl.save(roleEntity);

        return APIResult.success().setMessage("保存成功！").setValue(roleEntity);
    }

    @PostMapping("/upd")
    public APIResult updateRole(@RequestBody RoleEntity roleEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(roleEntity, "id");
        ParamUtil.setParamNullIgnore(roleEntity, "id", "name", "remarks", "orgIds", "menuIds", "apiIds");

        roleServiceImpl.update(roleEntity);

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteRole(@RequestParam("id") String roleId) throws ByteException {

        roleServiceImpl.delete(roleId);

        return APIResult.success().setMessage("删除成功！");
    }

    @GetMapping("/delByApp")
    public ServerResponse deleteByAppId(@RequestParam String appId) throws ByteException {

        roleServiceImpl.deleteByAppId(appId);

        return ServerResponse.createBySuccess();
    }

    @GetMapping("/opt")
    public APIResult optRole() throws ByteException {

        List<Map<String, Object>> list = roleServiceImpl.optRole(myThreadLocal.getTenantId());

        return APIResult.success().setValue(list);
    }

    @GetMapping("/list")
    public APIResult listRole(@RequestParam int start, @RequestParam int count, String name, String tenantId) throws ByteException {

        if (EmptyUtil.isEmpty(tenantId)) {
            tenantId = myThreadLocal.getTenantId();
        }

        PageModel pageModel = roleServiceImpl.list(start, count, tenantId, name);

        return APIResult.success().setValue(pageModel);
    }

    @GetMapping("/listByAppId")
    public APIResult listRoleByAppId(@RequestParam int start, @RequestParam int count, String name, String appId) throws ByteException {

        if (EmptyUtil.isEmpty(appId)) {
            if (myThreadLocal.isAppUser()) {
                appId = myThreadLocal.getUser().getAppId();
            } else {
                return APIResult.failure().setStatus(1009).setValues("appId");
            }
        }

        PageModel pageModel = roleServiceImpl.listByAppId(start, count, appId, name);

        return APIResult.success().setValue(pageModel);
    }

    @GetMapping("/listByOrg")
    public ServerResponse<List<RoleOptDto>> findRolesByOrgId(String id) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = myThreadLocal.getUserId();
        }

        List<RoleOptDto> roleOptDtos = roleServiceImpl.findAllRolesByOrgId(id);

        return ServerResponse.createBySuccess(roleOptDtos);

    }

    @PostMapping("/updOrgRole")
    public void updateRoleByOrgId(@RequestParam String orgId, @RequestParam List<String> roleIds) {

        roleServiceImpl.updateRoleByOrgId(orgId, roleIds);
    }

}
