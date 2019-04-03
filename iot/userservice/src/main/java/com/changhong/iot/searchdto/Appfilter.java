package com.changhong.iot.searchdto;

import lombok.Data;

import java.util.Date;

@Data
public class Appfilter {

    private String name;

    private String creatorName;

    private DateSearch createTime;

    private String tenantName;
}
