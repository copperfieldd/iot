package com.changhong.iot.stats.model.bean.user;

import com.changhong.iot.stats.config.ModelConstants;
import com.changhong.iot.stats.model.bean.BaseEntity;
import com.changhong.iot.stats.model.bean.device.TenantAppSum;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.List;

import static com.changhong.iot.stats.config.ModelConstants.*;

@Document(collection = ModelConstants.T_USER)
@Data
public class TUser extends BaseEntity implements Serializable {
    @Id
    private String id;

    //新增租户
    @Field(NEW_TENANT_SUM)
    private Integer newTenantSum;

    //租户总数
    @Field(TENANT_SUM)
    private Integer tenantSum;

    //租户统计信息
    @Field(ModelConstants.TENANT_APP_SUM)
    private List<TenantAppSum> tenantAppSum;

    @Field(CLIENT_USER_SUM)
    private List<ClientUserSum> clientUserSum;
}
