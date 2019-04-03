package com.changhong.iot.stats.web.dto;

import com.changhong.iot.stats.model.bean.BaseBean;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Setter
@Getter
public class StructureRqtDTO extends BeanRqtDTO {

    //ID
    private String id;

    //服务的Id
    @NotNull(message = "服务ID不允许为空")
    private String serviceId;

    //服务名称
    private String serviceName;

    //文档名称
    @NotNull(message = "表标识不允许为空")
    private String collectionId;

    @NotNull(message = "表名称不允许为空")
    private String collectionName;

    private String remark;

    //创建人ID
    private String founderId;

    //创建人名称
    private String founderName;

    //结构
    @Valid
    private List<Structure> structure;

    //状态
    private BaseBean.State state;

    public void setState(int state) {
        this.state = BaseBean.State.get(state);
    }

    @Setter
    @Getter
    public static class Structure {
        //字段名称
        @NotNull(message = "字段名称不允许为空")
        private String fieldName;

        //字段描述
        @NotNull(message = "字段标识不允许为空")
        private String fieldId;

        //字段类型 {Array|Object|Number|String}
        @NotNull(message = "结构类型不允许为空")
        private String fieldType;

        //是否系统字段
        private boolean sys = false;

        //子字段
        private List<Structure> childFields;
    }
}
