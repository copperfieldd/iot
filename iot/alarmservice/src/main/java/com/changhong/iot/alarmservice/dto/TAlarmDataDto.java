package com.changhong.iot.alarmservice.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.changhong.iot.alarmservice.util.StringUtil;

import java.io.PipedReader;
import java.io.Serializable;
import java.util.Date;

/**
 * 告警数据
 */
@Data
public class TAlarmDataDto implements Serializable {

    private static final long serialVersionUID = 1L;
    //唯一编号
    @Id
    private String id;

    //子服务名称
    private String serviceName;

    //告警名称
    private String alarmName;

    //告警类别
    private String alarmType;

    //告警数据
    private String alarmData;

    //创建时间
    private Date createTime;

    public String getCreateTime() {
        String time = StringUtil.getTime(createTime);
        return time;
    }
}
