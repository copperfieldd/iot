package com.changhong.iot.stats.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Setter
@Getter
public class ApplicationRptDTO extends BeanRptDTO {

    //ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    //应用ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String domain;

    //应用密匙
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String secret;

    //应用状态
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer state;

    //应用名称
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String serviceName;

    private ApplicationRptDTO() {

    }

    public ApplicationRptDTO(ApplicationBase base) {
        this.setId(base.getId());
        this.setDomain(base.getDomain());
        this.setSecret(base.getAppSecret());
        this.setState(base.getState());
        this.setServiceName(base.getAppName());
        this.setCreateTime(base.getCdt());
        this.setUpdateTime(base.getUdt());
        super.setFounderId(base.getFounderId());
        super.setFounderName(base.getFounderName());
    }
}
