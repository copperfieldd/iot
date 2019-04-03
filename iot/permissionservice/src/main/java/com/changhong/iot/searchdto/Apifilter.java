package com.changhong.iot.searchdto;

import lombok.Data;

import java.util.Date;

@Data
public class Apifilter {

    private String name;

    private Integer type;

    private String dataUrl;

    private String creatorName;

    private DateSearch createTime;

}
