package com.changhong.iot.audit.entity;


import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.constant.TableConstant;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = TableConstant.AUDIT_TYPE)
public class TAuditType {
    @Id
    private String id;

    @Field(FieldConstant.NAME)
    private String name;

    @Field(FieldConstant.TYPE)
    private String type;

    @Field(FieldConstant.DESC)
    private String desc;

    @Field(FieldConstant.CREATE_TIME)
    private Date createTime;

    @Field(FieldConstant.UPDATE_TIME)
    private Date updateTIme;

    @Field(FieldConstant.DELETED_FLAG)
    private boolean deletedFlag;
}
