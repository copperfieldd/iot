package com.changhong.iot.pms.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.HashMap;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午7:57 18-1-30
 */
@Getter
@Setter
public abstract class AbstractBase {

    @Id
    @Field("_id")
    private String id;

    //创建时间
    public static final String FILED_CREATE_TIME = "create_time";
    @Field(FILED_CREATE_TIME)
    private Long cdt;


    //创建时间
    public static final String FILED_UPDATE_TIME = "update_time";
    @Field(FILED_UPDATE_TIME)
    private Long udt;

}
