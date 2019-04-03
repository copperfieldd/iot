package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.*;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.service.MenuService;
import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.util.EmptyUtil;
import net.sf.json.JSONArray;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AssignPermissions {

    @Resource
    private ApiService apiServiceImpl;

    @Resource
    private MenuService menuServiceImpl;

    @Resource
    private MyThreadLocal myThreadLocal;

    @GetMapping("/assign")
    public APIResult permissionByOrgId() {

        List<MenuInfoDto> menuOptDtos = null;
        List<ApiInfoDto> apiOptDtos = null;

        JSONObject result = new JSONObject();

        try {
            menuOptDtos = menuServiceImpl.findAllMenuByOrgId(myThreadLocal.getUserId());
            apiOptDtos = apiServiceImpl.findAllApiByOrgId(myThreadLocal.getUserId(), false);

            JSONArray apis = analysisApi(apiOptDtos);
            JSONArray menus = analysisMenu(menuOptDtos);

            result.put("menus", menus);
            result.put("apis", apis);

        } catch (ByteException e) {
            return APIResult.failure().setStatus(e.id).setValue(e.value);
        }

        return APIResult.success().setValue(result);
    }

    public JSONArray analysisMenu(List<MenuInfoDto> menus) {

        JSONArray array = new JSONArray();
        net.sf.json.JSONObject obj = null;

        if (EmptyUtil.isNotEmpty(menus)) {
            for (MenuInfoDto menu : menus) {
                obj = new net.sf.json.JSONObject();
                obj.put("id", menu.getId());
                obj.put("name", menu.getName());
                obj.put("englishName", menu.getEnglishName());
                obj.put("children", analysisMenu(menu.getChildren()));

                array.add(obj);
            }
        }
        return array;
    }
    public JSONArray analysisApi(List<ApiInfoDto> apis) {

        JSONArray array = new JSONArray();
        net.sf.json.JSONObject obj = null;

        if (EmptyUtil.isNotEmpty(apis)) {
            for (ApiInfoDto api : apis) {
                obj = new net.sf.json.JSONObject();
                obj.put("id", api.getId());
                obj.put("name", api.getName());
                obj.put("dataUrl", api.getDataUrl());
                obj.put("complexName", apiServiceImpl.getComplexName(api));
                array.add(obj);
            }
        }
        return array;
    }


}
