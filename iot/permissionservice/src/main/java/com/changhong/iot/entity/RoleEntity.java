package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Document(collection = CollectionName.ROLE)
public class RoleEntity extends BaseEntity {

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_SORT_NUM)
    private Integer sortNum;

    @Field(ConfigField.A_ORG_ID)
    private List<String> orgIds;

    @Field(ConfigField.A_API_ID)
    private List<String> apiIds;

    @Field(ConfigField.A_MENU_ID)
    private List<String> menuIds;

    private List<String> endUsers;

    private String serviceId;

    private String appId;

}
