package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = CollectionName.API)
public class ApiEntity extends BaseEntity{

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_TYPE)
    private Integer type;

    @Field(ConfigField.S_DATA_URL)
    private String dataUrl;

    private String serviceId;

    private String appId;

}
