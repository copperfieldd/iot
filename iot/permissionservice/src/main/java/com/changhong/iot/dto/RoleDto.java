package com.changhong.iot.dto;


import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = CollectionName.ROLE)
public class RoleDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    private Date createTime;//创建时间

    private String creatorName;//创建人

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }
}
