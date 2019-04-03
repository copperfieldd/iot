package com.changhong.iot.controller;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.entity.CountryEntity;
import com.changhong.iot.searchdto.Countryfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.CountryService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/country")
public class CountryController {

    @Autowired
    private CountryService countryService;

    @GetMapping("/item")
    public ServerResponse item(@RequestParam String id) {

        CountryEntity countryEntity = countryService.find(id);

        return ServerResponse.createBySuccess(countryEntity);
    }

    @PostMapping("/add")
    public ServerResponse add(@RequestBody CountryEntity countryEntity) {

        if (EmptyUtil.isEmpty(countryEntity.getName())) {
            return ServerResponse.createByError(1009, "name");
        }
        if (EmptyUtil.isEmpty(countryEntity.getCode())) {
            return ServerResponse.createByError(1009, "code");
        }
        if (EmptyUtil.isEmpty(countryEntity.getRegionIds())) {
            countryEntity.setRegionIds(new ArrayList<>());
        }
        countryService.add(countryEntity);

        return ServerResponse.createBySuccess("保存成功！", countryEntity);
    }

    @PostMapping("/upd")
    public ServerResponse update(@RequestBody CountryEntity countryEntity) {

        if (EmptyUtil.isEmpty(countryEntity.getId())) {
            return ServerResponse.createByError(1009, "id");
        }

        countryService.update(countryEntity);

        return ServerResponse.createBySuccessMessage("修改成功！");
    }

    @GetMapping("/del")
    public ServerResponse delete(@RequestParam String id) {

        try {
            countryService.delete(id);
        } catch (ByteException e) {
            return ServerResponse.createByError(e.id, e.value);
        }

        return ServerResponse.createBySuccessMessage("删除成功！");
    }

    @GetMapping("/list")
    public ServerResponse list(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        Countryfilter countryfilter = JsonUtil.string2Obj(filter, Countryfilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        PageModel<CountryEntity> page = countryService.page(start, count, countryfilter, sortEntity);

        return ServerResponse.createBySuccess(page);
    }

}
