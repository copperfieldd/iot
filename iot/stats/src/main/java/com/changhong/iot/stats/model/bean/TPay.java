package com.changhong.iot.stats.model.bean;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.List;

import static com.changhong.iot.stats.config.ModelConstants.*;
@Document(collection = T_PAY)
@Data
public class TPay extends BaseEntity implements Serializable {
    @Id
    private String id;

    @Field(TENANT_SUM)
    private Integer tenantSum;

    @Field(NEW_TENANT_SUM)
    private Integer newTenantSum;
//
//    @Field(TENANT_APP_SUM)
//    private List<TenantAppSum> tenantAppSum;
}
