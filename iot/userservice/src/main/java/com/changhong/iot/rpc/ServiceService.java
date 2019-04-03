package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.ServiceOptDto;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient("zuul")
public interface ServiceService {

    @GetMapping("/permissionservice/api/service/opt")
    ServerResponse<List<ServiceOptDto>> opt(@RequestHeader("Authorization") String token);

}
