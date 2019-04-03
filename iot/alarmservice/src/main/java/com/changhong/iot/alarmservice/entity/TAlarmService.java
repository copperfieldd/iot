package com.changhong.iot.alarmservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

import static com.changhong.iot.alarmservice.entity.ModelConstants.*;

/**
 * 告警子服务
 */
@Document(collection = T_ALARM_SERVICE)
@Data
public class TAlarmService implements Serializable {

	private static final long serialVersionUID = 1L;
	//唯一编号
	@Id
	private String id;
	//	服务名称
	@Field(SERVICE_NAME)
	private String serviceName;
	//	服务描述
	@Field(DESC)
	private String serviceDesc;
	//	访问key
	@Field(ACCESS_KEY)
	private String accessKey;
	//	创建时间
	@Field(CREATE_TIME)
	private Date createTime;
	//	更新时间
	@Field(UPDATE_TIME)
	private Date updateTime;

	@Field(DELETED_FLAG)
	private boolean deletedFlag;


}
