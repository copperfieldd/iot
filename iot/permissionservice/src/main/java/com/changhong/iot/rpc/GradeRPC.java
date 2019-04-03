package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/24 11:32
 */
@FeignClient("zuul")
public interface GradeRPC {

    @GetMapping("/userservice/api/grade/apiByTenant")
    ServerResponse<List<String>> getApiByTenant(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/grade/menuByTenant")
    ServerResponse<List<String>> getMenuByTenant(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

}
