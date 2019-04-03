package com.changhong.iot.config.instance.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;

@Data
public class ServiceStats implements Serializable {

	/** id. */
	@Id
	private String id;

	private String serviceId;

	private Long cycle;

	private Integer failureNumber;

	private Integer number;

	/** d_create_time. */
	private Date createTime;

	/** d_update_time. */
	private Date updateTime;

}
