package com.changhong.iot.pms.web.interceptor;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alipay.api.internal.util.StringUtils;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.pms.model.service.UserService;
import com.changhong.iot.common.utils.WebTools;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by guiqijiang on 10/26/18.
 */
@Slf4j
public class TokenInterceptor implements HandlerInterceptor {

    @Value("${web.config.tokenName}")
    String tokenName;

    @Autowired
    UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        String token = httpServletRequest.getHeader(tokenName);
        if (StringUtils.isEmpty(token)) {
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "缺少重要参数");
            log.error("获取用户失败：{}", "token不允许为空");

            return false;
        }

        try {

            String obj = userService.getUserByToken(token);
            ResultData resultData = JSON.parseObject(obj, ResultData.class);
            if (resultData.getStatus() != ErrCode.SUCCESS) {
                WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "获取用户信息时发生异常");
                log.error("获取用户失败：{}", resultData);
                return false;
            }

            JSONObject val = (JSONObject) resultData.getValue();
            JSONObject user = (JSONObject) val.get("user");
            int type = (Integer) user.get("type");

            UserBean userBean = new UserBean();
            userBean.setUserType(type);
            userBean.setLesseeId(user.getString("tenantId"));
            userBean.setAppUserId(user.getString("id"));

            httpServletRequest.setAttribute("userBean", userBean);

            return true;
        } catch (Exception e) {
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "获取用户信息时发生异常");
            log.error("获取用户失败：{}", e.getMessage());

            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
