package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.Objects;

@Data
@Document(collection = CollectionName.API)
public class ApiOptDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_NAME)
    private String name;

    private String dataUrl;
}
