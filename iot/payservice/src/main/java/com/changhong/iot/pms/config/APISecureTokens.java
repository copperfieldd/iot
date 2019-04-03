package com.changhong.iot.pms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午11:48 18-1-18
 */
@Component
public class APISecureTokens implements EnvironmentAware {

    @Value("${web.config.tokens}")
    private String tokens;

    public Map<String, String> getTokenMap() {
        return tokenMap;
    }

    public void setTokenMap(Map<String, String> tokenMap) {
        this.tokenMap = tokenMap;
    }

    private Map<String, String> tokenMap = new HashMap<String, String>();

    @Override
    public void setEnvironment(Environment environment) {
        String[] tks = tokens.split(",");
        for (String t : tks) {
            String k = environment.getProperty("server.api." + t);
            tokenMap.put(t, k);
        }
    }
}
