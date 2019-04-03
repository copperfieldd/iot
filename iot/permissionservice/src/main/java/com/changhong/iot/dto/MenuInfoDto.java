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
public class MenuInfoDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_NAME)
    private String name;

    private String englishName;

    private String tag;

    @Field(ConfigField.S_API_ID)
    private String apiId;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    @Transient
    private String url;

    @Transient
    private String apiName;

    @Transient
    private String pname;

    @Transient
    private List<MenuInfoDto> children;

}
