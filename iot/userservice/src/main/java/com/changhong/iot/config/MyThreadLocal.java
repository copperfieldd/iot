package com.changhong.iot.config;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.util.JsonUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class MyThreadLocal {

    @Resource
    private RedisTemplate redisTemplate;

    private static final ThreadLocal<Map<String, Object>> threadLocal = new ThreadLocal<>();

    public static void set(String token) {
        Map<String, Object> map = new HashMap<>();
        map.put("token", token);
        threadLocal.set(map);
    }

    public static void remove() {
        threadLocal.remove();
    }
    /**
     * 获取当前用户的Token
     * @param
     * @return
     */
    public static String getToken() {
        Map<String, Object> map = threadLocal.get();
        return map == null ? null : (String) map.get("token");
    }

    /**
     * 获取当前用户对象
     * @param
     * @return
     */
    public UserDto getUser() throws ByteException {
        Map<String, Object> map = threadLocal.get();
        UserDto user = null;
        if (map == null) {
            throw new ByteException(401, "登录过期，请重新登录！");
        } else {
            user = (UserDto) map.get(map.get("token"));
        }
        if (user == null) {
            String s = (String) redisTemplate.opsForValue().get(map.get("token"));
            user = JsonUtil.string2Obj(s, UserDto.class);
            if (user == null || user.getId() == null) {
                throw new ByteException(401, "登录过期，请重新登录！");
            }
            map.put((String) map.get("token"), user);
            threadLocal.set(map);
        }
        redisTemplate.boundValueOps(map.get("token")).expire(60*8, TimeUnit.MINUTES);
        return user;
    }

    /**
     * 获取当前用户的Id
     * @param
     * @return
     */
    public String getUserId() throws ByteException {
        return getUser().getId();
    }

    /**
     * 获取当前用户name
     * @param
     * @return
     */
    public String getUserName() throws ByteException {
        return getUser().getUserName();
    }

    /**
     * 获取当前用户loginName
     * @param
     * @return
     */
    public String getLoginName() throws ByteException {
        return getUser().getLoginName();
    }

    /**
     * 获取当前用户的tenantId
     * @param
     * @return
     */
    public String getTenantId() throws ByteException {
        return getUser().getTenantId();
    }

    /**
     * 是否是平台管理员
     * @param
     * @return
     */
    public boolean isPlatformManager() throws ByteException {
        return getUser().getType().equals(ConfigValue.PLATFORM_MANAGER);
    }

    /**
     * 是否是租户管理员
     * @param
     * @return
     */
    public boolean isTenantManager() throws ByteException {
        return getUser().getType().equals(ConfigValue.TENANT_MANAGER);
    }

    /**
     * 是否是应用管理员
     * @param
     * @return
     */
    public boolean isAppManager() throws ByteException {
        return getUser().getType().equals(ConfigValue.APPLICATION_MANAGER);
   }

   /**
    * 是否是应用相关的用户
    * @param
    * @return
    */
    public boolean isAppUser() throws ByteException {
        Integer type = getUser().getType();
        return type.equals(ConfigValue.APPLICATION_MANAGER) || type.equals(ConfigValue.APPLICATION_USER) || type.equals(ConfigValue.END_USER);
    }

    /**
     * 是否是应用中的用户
     * @param
     * @return
     */
    public boolean isApplicationUser() throws ByteException {
        Integer type = getUser().getType();
        return type.equals(ConfigValue.APPLICATION_USER);
    }

    /**
     * 是否是终端用户
     * @param
     * @return
     */
    public boolean isEndUser() throws ByteException {
        Integer type = getUser().getType();
        return type.equals(ConfigValue.END_USER);
    }

}
