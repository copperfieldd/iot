package com.changhong.iot.config.instance.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;

@Data
public class ServiceInstances implements Serializable {

	/** id. */
	@Id
	private String id;

	/** s_service_name. */
	private String serviceName;

	/** s_service_host. */
	private String serviceHost;

	/** s_service_port. */
	private Integer servicePort;

	private Integer serviceValue;

	/** d_create_time. */
	private Date createTime;

	/** d_update_time. */
	private Date updateTime;

}
