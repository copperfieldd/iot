package com.changhong.iot.stats.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by guiqijiang on 1/3/19.
 */
@Setter
@Getter
public class GetStatsRqtDTO {

    @NotNull(message = "开始时间不允许为空")
    private Long starttime;

    @NotNull(message = "结束时间不允许为空")
    private Long endtime;

    @NotNull(message = "分组方式不允许为空")
    private String group;

    private HashMap hashMap;

    public HashMap getHasMap() {
        return (HashMap) hashMap.clone();
    }

    public void putAll(Map hashMap) {
        hashMap.forEach((key, val) -> {
            Object o = this.hashMap.get(key);
            if (null == o){
                this.hashMap.put(key, val);
            }
        });
    }

    public GetStatsRqtDTO() {
        hashMap = new HashMap();
    }

    public void setStarttime(String startTime) {
        this.starttime = DateUtil.strToDateLong(startTime, "yyyy/MM/dd");
        hashMap.put("starttime", this.starttime);
    }

    public void setEndtime(String endTime) {
        long et = DateUtil.strToDateLong(endTime, "yyyy/MM/dd");
        //时间加一天，就等于如：2018/1/2 00:00:00 正好可以获取昨天的数据,也就是当前结束时间的数据
        this.endtime = et + (60 * 60 * 24);
        hashMap.put("endtime", this.endtime);
    }

    public void setGroup(String group) {
        this.group = group;
        hashMap.put("group", group);
    }
}
