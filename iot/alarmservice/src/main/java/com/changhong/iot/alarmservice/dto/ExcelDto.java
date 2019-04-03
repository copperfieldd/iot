package com.changhong.iot.alarmservice.dto;

import org.springframework.data.mongodb.core.mapping.Field;

import com.changhong.iot.alarmservice.util.StringUtil;

import java.io.Serializable;
import java.util.Date;

public class ExcelDto implements Serializable {

private static final long serialVersionUID = 1L;
    //子服务名称
    @Field("service_name")
    private String serviceName;

    //告警名称
    @Field("alarm_name")
    private String alarmName;

    //告警类别
    @Field("alarm_type")
    private String alarmType;

    //告警数据
    @Field("alarm_data")
    private String alarmData;

    //创建时间
    @Field("create_time")
    private Date createTime;

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAlarmName() {
        return alarmName;
    }

    public void setAlarmName(String alarmName) {
        this.alarmName = alarmName;
    }

    public String getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(String alarmType) {
        this.alarmType = alarmType;
    }

    public String getAlarmData() {
        return alarmData;
    }

    public void setAlarmData(String alarmData) {
        this.alarmData = alarmData;
    }

    public String getCreateTime() {
        String time = StringUtil.getTime(createTime);
        return time;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
