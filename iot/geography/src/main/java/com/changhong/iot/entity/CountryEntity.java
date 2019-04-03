package com.changhong.iot.entity;

import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "t_country")
public class CountryEntity {

    @Id
    private String id;

    private String name;//国家名称

    private String code;//国家编码

    private List<String> regionIds;//只存取定义区域

    private Date createTime;

    private Date updateTime;

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

    public String getUpdateTime() {
        return StringUtil.dateToStrLong(updateTime);
    }
}
