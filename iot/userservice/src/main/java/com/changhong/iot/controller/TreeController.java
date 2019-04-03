package com.changhong.iot.controller;

import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.application.service.ApplicationService;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ServiceOptDto;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.TenantOptDto;
import com.changhong.iot.rpc.ServiceService;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TreeController {

    @Resource
    private ServiceService serviceService;

    @Resource
    private TenantService tenantService;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @GetMapping("/tree")
    public ServerResponse tree(@RequestParam int type) throws ByteException {

        JSONArray top = new JSONArray();
        JSONObject obj = null;
        JSONArray services = new JSONArray();

        if (type == 1) {
            ServerResponse<List<ServiceOptDto>> response = serviceService.opt(MyThreadLocal.getToken());

            if (response.getStatus() == 0) {
                List<ServiceOptDto> all = response.getValue();
                if (EmptyUtil.isNotEmpty(all)) {
                    for (ServiceOptDto entity : all) {
                        obj = new JSONObject();
                        obj.put("id", entity.getId());
                        obj.put("name", entity.getName());
                        obj.put("englishName", entity.getEnglishName());
                        obj.put("type", 2);
                        obj.put("children", new ArrayList<>());

                        services.add(obj);
                    }
                }
            }

        } else if (type == 2) {
        }

        if (myThreadLocal.isPlatformManager()) {

            obj = new JSONObject();
            obj.put("id", "0");
            obj.put("name", "平台");
            obj.put("englishName", "platform");
            obj.put("type", 1);
            obj.put("children", services);

            top.add(obj);

            List<TenantOptDto> tenants = tenantService.allTenant(myThreadLocal.getTenantId(), null);
            top.addAll(analysisTenant(tenants));

        } else if (myThreadLocal.isTenantManager()) {

            TenantDto tenantDto = tenantService.findById(myThreadLocal.getTenantId());
            top.add(analysisTenant((TenantOptDto) EntityUtil.entityToDto(tenantDto, TenantOptDto.class)));

        } else if (myThreadLocal.isAppManager()) {
            TenantDto tenantDto = tenantService.findById(myThreadLocal.getTenantId());
            ApplicationEntity applicationEntity = applicationService.find(myThreadLocal.getUser().getAppId());

            JSONObject object = analysisApplication(applicationEntity);

            obj = new JSONObject();
            obj.put("id", tenantDto.getId());
            obj.put("name", tenantDto.getName());
            obj.put("type", 3);
            obj.put("children", new Object[] {object});

            top.add(obj);
        }

        return ServerResponse.createBySuccess(top);
    }

    public JSONObject analysisApplication(ApplicationEntity applicationEntity) {

        JSONObject obj = new JSONObject();
        obj.put("id", applicationEntity.getId());
        obj.put("name", applicationEntity.getName());
        obj.put("type", 4);
        obj.put("children", new ArrayList<>());

        return obj;
    }

    public JSONArray analysisApplication(List<ApplicationEntity> applicationEntitys) {

        JSONArray array = new JSONArray();

        if (EmptyUtil.isNotEmpty(applicationEntitys)) {
            for (ApplicationEntity applicationEntity : applicationEntitys) {
                JSONObject jsonObject = analysisApplication(applicationEntity);
                if (jsonObject != null) {
                    array.add(jsonObject);
                }
            }
        }

        return array;
    }

    public JSONObject analysisTenant(TenantOptDto tenant) {

        if (tenant == null) {
            return null;
        }
        List<ApplicationEntity> all = applicationService.all(tenant.getId(), null);

        JSONArray array = analysisApplication(all);

        JSONObject obj = new JSONObject();
        obj.put("id", tenant.getId());
        obj.put("name", tenant.getName());
        obj.put("type", 3);
        obj.put("children", array);

        return obj;
    }

    public JSONArray analysisTenant(List<TenantOptDto> tenants) {

        JSONArray array = new JSONArray();

        if (EmptyUtil.isNotEmpty(tenants)) {
            for (TenantOptDto tenantOptDto : tenants) {
                JSONObject jsonObject = analysisTenant(tenantOptDto);
                if (jsonObject != null) {
                    array.add(jsonObject);
                }
            }
        }

        return array;
    }
}
