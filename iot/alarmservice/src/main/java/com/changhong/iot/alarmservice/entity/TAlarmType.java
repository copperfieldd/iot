package com.changhong.iot.alarmservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

import static com.changhong.iot.alarmservice.entity.ModelConstants.*;

/**
 * 告警类型
 */
@Data
@Document(collection = T_ALARM_TYPE)
public class TAlarmType implements Serializable {

    private static final long serialVersionUID = 1L;
    //	唯一编号
    @Id
    private String id;
    //	告警名称
    @Field(ALARM_NAME)
    private String alarmName;
    //	告警类别
    @Field(ModelConstants.ALARM_TYPE)
    private String alarmType;
    //	告警描述
    @Field(DESC)
    private String alarmDesc;
    //	创建时间
    @Field(CREATE_TIME)
    private Date createTime;
    //	更新时间
    @Field(UPDATE_TIME)
    private Date updateTime;

    @Field(DELETED_FLAG)
    private boolean deletedFlag;


}
