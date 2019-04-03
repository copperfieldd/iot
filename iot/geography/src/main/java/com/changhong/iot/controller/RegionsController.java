package com.changhong.iot.controller;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.entity.RegionsEntity;
import com.changhong.iot.service.RegionsService;
import com.changhong.iot.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/region")
public class RegionsController {

    @Autowired
    private RegionsService regionsService;

    @GetMapping("/item")
    public ServerResponse item(@RequestParam String id) {

        RegionsEntity regionsEntity = regionsService.find(id);

        return ServerResponse.createBySuccess(regionsEntity);
    }

    @PostMapping("/add")
    public ServerResponse add(@RequestBody RegionsEntity regionsEntity) throws ByteException {

        if (EmptyUtil.isEmpty(regionsEntity.getName())) {
            return ServerResponse.createByError(1009, "name不能为空！");
        }
        if (EmptyUtil.isEmpty(regionsEntity.getRegionCode())) {
            return ServerResponse.createByError(1009, "regionCode");
        }
        if (EmptyUtil.isEmpty(regionsEntity.getPid()) || regionsEntity.getPid().equals("0")) {
            if (EmptyUtil.isEmpty(regionsEntity.getCountryId())) {
                return ServerResponse.createByError(1009, "pid or ountryId");
            } else {
                regionsEntity.setPid("0");
            }
        }

        regionsService.add(regionsEntity);

        return ServerResponse.createBySuccess("保存成功！", regionsEntity);
    }

    @PostMapping("/upd")
    public ServerResponse update(@RequestBody RegionsEntity regionsEntity) {

        if (EmptyUtil.isEmpty(regionsEntity.getId())) {
            return ServerResponse.createByError(1009 , "id");
        }

        regionsService.update(regionsEntity);

        return ServerResponse.createBySuccessMessage("修改成功！");
    }

    @GetMapping("/del")
    public ServerResponse delete(String id, String countryId) {

        if ((EmptyUtil.isEmpty(id) || id.equals("0")) && EmptyUtil.isEmpty(countryId)) {
            return ServerResponse.createByError(1009, "id or countryId");
        }

        if (EmptyUtil.isNotEmpty(countryId)) {
            regionsService.deleteByCountryId(countryId);
        } else {
            regionsService.delete(id);
        }

        return ServerResponse.createBySuccessMessage("删除成功！");
    }

    @GetMapping("/children")
    public ServerResponse children(String id, String countryId) {

        List list = null;

        try {
            if ((EmptyUtil.isEmpty(id) || id.equals("0")) && EmptyUtil.isEmpty(countryId)) {
                return ServerResponse.createByError(1009, "id or countryId！");
            }

            if (EmptyUtil.isNotEmpty(countryId)) {
                list = regionsService.childrenByCountryId(countryId);
            } else {
                list = regionsService.children(id);
            }

        } catch (ByteException e) {
            return ServerResponse.createByError(e.id, e.value);
        }

        return ServerResponse.createBySuccess(list);
    }

    @PostMapping("/import")
    public ServerResponse importRegions(@RequestParam String countryId, @RequestParam("file")MultipartFile file) {

        try {
            regionsService.importRegions(countryId, file.getInputStream(), file.getOriginalFilename());
        } catch (IOException e) {
            return ServerResponse.createByError(1001);
        } catch (ByteException e) {
            return ServerResponse.createByError(e.id, e.value);
        }

        return ServerResponse.createBySuccess("导入成功！");
    }

}
