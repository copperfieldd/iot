package com.changhong.iot.audit.entity;

import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.constant.TableConstant;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = TableConstant.AUDIT_LOG)
public class TAuditLog {
    @Id
    private String id;

    @Field(FieldConstant.TENANT_ID)
    private String tenantName;

    @Field(FieldConstant.APP_NAME)
    private String appName;

    @Field(FieldConstant.USER_NAME)
    private String userName;

    @Field(FieldConstant.AUDIT_TYPE_NAME)
    private String type;

    @Field(FieldConstant.AUDIT_CONTENT)
    private String auditContent;

    @Field(FieldConstant.CLIENT_IP)
    private String clientIp;

    @Field(FieldConstant.CLIENT_TYPE)
    private String clientType;

    @Field(FieldConstant.CREATE_TIME)
    private Date createTime;

    @Field(FieldConstant.UPDATE_TIME)
    private Date updateTIme;

    @Field(FieldConstant.DELETED_FLAG)
    private boolean deletedFlag;
}
