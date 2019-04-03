package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = CollectionName.UNIT)
public class UnitDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_TENANT_ID)
    protected String tenantId;//租户id

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_TYPE)
    private Integer type;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注
}
