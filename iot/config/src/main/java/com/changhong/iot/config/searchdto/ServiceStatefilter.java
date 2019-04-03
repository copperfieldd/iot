package com.changhong.iot.config.searchdto;

import lombok.Data;

@Data
public class ServiceStatefilter {

    private String serviceName;

    private String serviceHost;

    private Integer servicePort;

    private Long value;

    private DateSearch probeTime;
}
