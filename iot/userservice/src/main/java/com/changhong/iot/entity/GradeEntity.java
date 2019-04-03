package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = CollectionName.GRADE)
public class GradeEntity extends BaseEntity {

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.O_RESOURCES)
    private Object resources;

    @Field(ConfigField.A_API_ID)
    private List<String> apiIds;

    @Field(ConfigField.A_MENU_ID)
    private List<String> menuIds;

}
