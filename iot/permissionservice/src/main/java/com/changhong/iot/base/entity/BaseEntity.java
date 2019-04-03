package com.changhong.iot.base.entity;

import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.CustomDateSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

@Data
public class BaseEntity implements Serializable {

    @Id
    protected String id;//id

    @Field(ConfigField.S_TENANT_ID)
    protected String tenantId;//租户id

    @Field(ConfigField.B_VALID)
    private Boolean valid;//是否有效

    @Field(ConfigField.S_REMARKS)
    protected String remarks;//备注

    @Field(ConfigField.D_CREATE_TIME)
    @JsonSerialize(using = CustomDateSerializer.class)
    protected Date createTime;//创建时间

    @Field(ConfigField.D_UPDATE_TIME)
    @JsonSerialize(using = CustomDateSerializer.class)
    protected Date updateTime;//修改时间

    @Field(ConfigField.S_CREATOR_NAME)
    protected String creatorName;//创建人

    @Field(ConfigField.S_CREATOR_ID)
    protected String creatorId;//创建人

    @Field(ConfigField.I_DELETE_FLAG)
    protected Integer deleteFlag;//是否已被删除   0：未删除、1：以删除

}
