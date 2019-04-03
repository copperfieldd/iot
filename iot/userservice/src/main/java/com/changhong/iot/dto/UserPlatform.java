package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.util.DateUtil;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = CollectionName.USER)
public class UserPlatform {

    @Id
    private String id;//id

    @Field(ConfigField.S_LOGIN_NAME)
    private String loginName;

    private Integer type;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    @Field(ConfigField.S_CREATOR_NAME)
    private String creatorName;//创建人

    @Field(ConfigField.D_CREATE_TIME)
    private Date createTime;//创建时间

    public String getCreateTime() {
        if (createTime != null) {
            return StringUtil.dateToStrLong(createTime);
        } else {
            return "";
        }
    }
}
