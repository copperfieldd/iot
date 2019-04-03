package com.changhong.iot.statistics;

import com.changhong.iot.common.ServerResponse;
import net.sf.json.JSONObject;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient("zuul")
public interface StatisticsService {

    @PostMapping("/statsservice/api/datareport")
    public ServerResponse datareport(@RequestBody JSONObject data, @RequestHeader("Authorization") String token);


}
