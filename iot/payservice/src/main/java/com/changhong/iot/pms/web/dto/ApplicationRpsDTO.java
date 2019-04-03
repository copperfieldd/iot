package com.changhong.iot.pms.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 10/30/18.
 */
@Setter
@Getter
public class ApplicationRpsDTO {

    private String id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String appId;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String secret;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String leadName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String phone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String updateTime;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer status;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String describe;

    public void setCreateTime(Long time) {
        if (null == time) {
            this.createTime = "时间错误";
            return;
        }

        this.createTime = DateUtil.format(time, "yyyy/MM/dd HH:ss:mm");
    }

    public void setUpdateTime(Long time) {
        if (null == time) {
            this.createTime = "时间错误";
            return;
        }
        this.updateTime = DateUtil.format(time);
    }


    private ApplicationRpsDTO() {
    }

    public ApplicationRpsDTO(ApplicationBean bean) {
        this.setName(bean.getName());
        this.setAppId(bean.getAppId());
        this.setSecret(bean.getAppSecret());
        this.setCreateTime(bean.getCdt());
        this.setUpdateTime(bean.getUdt());
        this.setId(bean.getId());
        this.setLeadName(bean.getLeadName());
        this.setPhone(bean.getPhone());
        this.setStatus(bean.getAppStatus());
        this.setDescribe(bean.getAppInfo());
    }
}
