package com.changhong.iot.audit.base.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.changhong.iot.audit.base.model.User;
import com.changhong.iot.audit.util.JsonUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;

import com.changhong.iot.audit.base.model.User;
import com.changhong.iot.audit.util.JsonUtil;
import com.changhong.iot.audit.util.RedisUtil;

@Controller
public class BaseController {

    @Autowired
    MongoTemplate mongoTemplate;

    protected Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 获取用户登录信息
     *
     * @return
     */
    protected User getLogined(HttpServletRequest httpServletRequest) {
        /*
         * SecurityContext securityContext = (SecurityContext)
         * request.getSession().getAttribute(HttpSessionSecurityContextRepository.
         * SPRING_SECURITY_CONTEXT_KEY); if (securityContext == null ||
         * securityContext.getAuthentication() == null) { return false; } else { return
         * true; }
         */
        String header = httpServletRequest.getHeader("Authorization");
        if (header != null && header.length() > 10) {
            // 截取出真正的token
            String token = header.substring(10);
            // 通过token去redis中取出userId
            String userJsonStr = (String) RedisUtil.get(token);
            User user = JsonUtil.string2Obj(userJsonStr, User.class);
            return user;
        }
        return null;
    }

    /**
     * 取得当前登录的用户信息
     * 
     * @param request
     * @return
     */
    /*
     * protected Account getUserInfo(HttpServletRequest request) { SecurityContext
     * securityContext = (SecurityContext)
     * request.getSession().getAttribute(HttpSessionSecurityContextRepository.
     * SPRING_SECURITY_CONTEXT_KEY); ByteUserDetails userDetails = (ByteUserDetails)
     * securityContext.getAuthentication().getPrincipal(); return
     * userDetails.getAccount(); }
     */

    /**
     * 读取接收到的xml消息
     * 
     * @param request
     * @return
     */
    protected String getXmlData(HttpServletRequest request) {
        StringBuffer sb = new StringBuffer();
        try {
            InputStream is = request.getInputStream();
            InputStreamReader isr = new InputStreamReader(is, "UTF-8");
            BufferedReader br = new BufferedReader(isr);
            String s = "";
            while ((s = br.readLine()) != null) {
                sb.append(s);
            }
            is.close();
            isr.close();
            br.close();
        } catch (IOException ioe) {
            logger.error("[微信]:消息读取出错。");
        }
        return sb.toString();
    }

    /**
     * 获取请求参数中所有的信息
     * 
     * @param request
     * @return
     */
    protected Map<String, String> getAllRequestParam(HttpServletRequest request) {
        Map<String, String> res = new HashMap<String, String>();
        Enumeration<?> temp = request.getParameterNames();
        if (null != temp) {
            while (temp.hasMoreElements()) {
                String en = (String) temp.nextElement();
                String value = request.getParameter(en);
                res.put(en, value);
                if (null == res.get(en) || "".equals(res.get(en))) {
                    res.remove(en);
                }
            }
        }
        return res;
    }

    /**
     * 读取接收到的JsonObject消息
     * 
     * @param request
     * @return
     */
    protected JSONObject getJsonObjectData(HttpServletRequest request) {

        JSONObject result = null;
        StringBuffer sb = new StringBuffer();
        try {
            InputStream is = request.getInputStream();
            InputStreamReader isr = new InputStreamReader(is, "UTF-8");
            BufferedReader br = new BufferedReader(isr);
            String s = "";
            while ((s = br.readLine()) != null) {
                sb.append(s);
            }
            is.close();
            isr.close();
            br.close();

            if (sb.length() > 0) {
                result = new JSONObject(sb.toString().trim());
            }
        } catch (IOException ioe) {
            logger.error("[微信]:消息读取出错。");
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 读取接收到的JsonArray消息
     * 
     * @param request
     * @return
     */
    protected JSONArray getJsonArrayData(HttpServletRequest request) {

        JSONArray result = null;
        StringBuffer sb = new StringBuffer();
        try {
            InputStream is = request.getInputStream();
            InputStreamReader isr = new InputStreamReader(is, "UTF-8");
            BufferedReader br = new BufferedReader(isr);
            String s = "";
            while ((s = br.readLine()) != null) {
                sb.append(s);
            }
            is.close();
            isr.close();
            br.close();

            if (sb.length() > 0) {
                result = new JSONArray(sb.toString());
            }
        } catch (IOException ioe) {
            logger.error("[微信]:消息读取出错。");
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return result;
    }

}
