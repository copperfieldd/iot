package com.changhong.iot.common.utils;

import com.changhong.iot.common.response.ResultData;
import com.google.gson.Gson;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午2:07 18-4-24
 */
public class WebTools {

    private static final String WECHAT_COOKIE_NAME = "openId";

    /**
     * 设置微信OpenId到cookie
     *
     * @param openId
     * @param response
     */
    public static void setWechatOpenId(String openId, HttpServletResponse response) {
        Cookie cookie = new Cookie(WECHAT_COOKIE_NAME, openId);
        cookie.setMaxAge(2678400);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    /**
     * 获取微信OpenId
     *
     * @param request
     * @return
     */
    public static String getWechatOpenId(HttpServletRequest request) {
        Cookie c = getCookieByName(WECHAT_COOKIE_NAME, request);
        if (null != c) {
            return c.getValue();
        }
        return null;
    }

    /**
     * 根据cookie名称获取cookie值
     *
     * @param name
     * @param request
     * @return
     */
    public static Cookie getCookieByName(String name, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (null == cookies) {
            return null;
        }
        for (Cookie c : cookies) {
            if (c.getName().equals(name)) {
                return c;
            }
        }
        return null;
    }

    /**
     * 响应客户端错误信息
     *
     * @param httpServletResponse
     * @param errorCode           错误代码
     * @param msg                 错误信息
     * @throws Exception
     */
    public static void writeResult(HttpServletResponse httpServletResponse, int errorCode, String msg) throws Exception {
        ResultData resultData = new ResultData();
        resultData.setStatus(errorCode);
//        resultData.setMessage(msg);
        Gson gson = new Gson();
        httpServletResponse.setHeader("Content-Type", "application/json; charset=UTF-8");
        httpServletResponse.setCharacterEncoding("UTF-8");
        PrintWriter printWriter = httpServletResponse.getWriter();
        printWriter.write(gson.toJson(resultData));
        printWriter.flush();
        printWriter.close();
    }
}
