/**
 * Project Name:eoms
 * File Name:InstanceStateService.java
 * Package Name:cn.bytecloud.iot.eoms.instance.service
 * Date:2018年6月6日下午1:28:52
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.service;

import java.util.Map;

import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.instance.dto.ServiceInstanceDto;

/**
 * ClassName:InstanceStateService <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 下午1:28:52 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
public interface InstanceStateService {

	Map<String, Object> updateInstanceState(ServiceInstanceDto serviceInstanceDto) throws EomsException;

}

