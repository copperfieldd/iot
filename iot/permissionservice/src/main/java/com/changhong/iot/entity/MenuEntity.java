package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = CollectionName.MENU)
public class MenuEntity extends BaseEntity {

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_NAME)
    private String name;

    private String englishName;

    private String tag;

    @Field(ConfigField.I_SORT_NUM)
    private Integer sortNum;

    @Field(ConfigField.S_API_ID)
    private String apiId;

    private String appId;

}
