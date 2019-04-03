package com.changhong.iot.alarmservice.dto;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

/**
 * 告警规则dto
 */
public class TAlarmRuleDto implements Serializable {

private static final long serialVersionUID = 1L;

    private String id;

    private String ruleName;

    private String serviceName;

    private String alarmType;

    private String alarmContent;

    private String notifyName;

    private String updateTime;

    private Integer contentMatchType;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(String alarmType) {
        this.alarmType = alarmType;
    }

    public String getAlarmContent() {
        return alarmContent;
    }

    public void setAlarmContent(String alarmContent) {
        this.alarmContent = alarmContent;
    }

    public String getNotifyName() {
        return notifyName;
    }

    public void setNotifyName(String notifyName) {
        this.notifyName = notifyName;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getContentMatchType() {
        return contentMatchType;
    }

    public void setContentMatchType(Integer contentMatchType) {
        this.contentMatchType = contentMatchType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TAlarmRuleDto)) return false;

        TAlarmRuleDto that = (TAlarmRuleDto) o;

        if (getId() != null ? !getId().equals(that.getId()) : that.getId() != null) return false;
        if (getRuleName() != null ? !getRuleName().equals(that.getRuleName()) : that.getRuleName() != null)
            return false;
        if (getServiceName() != null ? !getServiceName().equals(that.getServiceName()) : that.getServiceName() != null)
            return false;
        if (getAlarmType() != null ? !getAlarmType().equals(that.getAlarmType()) : that.getAlarmType() != null)
            return false;
        if (getAlarmContent() != null ? !getAlarmContent().equals(that.getAlarmContent()) : that.getAlarmContent() != null)
            return false;
        if (getNotifyName() != null ? !getNotifyName().equals(that.getNotifyName()) : that.getNotifyName() != null)
            return false;
        if (getUpdateTime() != null ? !getUpdateTime().equals(that.getUpdateTime()) : that.getUpdateTime() != null)
            return false;
        return getContentMatchType() != null ? getContentMatchType().equals(that.getContentMatchType()) : that.getContentMatchType() == null;
    }

    @Override
    public int hashCode() {
        int result = getId() != null ? getId().hashCode() : 0;
        result = 31 * result + (getRuleName() != null ? getRuleName().hashCode() : 0);
        result = 31 * result + (getServiceName() != null ? getServiceName().hashCode() : 0);
        result = 31 * result + (getAlarmType() != null ? getAlarmType().hashCode() : 0);
        result = 31 * result + (getAlarmContent() != null ? getAlarmContent().hashCode() : 0);
        result = 31 * result + (getNotifyName() != null ? getNotifyName().hashCode() : 0);
        result = 31 * result + (getUpdateTime() != null ? getUpdateTime().hashCode() : 0);
        result = 31 * result + (getContentMatchType() != null ? getContentMatchType().hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "TAlarmRuleDto{" +
                "id='" + id + '\'' +
                ", ruleName='" + ruleName + '\'' +
                ", serviceName='" + serviceName + '\'' +
                ", alarmType='" + alarmType + '\'' +
                ", alarmContent='" + alarmContent + '\'' +
                ", notifyName='" + notifyName + '\'' +
                ", updateTime=" + updateTime +
                ", contentMatchType=" + contentMatchType +
                '}';
    }
}
