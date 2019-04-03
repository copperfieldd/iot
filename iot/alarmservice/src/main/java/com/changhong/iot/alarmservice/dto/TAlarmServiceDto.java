package com.changhong.iot.alarmservice.dto;

import com.changhong.iot.alarmservice.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

@Data
public class TAlarmServiceDto implements Serializable {
private static final long serialVersionUID = 1L;
    //唯一编号
    @Id
    private String id;
    //	服务名称
    @Field("servcie_name")
    private String serviceName;
    //	服务描述
    @Field("service_desc")
    private String serviceDesc;

    private String accessKey;

    private Date createTime;

    public String getCreateTime() {
        if (createTime != null) {
            return StringUtil.getTime(createTime);
        }
        return null;
    }
}
