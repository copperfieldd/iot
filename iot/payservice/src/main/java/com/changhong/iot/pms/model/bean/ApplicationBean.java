package com.changhong.iot.pms.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.changhong.iot.pms.model.bean.ApplicationBean.DOCUMENT;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description: 支付合作商
 * @Date: Created in 上午9:56 18-1-18
 */
@Setter
@Getter
@Document(collection = DOCUMENT)
public class ApplicationBean extends AbstractBase {

    public static final String DOCUMENT = "t_application";

    //合作商名称
    public static final String FILED_NAME = "name";
    @Field(FILED_NAME)
    private String name;

    //应用ID
    public static final String FILED_APP_ID = "app_id";
    @Field(FILED_APP_ID)
    private String appId;

    public static final String FILED_APP_INFO = "app_info";
    @Field(FILED_APP_INFO)
    private String appInfo;

    //安全检验码
    public static final String FILED_APP_SECRET = "app_secret";
    @Field(FILED_APP_SECRET)
    private String appSecret;

    //状态：1正常0禁用
    public static final String FILED_APP_STATUS = "app_status";
    @Field(FILED_APP_STATUS)
    private Integer appStatus;

    //负责人名称
    public static final String FILED_LEAD_NAME = "lead_name";
    @Field(FILED_LEAD_NAME)
    private String leadName;

    //联系电话
    public static final String FILED_PHONE = "phone";
    @Field(FILED_PHONE)
    private String phone;
}
