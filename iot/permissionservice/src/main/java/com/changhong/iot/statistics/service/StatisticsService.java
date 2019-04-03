package com.changhong.iot.statistics.service;

import com.changhong.iot.common.ServerResponse;
import net.sf.json.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("zuul")
public interface StatisticsService {

    @PostMapping("/statsservice/api/datareport")
    public ServerResponse datareport(@RequestBody JSONObject data, @RequestHeader("Authorization") String token);


}
