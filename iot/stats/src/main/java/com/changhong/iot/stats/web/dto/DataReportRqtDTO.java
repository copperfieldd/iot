package com.changhong.iot.stats.web.dto;

import com.changhong.iot.stats.model.bean.ApplicationBase;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * Created by guiqijiang on 11/12/18.
 */
@Setter
@Getter
public class DataReportRqtDTO {

    //域
    private String domain;

    //文档名称
    private String collection;

    //上报时间
    private long reportTime;

    //应用实体，在检查data时注入
    private ApplicationBase applicationBase;

    //上报的数据
    private Map data;

}
