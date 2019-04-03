package com.changhong.iot.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.config.server.EnableConfigServer;

@EnableDiscoveryClient
@SpringBootApplication
@EnableConfigServer//开启文件服务
public class ConfigApplication extends SpringBootServletInitializer {

	public static final Logger LOGGER = LoggerFactory.getLogger(ConfigApplication.class);
	public static void main(String[] args) {
		LOGGER.info("准备启动");
		SpringApplication.run(ConfigApplication.class, args);
		LOGGER.info("启动成功！");
	}

	/**
	 * 打war包需要
	 * @param builder
	 * @return
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(ConfigApplication.class);
	}
}
