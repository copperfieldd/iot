package com.changhong.iot.config.searchdto;

import lombok.Data;

@Data
public class ConfigFilefilter {

    private String serviceName;

    private String configFile;

    private DateSearch updateTime;

}
