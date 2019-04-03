package com.changhong.iot.stats.model.bean.permission;


import com.changhong.iot.stats.model.bean.BaseEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import static com.changhong.iot.stats.config.ModelConstants.*;

@Data
@Document(collection = T_PERMISSION)
public class TPermission extends BaseEntity implements Serializable {
    @Id
    private String id;

    @Field(INTERFACE_SUM)
    private Integer interfaceSum;

    @Field(USER_SUM)
    private List<Map> userSum ;
}
