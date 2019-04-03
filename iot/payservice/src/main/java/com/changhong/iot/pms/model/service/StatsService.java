package com.changhong.iot.pms.model.service;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Created by guiqijiang on 1/3/19.
 */
@FeignClient("${feignService.stats}")
public interface StatsService {

    /**
     * 上传数据
     *
     * @param data
     * @return
     */
    @RequestMapping("/api/datareport")
    String reportData(Map data);
}
