package com.changhong.iot.stats.web.dto;

import com.changhong.iot.stats.model.bean.BaseBean;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Setter
@Getter
public class ApplicationRqtDTO extends BeanRqtDTO {

    private String id;

    //应用密匙(serviceCode)
    private String secret;

    //应用名称
    @NotNull(message = "应用名称不允许为空")
    private String serviceName;

    //应用状态
    private BaseBean.State state;

    //结构名称,在创建结构是会用到
    @NotNull(message = "域不允许为空")
    private String domain;

    public void setState(int state) {
        this.state = BaseBean.State.get(state);
    }
}
