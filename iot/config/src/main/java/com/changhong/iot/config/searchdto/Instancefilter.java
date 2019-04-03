package com.changhong.iot.config.searchdto;

import lombok.Data;

import java.util.Date;

@Data
public class Instancefilter {

    private String serviceName;

    private String serviceHost;

    private Integer servicePort;

    private Integer serviceValue;

    private DateSearch createTime;
}
