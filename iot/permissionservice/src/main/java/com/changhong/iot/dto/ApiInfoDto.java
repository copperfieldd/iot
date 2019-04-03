package com.changhong.iot.dto;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = CollectionName.API)
public class ApiInfoDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_TYPE)
    private Integer type;

    @Field(ConfigField.S_DATA_URL)
    private String dataUrl;

    @Field(ConfigField.D_CREATE_TIME)
    public Date createTime;

    @Field(ConfigField.S_REMARKS)
    public String remarks;//备注

    private String serviceId;

    private String appId;

    public String complexName;

    public String creatorName;

    protected Date updateTime;//修改时间

    public String getUpdateTime() {
        return StringUtil.dateToStrLong(updateTime);
    }

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }
}
