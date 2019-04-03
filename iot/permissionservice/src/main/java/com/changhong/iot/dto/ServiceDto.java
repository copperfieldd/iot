package com.changhong.iot.dto;

import com.changhong.iot.util.StringUtil;
import lombok.Data;

import java.util.Date;

@Data
public class ServiceDto {

    private String id;//id

    private String name;

    private String englishName;

    private String remarks;//备注

    private Date createTime;//创建时间

    private String creatorName;//创建人

    private Date updateTime;//修改时间

    public String getCreateTime() {
        return StringUtil.dateToStrLong(createTime);
    }

    public String getUpdateTime() {
        return StringUtil.dateToStrLong(updateTime);
    }
}
