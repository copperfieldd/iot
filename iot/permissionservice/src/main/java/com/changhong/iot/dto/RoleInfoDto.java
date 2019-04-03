package com.changhong.iot.dto;


import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = CollectionName.ROLE)
public class RoleInfoDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_TENANT_ID)
    private String tenantId;//租户id

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    @Field(ConfigField.A_ORG_ID)
    private List<String> orgIds;

    @Field(ConfigField.A_API_ID)
    private List<String> apiIds;

    @Field(ConfigField.A_MENU_ID)
    private List<String> menuIds;

}
