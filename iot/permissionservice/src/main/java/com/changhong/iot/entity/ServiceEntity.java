package com.changhong.iot.entity;

import com.changhong.iot.config.CollectionName;
import com.changhong.iot.util.StringUtil;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = CollectionName.SERVICE)
public class ServiceEntity {

    @Id
    private String id;//id

    private String name;

    private String englishName;

    private String remarks;//备注

    private Date createTime;//创建时间

    private String creatorName;//创建人

    private String creatorId;//创建人

    private Date updateTime;//修改时间

    private Integer deleteFlag;//是否已被删除   0：未删除、1：以删除

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

    public String getUpdateTime() {
        return StringUtil.dateToStrLong(updateTime);
    }
}
