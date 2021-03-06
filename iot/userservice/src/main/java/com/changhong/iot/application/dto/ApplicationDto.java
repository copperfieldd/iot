package com.changhong.iot.application.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/22 17:05
 */
@Data
@Document(collection = "application")
public class ApplicationDto implements Serializable{

    @Id
    private String id;

    private String name;

    private String tenantId;

    private String remarks;//备注

}
