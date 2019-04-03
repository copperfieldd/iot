package com.changhong.iot.pms.web.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 10/30/18.
 */
@Getter
@Setter
public class ApplicationRqtDTO extends BeanRqtDTO {

    // 应用名称
    private String name;

    // 应用ID
    private String appId;

    // 负责人名称
    private String leadName;

    // 负责人电话
    private String phone;

    // 状态
    private Integer status;

    // 应用信息
    private String describe;

    // 密钥
    private String secret;

    // 创建开始时间
    private String startTime;

    // 创建结束时间
    private String endTime;

}
