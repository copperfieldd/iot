/**
 * Project Name:eoms
 * File Name:ConfigFileDto.java
 * Package Name:com.changhong.iot.eoms.config.dto
 * Date:2018年5月31日上午11:18:04
 *
*/

package com.changhong.iot.config.configfile.dto;

import com.changhong.iot.config.config.CustomDateSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Data;

import java.util.Date;

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
@Data
public class ConfigFileDto {

	private String id;

	private String serviceName;

	private String configFile;

	@JsonSerialize(using = CustomDateSerializer.class)
	private Date createTime;

	@JsonSerialize(using = CustomDateSerializer.class)
	private Date updateTime;
}

