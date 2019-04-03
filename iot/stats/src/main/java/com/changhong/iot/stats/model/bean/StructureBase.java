package com.changhong.iot.stats.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.changhong.iot.stats.model.bean.StructureBase.DOCUMENT;

/**
 * Created by guiqijiang on 11/6/18.
 */
@Setter
@Getter
@Document(collection = DOCUMENT)
public class StructureBase extends BaseBean {

    public static final String DOCUMENT = "t_structure";

    //基本数据结构
    public static final String FIELD_STRUCTURE = "structure";
    @Field(FIELD_STRUCTURE)
    private String structure;

    //应用ID
    public static final String FIELD_APP_ID = "app_id";
    @Field(FIELD_APP_ID)
    private String appId;

    //创建人ID
    public static final String FIELD_FOUNDER_ID = "founder_id";
    @Field(FIELD_FOUNDER_ID)
    private String founderId;

    //创建人名称
    public static final String FIELD_FOUNDER_NAME = "founder_name";
    @Field(FIELD_FOUNDER_NAME)
    private String founderName;

    public static final String FIELD_REMARK = "collection_remark";
    @Field(FIELD_REMARK)
    private String remark;

    //对应表名称
    public static final String FIELD_COLLECTION_NAME = "collection_id";
    @Field(FIELD_COLLECTION_NAME)
    private String collectionName;

    public static final String FIELD_COLLECTION_ID = "collection_name";
    @Field(FIELD_COLLECTION_ID)
    private String collectionId;

}
