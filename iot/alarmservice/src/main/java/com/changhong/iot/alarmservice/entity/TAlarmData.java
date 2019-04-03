package com.changhong.iot.alarmservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.PipedReader;
import java.io.Serializable;
import java.util.Date;

import static com.changhong.iot.alarmservice.entity.ModelConstants.*;

/**
 * 告警数据
 */
@Document(collection = T_ALARM_DATA)
@Data
public class TAlarmData implements Serializable {

    private static final long serialVersionUID = 1L;
    //唯一编号
    @Id
    private String id;

//    //访问key
//    @Field(ModelConstants.ACCESS_KEY)
//    private String accessKey;

    //子服务名称
    @Field(SERVICE_NAME)
    private String serviceName;

    //告警名称
    @Field(ALARM_NAME)
    private String alarmName;

    //告警类别
    @Field(ALARM_TYPE)
    private String alarmType;

    @Field(ALARM_STATUS)
    private Integer alarmStatus;

    //告警数据
    @Field(ALARM_DATA)
    private String alarmData;

    //创建时间
    @Field(CREATE_TIME)
    private Date createTime;

    @Field(DELETED_FLAG)
    private boolean deletedFlag;

}
