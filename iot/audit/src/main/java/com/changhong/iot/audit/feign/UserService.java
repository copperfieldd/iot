package com.changhong.iot.audit.feign;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient("zuul")
@RequestMapping("userservice")
public interface UserService {

    /**
     * 根据token查询用户详情
     * @param token
     * @return
     */
    @GetMapping("/api/user/items")
    String userItem(@RequestHeader("Authorization") String token);


    @GetMapping("/api/user/item")
    String userItem(@RequestHeader("Authorization") String token, @RequestParam("id") String id);

    /**
     * 根据id查询租户信息
     * @param id
     * @return
     */
    @GetMapping("/api/tenant/item")
    String tenantItem(@RequestHeader("Authorization") String token, @RequestParam("id") String id);
}
