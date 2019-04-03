package com.changhong.iot.dto;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = CollectionName.MENU)
public class MenuOptDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_PID)
    private String pid;

    private String tag;

    @Field(ConfigField.S_NAME)
    private String name;

    private String englishName;

    @Transient
    private List<MenuOptDto> children;

}
