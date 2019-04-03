package com.changhong.iot.stats.model.bean.device;

import com.changhong.iot.stats.config.ModelConstants;
import com.changhong.iot.stats.model.bean.BaseEntity;
import lombok.Data;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.List;

@Data
@Document(collection = ModelConstants.T_DEVICE)
public class TDevice extends BaseEntity implements Serializable{
    @Id
    private String id;

    //设备配置信息
    @Field(ModelConstants.DEVICE_TYPE)
    private List<DeviceType> deviceType;

    //设备配置总数
    @Field(ModelConstants.DEVICE_TYPE_SUM)
    private Integer deviceTypeSum;

    //总租户数
    @Field(ModelConstants.TENANT_SUM)
    private Integer tenantSum;

    //当日新增租户数
    @Field(ModelConstants.NEW_TENANT_SUM)
    private Integer newTenantSum;

    //租户统计信息
    @Field(ModelConstants.TENANT_APP_SUM)
    private List<TenantAppSum> tenantAppSum;

    //当日新增配置数
    @Field(ModelConstants.NEW_DEVICE_TYPE_SUM)
    private Integer newDeviceTypeSum;

    //应用统计信息
    @Field(ModelConstants.APP_DEVICE)
    private List<AppDevice> appDevice;

}
