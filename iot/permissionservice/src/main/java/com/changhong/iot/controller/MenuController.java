package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.MenuInfoDto;
import com.changhong.iot.dto.MenuOptDto;
import com.changhong.iot.entity.MenuEntity;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.service.MenuService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.ParamUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Resource
    private MenuService menuServiceImpl;

    @Resource
    private OrgService orgService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @GetMapping("/tree")
    public APIResult findMenuAllByOrgId(String id) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = myThreadLocal.getUserId();
        }

        List<MenuInfoDto> menuOptDtos = menuServiceImpl.findAllMenuByOrgId(id);

        JSONArray array = new JSONArray();
        JSONObject obj = new JSONObject();
        obj.put("id", "0");
        obj.put("name", "/");
        obj.put("englishName", "/");
        obj.put("children", menuOptDtos);

        array.add(obj);

        return APIResult.success().setValue(array);

    }
    @GetMapping("/treeByAppId")
    public ServerResponse findMenuAllByAppId(@RequestParam String id) throws ByteException {

        List<MenuInfoDto> allMenuByAppId = menuServiceImpl.findAllMenuByAppId(id);

        JSONArray array = new JSONArray();
        JSONObject obj = new JSONObject();
        obj.put("id", "0");
        obj.put("name", "/");
        obj.put("englishName", "/");
        obj.put("children", allMenuByAppId);

        array.add(obj);

        return ServerResponse.createBySuccess(array);
    }

    @GetMapping("/item")
    public APIResult findMenuById(@RequestParam("id") String menuId) {

        MenuInfoDto menuInfoDto = menuServiceImpl.find(menuId);

        return APIResult.success().setValue(menuInfoDto);
    }

    @PostMapping("/add")
    public APIResult addMenu(@RequestBody MenuEntity menuEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(menuEntity, "name", "apiId", "tag");

        menuServiceImpl.save(menuEntity);

        return APIResult.success().setMessage("保存成功！").setValue(menuEntity);
    }

    @PostMapping("/batch")
    public APIResult addMenuBatch(@RequestBody List<MenuEntity> menuEntities) throws ByteException {

        for (MenuEntity menuEntity : menuEntities) {
            ParamUtil.checkParamNotNullAndNotEmpty(menuEntity, "name", "apiId", "tag");
        }

        menuServiceImpl.save(menuEntities);

        return APIResult.success().setMessage("保存成功！");
    }

    @PostMapping("/upd")
    public APIResult updateMenu(@RequestBody MenuEntity menuEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(menuEntity, "id");
        ParamUtil.setParamNullIgnore(menuEntity, "id", "name", "pid", "apiId", "remarks", "tag", "englishName");

        menuServiceImpl.update(menuEntity);

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteMenu(@RequestParam("id") String menuId) throws ByteException {

        menuServiceImpl.delete(menuId);

        return APIResult.success().setMessage("删除成功！");
    }

    @GetMapping("/delByTenant")
    public ServerResponse deleteByTenantId(@RequestParam String tenantId) throws ByteException {

        menuServiceImpl.deleteByTenantId(tenantId);

        return ServerResponse.createBySuccess();
    }

    @GetMapping("/delByApp")
    public ServerResponse deleteByAppId(@RequestParam String appId) throws ByteException {

        menuServiceImpl.deleteByAppId(appId);

        return ServerResponse.createBySuccess();
    }

    @GetMapping("/sort")
    public APIResult sortMenu(@RequestParam String thisId, String nextId) throws ByteException {

        menuServiceImpl.sortMenu(thisId, nextId);

        return APIResult.success().setMessage("排序成功！");
    }

    @GetMapping("/listByRole")
    public APIResult findMenusByRoleId(@RequestParam("id") String roleId) {

        List<MenuOptDto> menuOptDtos = menuServiceImpl.findAllMenuByRoleId(roleId);

        return APIResult.success().setValue(menuOptDtos);
    }

    @GetMapping("/listByTenant")
    public APIResult findAllMenusByTenant(@RequestParam("id") String tenantId) {

        List<MenuOptDto> menuOptDtos = menuServiceImpl.findAllMenusByTenant(tenantId);

        JSONArray array = new JSONArray();
        JSONObject obj = new JSONObject();
        obj.put("id", "0");
        obj.put("name", "/");
        obj.put("englishName", "/");
        obj.put("children", menuOptDtos);

        array.add(obj);

        return APIResult.success().setValue(array);
    }

    @GetMapping("/items")
    public List<MenuOptDto> listByIds(@RequestParam List<String> ids) {

        List<MenuInfoDto> menuByMenuIds = menuServiceImpl.findMenuByMenuIds(ids);

        return EntityUtil.entityListToDtoList(menuByMenuIds, MenuOptDto.class);
    }

}
