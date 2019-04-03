package com.changhong.iot.config.instance.dto;

import com.changhong.iot.config.config.CustomDateSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;
import lombok.experimental.var;

import java.util.Date;

@Data
public class ServiceInstanceDto {

	private String id;
	
	private String serviceName;
	
	private String serviceHost;
	
	private Integer servicePort;

	private Integer serviceValue;

	@JsonSerialize(using = CustomDateSerializer.class)
	private Date createTime;

	@JsonSerialize(using = CustomDateSerializer.class)
	private Date updateTime;

}

