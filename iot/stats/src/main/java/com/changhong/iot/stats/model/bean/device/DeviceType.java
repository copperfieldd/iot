package com.changhong.iot.stats.model.bean.device;

import lombok.Data;

/**
 * 设备配置统计数据
 */
@Data
public class DeviceType{
    //当天根据设备配置新增的设备
    private Integer newDeviceSum;
    //使用该设备配置的所有设备
    private Integer deviceSum;
    //设备配置id
    private String typeId;
}