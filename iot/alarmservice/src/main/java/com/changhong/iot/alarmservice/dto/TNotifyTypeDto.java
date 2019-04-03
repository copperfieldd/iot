package com.changhong.iot.alarmservice.dto;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;

/**
 * 通知策略dto
 */
@Document(collection = "t_notify_type")
public class TNotifyTypeDto implements Serializable {

private static final long serialVersionUID = 1L;
    //	唯一编号
    @Id
    private String id;
    //	通知名称
    @Field("notify_name")
    private String notifyName;
    //	通知类别
    @Field("notify_type")
    private String notifyType;
    //	通知地址
    @Field("notify_url")
    private String notifyUrl;
    //	接口描述
    @Field("notify_url_desc")
    private String notifyUrlDesc;
    //	子服务名称
    @Field("service_name")
    private String serviceName;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNotifyName() {
        return notifyName;
    }

    public void setNotifyName(String notifyName) {
        this.notifyName = notifyName;
    }

    public String getNotifyType() {
        return notifyType;
    }

    public void setNotifyType(String notifyType) {
        this.notifyType = notifyType;
    }

    public String getNotifyUrl() {
        return notifyUrl;
    }

    public void setNotifyUrl(String notifyUrl) {
        this.notifyUrl = notifyUrl;
    }

    public String getNotifyUrlDesc() {
        return notifyUrlDesc;
    }

    public void setNotifyUrlDesc(String notifyUrlDesc) {
        this.notifyUrlDesc = notifyUrlDesc;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TNotifyTypeDto)) return false;

        TNotifyTypeDto that = (TNotifyTypeDto) o;

        if (getId() != null ? !getId().equals(that.getId()) : that.getId() != null) return false;
        if (getNotifyName() != null ? !getNotifyName().equals(that.getNotifyName()) : that.getNotifyName() != null)
            return false;
        if (getNotifyType() != null ? !getNotifyType().equals(that.getNotifyType()) : that.getNotifyType() != null)
            return false;
        if (getNotifyUrl() != null ? !getNotifyUrl().equals(that.getNotifyUrl()) : that.getNotifyUrl() != null)
            return false;
        if (getNotifyUrlDesc() != null ? !getNotifyUrlDesc().equals(that.getNotifyUrlDesc()) : that.getNotifyUrlDesc() != null)
            return false;
        return getServiceName() != null ? getServiceName().equals(that.getServiceName()) : that.getServiceName() == null;
    }

    @Override
    public int hashCode() {
        int result = getId() != null ? getId().hashCode() : 0;
        result = 31 * result + (getNotifyName() != null ? getNotifyName().hashCode() : 0);
        result = 31 * result + (getNotifyType() != null ? getNotifyType().hashCode() : 0);
        result = 31 * result + (getNotifyUrl() != null ? getNotifyUrl().hashCode() : 0);
        result = 31 * result + (getNotifyUrlDesc() != null ? getNotifyUrlDesc().hashCode() : 0);
        result = 31 * result + (getServiceName() != null ? getServiceName().hashCode() : 0);
        return result;
    }
}
