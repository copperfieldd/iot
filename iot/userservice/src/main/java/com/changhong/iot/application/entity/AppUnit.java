package com.changhong.iot.application.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = "app_unit")
public class AppUnit extends BaseEntity {

    private String appId;

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_TYPE)
    private Integer type;

    @Field(ConfigField.I_SORT_NUM)
    private Integer sortNum;

    @Transient
    private List<String> roleIds;

}
