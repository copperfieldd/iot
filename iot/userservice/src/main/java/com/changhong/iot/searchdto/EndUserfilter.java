package com.changhong.iot.searchdto;

import lombok.Data;

@Data
public class EndUserfilter {

    private String userName;

    private String telephone;

    private String appName;

    private String tenantName;

    private String creatorName;//创建人

    private DateSearch createTime;//创建时间

}
