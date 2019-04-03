package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.CustomDateSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： UserEntity
 * 包名：com.changhong.iot.entity
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/06/04 9:45
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/06/04 9:45
 * 修改备注：
 */
@Data
@Document(collection = CollectionName.USER)
public class UserEntity extends BaseEntity {

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

    @JsonSerialize(using = CustomDateSerializer.class)
    private Date birth;

    private String birthplace;

    private String address;

    private String extraInfo;

    private Integer type;

    private Boolean isSystem;

    private Long max;

    @Transient
    private String appId;

    @Transient
    private List<String> roleIds;

}
