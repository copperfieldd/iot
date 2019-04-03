package com.changhong.iot.stats.model.bean;

import com.changhong.iot.stats.config.ModelConstants;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class BaseEntity {

    @Field(ModelConstants.YEAR)
    private Integer year;

    @Field(ModelConstants.MONTH)
    private Integer month;

    @Field(ModelConstants.DAY)
    private Integer day;

    @Field(ModelConstants.CREATE_TIME)
    private long createTime;

    @Indexed
    @Field(ModelConstants.REPORT_TIME)
    private long reportTime;
}
