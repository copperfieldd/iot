package com.changhong.iot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
public class PermissionserviceApplication extends SpringBootServletInitializer{

	public static final Logger LOGGER = LoggerFactory.getLogger(PermissionserviceApplication.class);

	public static void main(String[] args) {
		LOGGER.info("准备启动");
		SpringApplication.run(PermissionserviceApplication.class, args);
		LOGGER.info("启动成功！");
	}
	/**
	 * 打war包需要
	 * @param builder
	 * @return
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(PermissionserviceApplication.class);
	}
}
