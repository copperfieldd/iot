package com.changhong.iot.statistics.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "api_statistics")
@Data
public class ApiStatistics {

    private String id;

    private String tenantId;

    private String appId;

    private String apiId;

    private Long number;

    private Date createTime;

    private Date updateTime;
}
