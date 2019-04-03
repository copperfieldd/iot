package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = CollectionName.TENANT)
public class TenantDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_TENANT_ID)
    private String tenantId;//租户id

    @Field(ConfigField.S_GRADE_ID)
    private String gradeId;

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.S_TAG)
    private String tag;

    @Field(ConfigField.D_START_TIME)
    private Date startTime;

    @Field(ConfigField.B_VALID)
    private Boolean valid;//是否有效

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    @Field(ConfigField.D_CREATE_TIME)
    private Date createTime;//创建时间

    @Transient
    private String loginName;

    @Transient
    private String userId;

    @Transient
    private Integer type;

    @Transient
    private String gradeName;

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

    public String getStartTime() {
        return StringUtil.dateToStrLong(startTime);
    }

}
