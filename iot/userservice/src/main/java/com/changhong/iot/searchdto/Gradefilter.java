package com.changhong.iot.searchdto;

import lombok.Data;

@Data
public class Gradefilter {

    private String name;

    private String creatorName;//创建人

    private DateSearch createTime;//创建时间
}
