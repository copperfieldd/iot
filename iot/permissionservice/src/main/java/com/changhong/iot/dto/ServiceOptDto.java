package com.changhong.iot.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class ServiceOptDto {

    @Id
    private String id;//id

    private String name;

    private String englishName;

}
