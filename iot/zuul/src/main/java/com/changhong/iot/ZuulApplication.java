package com.changhong.iot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy//开启网关
@EnableFeignClients
public class ZuulApplication extends SpringBootServletInitializer {

	public static final Logger LOGGER = LoggerFactory.getLogger(ZuulApplication.class);
	public static void main(String[] args) {
		LOGGER.info("准备启动");
		SpringApplication.run(ZuulApplication.class, args);
		LOGGER.info("启动成功！");
	}

	/**
	 * 打war包需要
	 * @param builder
	 * @return
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(ZuulApplication.class);
	}
}
