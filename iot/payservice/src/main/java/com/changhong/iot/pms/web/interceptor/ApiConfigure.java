package com.changhong.iot.pms.web.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import static com.changhong.iot.pms.web.controller.APIPathConfConstant.*;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午11:42 18-1-18
 */
@Configuration
public class ApiConfigure extends WebMvcConfigurationSupport {
    @Autowired
    SignCheckInterceptor signCheckInterceptor;

    @Autowired
    WechatInterceptor wechatInterceptor;

    @Bean
    TokenInterceptor tokenInterceptor() {
        return new TokenInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //顺序不能乱
        //1
        registry.addInterceptor(tokenInterceptor())
                .addPathPatterns("/pay/**"
                        , "/application/**");

        //2
        registry.addInterceptor(signCheckInterceptor)
                .addPathPatterns("/pay/**")
                .excludePathPatterns("/pay/order/**");

        //3
        registry.addInterceptor(wechatInterceptor)
                .addPathPatterns(ROUTER_INDEX_WECHAT_ORDER);
        super.addInterceptors(registry);
    }
}

