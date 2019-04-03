package com.changhong.iot.common.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by liangchen on 16/12/4.
 */
public class CookieOperate {
    public static final int LOGIN_TYPE_PHONE = 1;
    public static final int LOGIN_TYPE_USERNAME = 2;
    public static final int LOGIN_TYPE_WECHAT = 3;

    private static final String COOKIE_HASH_SALT = "643876B6-2F38-4BE0-9FA4-9804C5D07327";
    public static final String COOKIE_NAME = "hqqs";
    private HttpServletResponse httpServletResponse;
    private int userId = -1;
    private int loginType = LOGIN_TYPE_PHONE;
    private int deviceType;
    private static final int COOKIE_EXPIRE = 3600 * 24 * 365;

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public int getLoginType() {
        return loginType;
    }

    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }

    private String cookieStr;

    public CookieOperate(){
    }

    public CookieOperate(HttpServletResponse httpServletResponse){
        this.httpServletResponse = httpServletResponse;
    }

    public static CookieOperate createCookieOperation(String cookie){
        String cookieValue = getCookeValue(cookie);
        if (cookieValue == null){
            return null;
        }
        CookieOperate cookieOperate = new CookieOperate();
        cookieOperate.setCookieStr(cookieValue);
        return cookieOperate;
    }

    public static String getCookeValue(String cookie){
        if (cookie == null || "".equals(cookie)){
            return null;
        }
        String cookieTemp;
        try {
            cookieTemp = EncodeUtil.base64Decode(cookie);
        }catch (Exception e){
            return null;
        }
        String[] cookieValue = cookieTemp.split("\\|");
        if (cookieValue.length != 2){
            return null;
        }
        String value = cookieValue[0];
        String signClient = cookieValue[1];
        String signServer = MD5Util.md5(String.format("%s&%s", value, COOKIE_HASH_SALT));
        if (!signClient.equals(signServer)){
            return null;
        }
        return value;
    }

    public void writeCookie(){
        String value = String.format("userid:%d&loginType:%d&deviceType:%d", userId, loginType, deviceType);
        String sign = MD5Util.md5(String.format("%s&%s", value, COOKIE_HASH_SALT));
        String cookieValue = EncodeUtil.base64Encode(String.format("%s|%s", value, sign));
//        String cookieValue = MD5Util.base64Encode(String.format("%s|%s", "", sign));
        cookieValue = cookieValue.replaceAll("\n", "").replaceAll("\r", "");
        Cookie cookie = new Cookie(COOKIE_NAME, cookieValue);
        cookie.setPath("/");
        cookie.setMaxAge(COOKIE_EXPIRE);
        this.httpServletResponse.addCookie(cookie);
    }

    public void deleteCookie(){
        Cookie cookie = new Cookie(COOKIE_NAME, "0");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        this.httpServletResponse.addCookie(cookie);
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getCookieStr() {
        return cookieStr;
    }

    public void setCookieStr(String cookie) {
        String[] cookieValues = cookie.split("&");
        for (String kv:cookieValues){
            String[] kvs = kv.split(":");
            if ("userid".equals(kvs[0])){
                this.userId = Integer.parseInt(kvs[1]);
            }else if ("loginType".equals(kvs[0])){
                this.loginType = Integer.parseInt(kvs[1]);
            }else if ("deviceType".equals(kvs[0])){
                this.deviceType = Integer.parseInt(kvs[1]);
            }
            else{

            }
        }
    }
    public static void writeCookie(HttpServletResponse httpServletResponse,
                                   int userId,
                                   int loginType,
                                   int deviceType) {
        CookieOperate cookieOperate = new CookieOperate(httpServletResponse);
        cookieOperate.setUserId(userId);
        cookieOperate.setLoginType(loginType);
        cookieOperate.setDeviceType(deviceType);
        cookieOperate.writeCookie();
    }
}
