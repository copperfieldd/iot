package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("userservice")
public interface PermissionIdentity {

    @PostMapping("/identity")
    public ServerResponse identity(@RequestHeader("Authorization") String token);

}
