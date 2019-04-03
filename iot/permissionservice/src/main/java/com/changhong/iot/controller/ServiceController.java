package com.changhong.iot.controller;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.ServiceDto;
import com.changhong.iot.dto.ServiceOptDto;
import com.changhong.iot.entity.ServiceEntity;
import com.changhong.iot.service.ServiceService;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.ParamUtil;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceController {

    @Resource
    private ServiceService serviceService;

    @GetMapping("/item")
    public ServerResponse item(@RequestParam String id) {

        ServiceEntity entity = serviceService.find(id);

        return ServerResponse.createBySuccess(EntityUtil.entityToDto(entity, ServiceDto.class));
    }

    @PostMapping("/upd")
    public ServerResponse upd(@RequestBody ServiceEntity serviceEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(serviceEntity, "id");
        ParamUtil.setParamNullIgnore(serviceEntity, "id", "name", "remarks", "englishName");

        serviceService.upd(serviceEntity);

        return ServerResponse.createBySuccess("修改成功！");
    }

    @PostMapping("/add")
    public ServerResponse add(@RequestBody ServiceEntity serviceEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(serviceEntity, "name");

        serviceService.add(serviceEntity);

        return ServerResponse.createBySuccess("保存成功！", serviceEntity);
    }

    @GetMapping("/del")
    public ServerResponse del(@RequestParam String id) {

        serviceService.del(id);

        return ServerResponse.createBySuccess("删除成功！");
    }

    @GetMapping("/list")
    public ServerResponse list(@RequestParam int start, @RequestParam int count, String name) {

        PageModel page = serviceService.page(name, start, count);

        return ServerResponse.createBySuccess(page);
    }

    @GetMapping("/opt")
    public ServerResponse opt() {

        List<ServiceOptDto> opt = serviceService.opt();

        return ServerResponse.createBySuccess(opt);
    }
}
