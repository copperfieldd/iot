package com.changhong.iot.stats.model.service;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by guiqijiang on 11/26/18.
 */
@FeignClient("userservice")
public interface UserService {

    default Map getUser(HttpServletRequest request) throws ServiceException {
        String token = request.getHeader("Authorization");
        String user = this.getUserByToken(token);
        JSONObject jsonObject = JSONObject.parseObject(user);
        JSONObject value = jsonObject.getJSONObject("value");
        if (null == value) throw new ServiceException(ErrorCode.NOT_LOGIN, "没有登陆");
        return value.getObject("user", Map.class);
    }

    @RequestMapping("/api/user/items")
    String getUserByToken(@RequestHeader("Authorization") String token);

}
