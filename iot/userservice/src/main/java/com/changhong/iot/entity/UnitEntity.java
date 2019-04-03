package com.changhong.iot.entity;

import com.changhong.iot.base.entity.BaseEntity;
import com.changhong.iot.config.CollectionName;
import com.changhong.iot.config.ConfigField;
import lombok.Data;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： UnitEntity
 * 包名：com.changhong.iot.entity
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/06/04 9:45
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/06/04 9:45
 * 修改备注：
 */
@Data
@Document(collection = CollectionName.UNIT)
public class UnitEntity extends BaseEntity {

    @Field(ConfigField.S_PID)
    private String pid;

    @Field(ConfigField.S_NAME)
    private String name;

    @Field(ConfigField.I_TYPE)
    private Integer type;

    @Field(ConfigField.I_SORT_NUM)
    private Integer sortNum;

    @Transient
    private String appId;

    @Transient
    private List<String> roleIds;

}
