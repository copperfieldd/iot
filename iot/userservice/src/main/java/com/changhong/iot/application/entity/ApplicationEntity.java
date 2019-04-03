package com.changhong.iot.application.entity;

import com.changhong.iot.util.DateUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/22 17:05
 */
@Data
@Document(collection = "application")
public class ApplicationEntity implements Serializable{

    @Id
    private String id;

    private String name;

    private String tenantId;

    private String remarks;//备注

    private String creatorName;//创建人

    private String creatorId;//创建人

    private Date createTime;

    private Date updateTime;

    private Integer deleteFlag;//是否已被删除   0：未删除、1：以删除

    @Transient
    private String roleId;

    @Transient
    private String password;

    public String getCreateTime() {
        return DateUtil.dateToStrLong(createTime);
    }

    public String getUpdateTime() {
        return DateUtil.dateToStrLong(updateTime);
    }
}
