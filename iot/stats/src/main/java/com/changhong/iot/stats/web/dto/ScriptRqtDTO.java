package com.changhong.iot.stats.web.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Setter
@Getter
public class ScriptRqtDTO extends BeanRqtDTO {

    //ID
    private String id;

    //服务ID
    @NotNull(message = "服务名称不允许为空")
    private String serviceNmae;

    @NotNull(message = "服务id不允许为空")
    private String serviceId;

    //脚本名称
    @NotNull(message = "脚本名称不允许为空")
    private String name;

    //脚本
    @NotNull(message = "脚本不允许为空")
    private String script;

    //标签
    @NotNull(message = "标签不允许为空")
    private String tag;

    //备注
    private String remark;

    //状态
    private int state;

}
