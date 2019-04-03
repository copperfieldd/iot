package com.changhong.iot.stats.web.dto;

import com.alibaba.fastjson.JSON;
import com.changhong.iot.stats.model.bean.StructureBase;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Setter
@Getter
public class StructureRptDTO extends BeanRptDTO {

    //ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String id;

    //应用ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String domain;

    //创建人名称
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String founderName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String serviceName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String serviceId;

    //对应表名称
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String collectionId;

    //备注
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String collectionName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String remark;
    //状态
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer state;


    //基本数据结构
    private List<StructureRqtDTO.Structure> structure;

    public void setStructure(String structure) {
        this.structure = JSON.parseArray(structure, StructureRqtDTO.Structure.class);
    }

    public StructureRptDTO() {
    }

    public StructureRptDTO(StructureBase base) {
        this.setId(base.getId());
        this.setCollectionId(base.getCollectionId());
        this.setCollectionName(base.getCollectionName());
        this.setStructure(base.getStructure());
        this.setState(base.getState());
        this.setCreateTime(base.getCdt());
        this.setUpdateTime(base.getUdt());
        this.setServiceId(base.getId());
        this.setRemark(base.getRemark());
        super.setFounderId(base.getFounderId());
        super.setFounderName(base.getFounderName());
    }
}
