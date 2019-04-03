package com.changhong.iot.stats.model.bean.device;

import lombok.Data;

/**
 * 租户信息
 */
@Data
public class TenantAppSum{
    //指定租户下当日新增应用数
    private Integer newAppSum;

    //租户下的所有应用
    private Integer appSum;

    //租户id
    private String tenantId;

}