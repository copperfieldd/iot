package com.changhong.iot.searchdto;

import lombok.Data;

@Data
public class PlatformManagerfilter {

    private String loginName;

    private String creatorName;//创建人

    private DateSearch createTime;//创建时间
}
