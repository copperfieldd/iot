package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("zuul")
public interface Checkpermiss {

    @PostMapping("/permissionservice/checkPermiss")
    ServerResponse checkPermiss(@RequestBody String content, @RequestHeader("Authorization") String token);
}
