package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 创建人：@author wangkn
 * 创建时间：2018/08/27 15::58
 */
@FeignClient("permissionservice")
public interface PermissionAuthenticity {

    @PostMapping("/authenticity")
    public ServerResponse authenticity(@RequestParam("path") String path, @RequestHeader("Authorization") String token);

    @GetMapping("/api/interface/statistics")
    public ServerResponse interfaceCallStatistics(@RequestParam("uri") String uri, @RequestHeader("Authorization") String token);

}
