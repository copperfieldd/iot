package com.changhong.iot.audit.feign;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private Integer type;
    private String username;
    private UUID tenantId;
    private String tenantName;
    private UUID appId;
    private String appName;
    private String token;

    public static UserDto conversion(String json,String token) {
        final JSONObject jsonObject = JSONObject.parseObject(json);
        if (jsonObject.containsKey("status") && jsonObject.containsKey("value")) {
            if (jsonObject.getInteger("status") == 0) {
                JSONObject value = jsonObject.getJSONObject("value");
                JSONObject user = value.getJSONObject("user");
                JSONObject tenant = value.getJSONObject("tenant");
                JSONObject app = jsonObject.getJSONObject("application");

                UserDto userDto = new UserDto();
                userDto.setId(UUID.fromString(user.getString("id")));
                userDto.setType(user.getInteger("type"));
                userDto.setUsername(user.getString("userName"));

                if (null != tenant) {
                    final String tenantId = tenant.getString("id");
                    if ("0".equals(tenantId)) {
                        userDto.setTenantId(UUID.fromString("13814000-1dd2-11b2-8080-808080808080"));
                    } else {
                        userDto.setTenantId(UUID.fromString(tenantId));
                    }
                    if (tenant.containsKey("name")) {
                        userDto.setTenantName(tenant.getString("name"));
                    }

                } else {
                    userDto.setTenantId(UUID.fromString("13814000-1dd2-11b2-8080-808080808080"));
                }

                if (null != app) {
                    userDto.setAppId(UUID.fromString(app.getString("id")));
                    userDto.setAppName(app.getString("name"));
                }
                userDto.setToken(token);
                return userDto;

            } else {
                throw new RuntimeException("user json解析错误！！");
            }
        } else {
            throw new RuntimeException("user json解析错误！！");
        }
    }

    ;
}
