package com.changhong.iot.config.instance.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Document(collection = "pobe")
@Data
public class PobeEntity implements Serializable{

    @Id
    private String id;

    private String serviceId;

    private Long value;

    private Integer type;

    private Boolean isAlarmed;

    private Date createTime;

}
