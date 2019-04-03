package com.changhong.iot.stats.web.dto;

import com.changhong.iot.stats.model.bean.ApplicationBase;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * Created by guiqijiang on 10/30/18.
 */
@Getter
@Setter
public class BeanRqtDTO {

    //开始
    private int start = 0;

    //数据大小
    private int count = 10;

    //开始时间
    private String startTime;

    //结束时间
    private String endTime;

    //随机字符串
    private String random;

    //操作人ID
    private String founderId;

    private void setFounderId(String id) {
    }

    //操作人名称
    private String founderName;

    private void setFounderName(String name) {
    }

    public void setUser(Map map) {
        this.founderId = (String) map.get("id");
        this.founderName = (String) map.get("userName");
    }
}
