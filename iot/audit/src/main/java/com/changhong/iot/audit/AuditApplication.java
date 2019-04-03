package com.changhong.iot.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;

/**
 * 项目启动类，直接运行main方法就行
 */
@SpringBootApplication //核心注解
@EnableFeignClients
@EnableEurekaClient
public class AuditApplication extends SpringBootServletInitializer {
    public static final Logger LOGGER = LoggerFactory.getLogger(AuditApplication.class);
    public static void main(String[] args) {
        LOGGER.info("准备启动");
        SpringApplication.run(AuditApplication.class, args);
        LOGGER.info("启动成功！");
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(AuditApplication.class);
    }
}
