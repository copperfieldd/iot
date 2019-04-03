package com.changhong.iot.pms.web.interceptor;

import com.changhong.iot.common.utils.HttpRequestUtil;
import com.changhong.iot.common.utils.SignTools;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.service.ApplicationService;
import com.changhong.iot.common.utils.WebTools;
import com.changhong.iot.pms.web.dto.ApplicationRpsDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午3:32 18-1-25
 */
@Component
@Slf4j
public class SignCheckInterceptor implements HandlerInterceptor {

    @Autowired
    ApplicationService applicationService;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest,
                             HttpServletResponse httpServletResponse,
                             Object o) throws Exception {

        /*
        HashMap<String, String> hashMap;
        String method = httpServletRequest.getMethod();
        if ("GET".equalsIgnoreCase(method)) {
            hashMap = HttpRequestUtil.getParam(httpServletRequest);
        } else {
            hashMap = HttpRequestUtil.getParam(httpServletRequest);
        }*/
        HashMap<String, String> hashMap = HttpRequestUtil.getParam(httpServletRequest);

        String appId = hashMap.get("appId");
        String sign = hashMap.get("sign");
        if (StringUtils.isEmpty(appId) || StringUtils.isEmpty(sign)) {
            log.debug("缺少重要参数");
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "缺少重要参数,请检查参数appId 或 sign");
            return false;
        }

        ApplicationRpsDTO bean = applicationService.getApplicationByAppId(appId);
        if (null == bean || bean.getStatus() != 0) {
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "appId不存在，或者被禁用");
            return false;
        }

        boolean check = SignTools.checkSign(sign, bean.getSecret(), hashMap);
        if (!check) {
            log.error("签名错误:{}    APPID:{}     param:{}        编码:{}", sign, appId, hashMap, httpServletRequest.getCharacterEncoding());
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "签名错误");
            return false;
        }

        httpServletRequest.setAttribute("param", hashMap);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
