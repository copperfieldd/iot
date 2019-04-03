package com.changhong.iot.stats.model.bean.device;


import lombok.Data;

/**
 * 应用信息
 */
@Data
public class AppDevice{
    //指定应用下当日新增设备数
    private Integer newDeviceSum;

    //应用下的设备总数
    private Integer deviceSum;

    //应用id
    private String appId;

    //租户id
    private String tenantId;
}