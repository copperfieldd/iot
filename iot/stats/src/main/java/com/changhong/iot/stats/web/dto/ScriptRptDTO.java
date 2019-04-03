package com.changhong.iot.stats.web.dto;

import com.changhong.iot.stats.model.bean.ScriptBase;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Setter
@Getter
public class ScriptRptDTO extends BeanRptDTO {

    private String id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String domain;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String serviceName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String serviceId;


    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;

    //脚本
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String script;

    //备注
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String remark;

    //状态
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer state;

    //标签
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String tag;

    public ScriptRptDTO() {
    }

    public ScriptRptDTO(ScriptBase base) {
        this.setId(base.getId());
        this.setName(base.getName());
        this.setScript(base.getScript());
        super.setCreateTime(base.getCdt());
        super.setUpdateTime(base.getUdt());
        this.setState(base.getState());
        this.setRemark(base.getRemark());
        this.setServiceId(base.getAppId());
        // this.setDomain(base.getAppId());
        this.setTag(base.getTag());
    }
}
