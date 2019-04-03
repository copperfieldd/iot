package com.changhong.iot.alarmservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

import static com.changhong.iot.alarmservice.entity.ModelConstants.*;

/**
 * 通知策略
 */
@Document(collection = ModelConstants.T_NOTIFY_TYPE)
@Data
public class TNotifyType implements Serializable {

    private static final long serialVersionUID = 1L;
    //	唯一编号
    @Id
    private String id;
    //	通知名称
    @Field(NOTIFY_NAME)
    private String notifyName;
//    //	通知类别
//    @Field("notify_type")
//    private String notifyType;
    //	通知地址
    @Field(NOTIFY_URL)
    private String notifyUrl;

    //	创建时间
    @Field(CREATE_TIME)
    private Date createTime;
    //	更新时间
    @Field(UPDATE_TIME)
    private Date updateTime;
    //	接口描述
    @Field(NOTIFY_URL_DESC)
    private String notifyUrlDesc;
    //	子服务名称
    @Field(ACCESS_KEY)
    private String accessKey;

    @Field(INTERFACE_NAME)
    private String interfaceName;

    @Field(DELETED_FLAG)
    private boolean deletedFlag;

}
