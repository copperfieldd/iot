package com.changhong.iot.pms.web.interceptor;

import com.changhong.iot.common.utils.WebTools;
import com.changhong.iot.pms.web.dto.ApiRequestDTO;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午4:04 18-4-4
 */
@Component
public class WechatInterceptor implements HandlerInterceptor {

    @Autowired
    RestTemplate restTemplate;

    @Value("${web.config.pay.WX.appID}")
    private String appId;

    @Value("${web.config.pay.WX.appsecret}")
    private String appsecret;

    @Value("${server.domain}")
    private String domain;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        if (WebTools.getWechatOpenId(httpServletRequest) != null) {
            return true;
        }
        StringBuilder builder = new StringBuilder();
        ApiRequestDTO params = new ApiRequestDTO();
        params.add("appId", appId);
        String code = httpServletRequest.getParameter("code");
        if (null != code) {
            params.add("code", code);
            params.add("grant_type", "authorization_code");
            params.add("secret", appsecret);
            builder.append("https://api.weixin.qq.com/sns/oauth2/access_token").append(params.toParamsString());
            String result = restTemplate.getForObject(builder.toString(), String.class);
            JSONObject jsonObject = JSONObject.parseObject(result);
            if (jsonObject.get("errcode") != null) {
                return false;
            }
            WebTools.setWechatOpenId(jsonObject.get("openid").toString(), httpServletResponse);
            return true;
        }
        params.add("scope", "snsapi_base");
        params.add("appsecret", appsecret);
        Map<String, String[]> var = httpServletRequest.getParameterMap();
        Map<String, String> var1 = new HashMap<>();
        var.forEach((k, v) -> var1.put(k, v != null && v.length > 0 ? v[0] : null));
        params.add("redirect_uri", domain + "/" + httpServletRequest.getRequestURI() + new ApiRequestDTO(var1).toParamsString());
        params.add("response_type", "code");
        params.add("state", "STATE");
        builder.append("https://open.weixin.qq.com/connect/oauth2/authorize").append(params.toParamsString()).append("#wechat_redirect");
        httpServletResponse.sendRedirect(builder.toString());
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }


}
