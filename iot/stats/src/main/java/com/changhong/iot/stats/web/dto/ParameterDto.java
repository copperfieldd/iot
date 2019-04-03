package com.changhong.iot.stats.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.stats.util.StringUtil;
import lombok.Data;

import java.util.Objects;

@Data
public class ParameterDto {
    private Long starttime;

    private Long endtime;

    private String group;

    private String tenantid;

    private String appid;

    private String typeid;

    private String interfaceid;

    public void setStarttime(String startTime) {
        this.starttime  = StringUtil.getDate(startTime) /1000;
    }

    public void setEndtime(String endTime) {
        this.endtime  = StringUtil.getDate(endTime) /1000;
    }
}
