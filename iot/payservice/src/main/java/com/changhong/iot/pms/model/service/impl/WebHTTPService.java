package com.changhong.iot.pms.model.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

/**
 * Created by lpnpcs on 2017/4/7 0007.
 * description:HTTP请求的service
 */
@Service
@EnableAsync
@Slf4j
public class WebHTTPService {

    @Autowired
    protected RestTemplate restTemplate;

    @Async
    public void post(String url, HashMap<String, Object> params) {
        restTemplate.postForObject(url, params, String.class);
    }

    @Async
    public void payNotify(String url, HashMap<String, String> params) {
        for (int i = 1; i < 8; i++) {
            try {
                String result = restTemplate.postForObject(url, params, String.class);
                if ("success".equals(result)) {
                    log.info("回调完成:{}", params);
                    break;
                }
            } catch (Exception e) {
                log.error("回调商家接口时出现错误,信息:{},信息:{}", e.getMessage(), params);
            }
            try {
                Thread.sleep(i * 1000);
            } catch (InterruptedException e1) {
            }
        }
    }
}
