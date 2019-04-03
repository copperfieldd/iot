package com.changhong.iot.dto;


import lombok.Data;

import java.util.List;

@Data
public class MenuOptDto {

    private String id;//id

    private String pid;

    private String name;

    private String tag;

    private String apiName;

    private String dataUrl;

    private List<MenuOptDto> children;

}
