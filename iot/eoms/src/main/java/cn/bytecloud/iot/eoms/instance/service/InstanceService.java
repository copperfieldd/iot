/**
 * Project Name:eoms
 * File Name:InstanceService.java
 * Package Name:cn.bytecloud.iot.eoms.instance.service
 * Date:2018年6月6日上午11:02:23
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.service;

import java.util.Map;

import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.instance.dto.ServiceInstanceDto;

/**
 * ClassName:InstanceService <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 上午11:02:23 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
public interface InstanceService {

	Map<String, Object> getServiceList(String start, String count) throws EomsException;

	Map<String, Object> saveInstance(ServiceInstanceDto serviceInstanceDto) throws EomsException;

	Map<String, Object> instanceDel(String serviceId) throws EomsException;

}

