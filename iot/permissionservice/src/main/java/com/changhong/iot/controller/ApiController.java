package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApiInfoDto;
import com.changhong.iot.entity.ApiEntity;
import com.changhong.iot.searchdto.Apifilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.JsonUtil;
import com.changhong.iot.util.ParamUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/interface")
public class ApiController {

    @Resource
    private ApiService apiServiceImpl;

    @Resource
    private RedisTemplate redisTemplate;
    
    @Resource
    private MyThreadLocal myThreadLocal;

    @PostMapping("/add")
    public APIResult addApi(@RequestBody ApiEntity apiEntity) throws ByteException {

        if (myThreadLocal.isAppUser()) {
            apiEntity.setAppId(myThreadLocal.getUser().getAppId());
            apiEntity.setServiceId(null);
        }

        ParamUtil.checkOrParamNotNullAndNotEmpty(apiEntity, "serviceId", "appId");
        ParamUtil.checkParamNotNullAndNotEmpty(apiEntity, "name","dataUrl", "type");

        apiServiceImpl.save(apiEntity);

        return APIResult.success().setMessage("保存成功！").setValue(apiEntity);
    }

    @PostMapping("/upd")
    public APIResult updateApi(@RequestBody ApiEntity apiEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(apiEntity, "id");
        ParamUtil.setParamNullIgnore(apiEntity, "id", "name", "type", "dataUrl", "remarks");

        apiServiceImpl.update(apiEntity);

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/item")
    public APIResult findApi(@RequestParam("id") String apiId) {

        ApiInfoDto apiInfoDto = apiServiceImpl.find(apiId);

        return APIResult.success().setValue(apiInfoDto);
    }

    @GetMapping("/del")
    public APIResult deleteApi(@RequestParam("id") String apiId) throws ByteException {

        apiServiceImpl.delete(apiId);

        return APIResult.success().setMessage("删除成功！");
    }

    @GetMapping("/delByApp")
    public ServerResponse deleteByAppId(@RequestParam String appId) throws ByteException {

        apiServiceImpl.deleteByAppId(appId);

        return ServerResponse.createBySuccess();
    }

    @GetMapping("/list")
    public APIResult listApi(@RequestParam int start, @RequestParam int count, String serviceId, String appId, String tenantId, String filter, String sort) throws ByteException {

        Apifilter apifilter = JsonUtil.string2Obj(filter, Apifilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        if (EmptyUtil.isEmpty(serviceId) && EmptyUtil.isEmpty(appId) && EmptyUtil.isEmpty(tenantId)) {
            return APIResult.failure().setStatus(1009).setValues("serviceId or apiId or tenantId");
        }

        PageModel pageModel = null;
        if (EmptyUtil.isNotEmpty(serviceId)) {
            pageModel = apiServiceImpl.listByServiceId(start, count, serviceId, apifilter, sortEntity);
        } else if (EmptyUtil.isNotEmpty(appId)){
            pageModel = apiServiceImpl.listByAppId(start, count, appId, apifilter, sortEntity);
        } else if (EmptyUtil.isNotEmpty(tenantId)){
            pageModel = apiServiceImpl.findAllApiByTenantId(tenantId, true, start, count);
        }

        apiServiceImpl.setComplexName(pageModel.getList());

        return APIResult.success().setValue(pageModel);
    }

    @PostMapping("/import")
    public ServerResponse importApi(@RequestParam("file")MultipartFile file) throws ByteException {

        try {
            apiServiceImpl.importApi(file.getInputStream(), file.getOriginalFilename());
        } catch (IOException e) {
            e.printStackTrace();
        }
            return null;
    }

    @GetMapping("/listByRole")
    public APIResult findApisByRoleId(@RequestParam("id") String roleId) {

        List<ApiInfoDto> apiOptDtos = apiServiceImpl.findAllApiByRoleId(roleId);

        apiServiceImpl.setComplexName(apiOptDtos);

        return APIResult.success().setValue(apiOptDtos);
    }


    @GetMapping("/listByOrg")
    public APIResult findApisByOrgId(String id) throws ByteException {

        if (EmptyUtil.isEmpty(id)) {
            id = myThreadLocal.getUserId();
        }

        List<ApiInfoDto> apiOptDtos = apiServiceImpl.findAllApiByOrgId(id, true);

        apiServiceImpl.setComplexName(apiOptDtos);

        return APIResult.success().setValue(apiOptDtos);
    }

    @GetMapping("/listByTenant")//租户可以访问的api
    public APIResult findAllApisByTenant(@RequestParam("id") String tenantId) throws ByteException {

        List<ApiInfoDto> apiOptDtos = apiServiceImpl.findAllApiByTenantId(tenantId, true);

        apiServiceImpl.setComplexName(apiOptDtos);

        return APIResult.success().setValue(apiOptDtos);
    }

    @GetMapping("/items")
    public List<ApiInfoDto> findByApiIds(@RequestParam List<String> ids) {

        List<ApiInfoDto> apiByApiIds = apiServiceImpl.findApiByApiIds(ids);

        apiServiceImpl.setComplexName(apiByApiIds);

        return apiByApiIds;
    }
}
