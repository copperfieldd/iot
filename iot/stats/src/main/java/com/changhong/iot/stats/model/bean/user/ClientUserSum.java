package com.changhong.iot.stats.model.bean.user;

import lombok.Data;

@Data
public class ClientUserSum {
    //租户id
    private String tenantId;

    //appid
    private String appId;

    //当日新增C端总数
    private Integer newClientSum;

    //C端用户总数
    private Integer clientSum;
}
