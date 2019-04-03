package com.changhong.iot.config.instance.dto;

import com.changhong.iot.config.util.StringUtil;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class PobeListDto implements Serializable {

	private String id;

	private String serviceName;

	private String serviceHost;

	private Integer servicePort;

	private Long value;

	private Date probeTime;

	public String getProbeTime() {
		return StringUtil.dateToStrLong(probeTime);
	}
}
