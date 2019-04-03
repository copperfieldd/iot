package com.changhong.iot.dto;

import com.changhong.iot.config.ConfigField;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
public class EndUserDto {

    private String id;

    private String loginName;

    private String userName;

    private String telephone;

    private String mail;

    private Integer sex;

    private Integer age;

    private Date birth;

    private String birthplace;

    private String address;

    private String extraInfo;

    private Integer type;

    private Boolean isSystem;

    private String appId;

    private String appName;

    private String tenantId;

    private String tenantName;

    private Date createTime;

    private String creatorName;

    private String creatorId;//创建人

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }
}
