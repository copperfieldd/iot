package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.ApplicationDto;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("zuul")
public interface ApplicationRPC {

    @GetMapping("/userservice/api/app/item")
    public ServerResponse<ApplicationDto> item(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/app/all")
    public ServerResponse<List<ApplicationDto>> all(@RequestHeader("Authorization") String token);

}
