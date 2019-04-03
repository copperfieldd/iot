package com.changhong.iot.pms.web.interceptor;

import com.changhong.iot.common.utils.MD5Util;
import com.changhong.iot.pms.config.APISecureTokens;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.common.utils.WebTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午11:42 18-1-18
 */

public class RequestInterceptor implements HandlerInterceptor {
    @Autowired
    private APISecureTokens apiSecureTokens;

    private String getRequestParams(HttpServletRequest httpServletRequest) {
        StringBuffer buffer = new StringBuffer();
        Map<String, String[]> parameterMap = new HashMap<String, String[]>(httpServletRequest.getParameterMap());
        if (parameterMap.size() > 0) {
            parameterMap.remove("opaque");
            List<Map.Entry<String, String[]>> params = new ArrayList<Map.Entry<String, String[]>>(parameterMap.entrySet());
            Collections.sort(params, Comparator.comparing(Map.Entry::getKey));
            for (int i = 0; i < params.size(); i++) {
                Map.Entry<String, String[]> entry = params.get(i);
                for (int j = 0; j < entry.getValue().length; j++) {
                    buffer.append((entry.getKey().toString() + "=" + entry.getValue()[j] + "&"));
                }
            }
            if (buffer.length() != 0) {
                buffer.deleteCharAt(buffer.length() - 1);
            }
        }
        return buffer.toString();
    }

    private String calcOpaque(HttpServletRequest httpServletRequest, String clientToken) {
        String params = getRequestParams(httpServletRequest);
        String uri = httpServletRequest.getRequestURI();
        if (apiSecureTokens == null) {
            ServletContext servletContext = httpServletRequest.getServletContext();
            WebApplicationContext webApplicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
            apiSecureTokens = (APISecureTokens) webApplicationContext.getBean("APISecureTokens");
        }
        String secureToken = apiSecureTokens.getTokenMap().get(clientToken);
        if (secureToken == null) {
            return "";
        }
        String opaqueUri = uri + "?" + params + "&key=" + secureToken;
        return MD5Util.md5(opaqueUri);
    }


    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        String timeStamp = httpServletRequest.getParameter("timeStamp");
        String rand = httpServletRequest.getParameter("rand");
        String token = httpServletRequest.getParameter("token");
        String clientOpaque = httpServletRequest.getParameter("opaque");
        if (timeStamp == null || rand == null || token == null || clientOpaque == null) {
            WebTools.writeResult(httpServletResponse, ErrCode.MISS_PARAM, "却少必要的参数 timestamp rand token opaque");
            return false;
        }
        String serverOpaque = calcOpaque(httpServletRequest, token);
        if ("".equals(serverOpaque) || !serverOpaque.equals(clientOpaque)) {
            WebTools.writeResult(httpServletResponse, ErrCode.OPAQUE_ERROR, "opaque计算错误");
            return false;
        }
        return true;
    }


    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
    }
}
