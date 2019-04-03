package com.changhong.iot.entity;

import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "t_regions")
public class RegionsEntity {

    @Id
    private String id;

    private String pid;//上一级行政区域id 第一级行政区域的pid为0

    private String name;

    private String regionCode;//区域编码 创建新政区域时填入

    private String countryId;

    private Date createTime;

    private Date updateTime;

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

    public String getUpdateTime() {
        return StringUtil.dateToStrLong(updateTime);
    }
}
