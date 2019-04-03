package com.changhong.iot.stats.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.changhong.iot.stats.model.bean.ScriptBase.DOCUMENT;

/**
 * Created by guiqijiang on 11/6/18.
 */
@Setter
@Getter
@Document(collection = DOCUMENT)
public class ScriptBase extends BaseBean {

    public static final String DOCUMENT = "t_script";

    //脚本
    public static final String FILED_SCRIPT = "script";
    @Field(FILED_SCRIPT)
    public String script;

    //应用ID
    public static final String FILED_APP_ID = "app_id";
    @Field(FILED_APP_ID)
    private String appId;

    //备注
    public static final String FILED_REMARK = "remark";
    @Field(FILED_REMARK)
    private String remark;

    //脚本名称
    public static final String FILED_SCRIPT_NAME = "script_name";
    @Field(FILED_SCRIPT_NAME)
    private String name;

    //脚本标签
    public static final String FILED_SCRIPT_TAG = "script_tag";
    @Field(FILED_SCRIPT_TAG)
    private String tag;

}
