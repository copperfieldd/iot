package com.changhong.iot.alarmservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.feign.FeignClient;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class AlarmServiceApplication extends SpringBootServletInitializer {

	public static final Logger LOGGER = LoggerFactory.getLogger(AlarmServiceApplication.class);
	public static void main(String[] args) {
		LOGGER.info("准备启动");
		SpringApplication.run(AlarmServiceApplication.class, args);
		LOGGER.info("启动成功！");
	}

	/**
	 * 打war包需要
	 * @param builder
	 * @return
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(AlarmServiceApplication.class);
	}
}
