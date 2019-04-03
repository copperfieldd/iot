package com.changhong.iot.application.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "app_user")
public class AppUser extends BaseEntity {

    private String appId;

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_LOGIN_NAME)
    private String loginName;

    @Field(ConfigField.S_USER_NAME)
    private String userName;

    @Field(ConfigField.S_PASSWORD)
    private String password;

    @Field(ConfigField.S_TELEPHONE)
    private String telephone;

    @Field(ConfigField.I_SORT_NUM)
    private Integer sortNum;

    private String mail;

    private Integer sex;

    private Integer age;

    private Date birth;

    private String birthplace;

    private String address;

    private String extraInfo;

    private Integer type;

    private Boolean isSystem;

    private Long max;

    @Transient
    private List<String> roleIds;

}
