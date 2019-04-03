package com.changhong.iot.alarmservice.dto;

import com.changhong.iot.alarmservice.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

/**
 * 告警类型
 */
@Document(collection = "t_alarm_type")
@Data
public class TAlarmTypeDto implements Serializable {

private static final long serialVersionUID = 1L;
    //	唯一编号
    @Id
    private String id;
    //	告警名称
    @Field("alarm_name")
    private String alarmName;
    //	告警类别
    @Field("alarm_type")
    private String alarmType;
    //	告警描述
    @Field("alarm_desc")
    private String alarmDesc;

    private Date createTime;

    public String getCreateTime() {
        String time = StringUtil.getTime(createTime);
        return time;
    }
}
