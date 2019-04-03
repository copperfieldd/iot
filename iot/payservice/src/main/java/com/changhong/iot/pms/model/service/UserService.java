package com.changhong.iot.pms.model.service;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by guiqijiang on 10/26/18.
 */
@FeignClient("${feignService.user}")
public interface UserService {

    /**
     * 用token与用户服务换取用户
     *
     * @param token
     * @return
     */
    @RequestMapping("/api/user/items")
    String getUserByToken(@RequestHeader("Authorization") String token);
}
