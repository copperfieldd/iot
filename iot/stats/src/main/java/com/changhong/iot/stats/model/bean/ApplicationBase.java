package com.changhong.iot.stats.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.changhong.iot.stats.model.bean.ApplicationBase.DOCUMENT;

/**
 * Created by guiqijiang on 11/6/18.
 */
@Setter
@Getter
@Document(collection = DOCUMENT)
public class ApplicationBase extends BaseBean {

    public static final String DOCUMENT = "t_application";

    //应用名称
    public static final String FIELD_APP_NAME = "app_name";
    @Field(FIELD_APP_NAME)
    private String appName;

    //应用标示
    public static final String FIELD_APP_DOMAIN = "app_domain";
    @Field(FIELD_APP_DOMAIN)
    private String domain;

    //应用密匙
    public static final String FIELD_APP_SECRET = "app_secret";
    @Field(FIELD_APP_SECRET)
    private String appSecret;

    //创建人ID
    public static final String FIELD_FOUNDER_ID = "founder_id";
    @Field(FIELD_FOUNDER_ID)
    private String founderId;

    //创建人名称
    public static final String FIELD_FOUNDER_NAME = "founder_name";
    @Field(FIELD_FOUNDER_NAME)
    private String founderName;

}
