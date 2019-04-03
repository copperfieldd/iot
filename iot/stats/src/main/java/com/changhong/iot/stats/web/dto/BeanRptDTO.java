package com.changhong.iot.stats.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 11/26/18.
 */
@Getter
@Setter
public class BeanRptDTO {

    //创建时间
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createTime;

    //修改时间
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String updateTime;

    //创建人ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String founderId;

    //创建人名称
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String founderName;

    public void setCreateTime(long time) {
        if (0 == time) return;
        this.createTime = DateUtil.format(time, "yyyy/MM/dd HH:mm:ss");
    }

    public void setUpdateTime(long time) {
        if (0 == time) return;
        this.updateTime = DateUtil.format(time, "yyyy/MM/dd HH:mm:ss");
    }

}
