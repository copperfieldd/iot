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
@Document(collection = CollectionName.GRADE)
public class GradeDto {

    @Id
    private String id;//id

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.O_RESOURCES)
    private Object resources;

    @Field(ConfigField.A_API_ID)
    private List<String> apiIds;

    @Field(ConfigField.A_MENU_ID)
    private List<String> menuIds;

    @Field(ConfigField.S_REMARKS)
    private String remarks;//备注

    protected String creatorName;

    @Field(ConfigField.D_CREATE_TIME)
    protected Date createTime;//创建时间

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

}
