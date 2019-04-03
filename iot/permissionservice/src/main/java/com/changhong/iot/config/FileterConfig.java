package com.changhong.iot.config;

import com.changhong.iot.interceptor.VerificationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootConfiguration
public class FileterConfig extends WebMvcConfigurerAdapter{

	@Autowired
	private VerificationFilter verificationFilter;
	@Value("${authenticity.excludePath:}")
	private String[] excludePaths;

	public void addInterceptors(InterceptorRegistry registry) {
		
//		registry.addInterceptor(verificationFilter).addPathPatterns("/**").excludePathPatterns("/api/login");
		registry.addInterceptor(verificationFilter).addPathPatterns("/**").excludePathPatterns(excludePaths);;
	}

}

