package com.changhong.iot.statistics.controller;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.statistics.service.ApiStatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/interface")
public class ApiStatsticsController {

    @Resource
    private ApiStatisticsService apiStatisticsService;

    @GetMapping("/statistics")
    public ServerResponse interfaceCallStatistics(@RequestParam("uri") String uri) throws ByteException {

        apiStatisticsService.interfaceCallStatistics(uri);

        return ServerResponse.createBySuccess();
    }
}
