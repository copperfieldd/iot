package com.changhong.iot.controller;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.util.BaiduUtils;
import com.changhong.iot.util.EmptyUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AddressController {

    @GetMapping("/address/encode")
    public ServerResponse encode(@RequestParam String address){

        if (EmptyUtil.isEmpty(address)) {
            return ServerResponse.createBySuccessMessage("address不能为空！");
        }
        Map<String, Double> location = null;

        try {
            location = BaiduUtils.getLocation(address);
        } catch (ByteException e) {
            return ServerResponse.createByError(e.id, e.value);
        }

        return ServerResponse.createBySuccess(location);
    }

    @GetMapping("/address/decode")
    public ServerResponse decode(@RequestParam double lng, @RequestParam double lat){

        String address = BaiduUtils.getAddress(lng, lat);

        return ServerResponse.createBySuccess(address);
    }

    @GetMapping("ip/decode")
    public ServerResponse ipDecode(@RequestParam String ip){

        if (EmptyUtil.isEmpty(ip)) {
            return ServerResponse.createBySuccessMessage("ip不能为空！");
        }
        Map<String, Object> map = null;

        try {
            map = BaiduUtils.ipDecode(ip);
        } catch (ByteException e) {
            return ServerResponse.createByError(e.id, e.value);
        }
        return ServerResponse.createBySuccess(map);
    }

}
