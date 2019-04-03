/**
 * Project Name:eoms
 * File Name:ConfigFileDto.java
 * Package Name:cn.bytecloud.iot.eoms.config.dto
 * Date:2018年5月31日上午11:18:04
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.config.dto;
/**
 * ClassName:ConfigFileDto <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年5月31日 上午11:18:04 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
public class ConfigFileDto {

	private String id;
	
	private String serviceName;
	
	private String configFile;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getConfigFile() {
		return configFile;
	}

	public void setConfigFile(String configFile) {
		this.configFile = configFile;
	}
	
}

