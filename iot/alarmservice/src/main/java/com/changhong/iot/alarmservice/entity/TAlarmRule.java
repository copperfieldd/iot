package com.changhong.iot.alarmservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.changhong.iot.alarmservice.entity.ModelConstants.*;

/**
 * 告警规则
 */
@Document(collection = T_ALARM_RULE)
@Data
public class TAlarmRule implements Serializable {

    @Id
    private String id;

    @Field(RULE_NAME)
    private String ruleName;

    @Field(ModelConstants.ACCESS_KEY)
    private String accessKey;
    //	告警类别，*为所有类型。
    @Field(ALARM_TYPE_ID)
    private String alarmTypeId;
    //	告警匹配内容，*为所有内容。
    @Field(ALARM_CONTENT)
    private String alarmContent;
    //	内容匹配规则，0为完全匹配，1为模糊匹配。
    @Field(CONTENT_MATH_TYPE)
    private Integer contentMatchType;
    //	通知策略id
    @Field(NOTITY_ID)
    private String notifyId;

    @Field(EMAILS)
    private List<String> emails = new ArrayList<>();

    @Field(MESSAGES)
    private List<String> messages = new ArrayList<>();

    //  创建时间
    @Field(CREATE_TIME)
    private Date createTime;
    //  更新时间
    @Field(ModelConstants.UPDATE_TIME)
    private Date updateTime;


    @Field(ModelConstants.DELETED_FLAG)
    private boolean deletedFlag;

}
