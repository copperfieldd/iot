package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = CollectionName.USER)
public class UserDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_TENANT_ID)
    private String tenantId;//租户id

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_LOGIN_NAME)
    private String loginName;

    @Field(ConfigField.S_USER_NAME)
    private String userName;

    @Field(ConfigField.S_TELEPHONE)
    private String telephone;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    private Integer type;

    private String appId;

    @Transient
    private String token;

}
