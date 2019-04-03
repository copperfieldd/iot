/**
 * Project Name:eoms
 * File Name:InstanceStateService.java
 * Package Name:com.changhong.iot.eoms.instance.service
 * Date:2018年6月6日下午1:28:52
 *
*/

package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dto.ServiceInstanceDto;
import com.changhong.iot.config.instance.entity.ServiceStats;

import java.util.List;
import java.util.Map;

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

	void add(ServiceStats serviceStats);

	ServiceStats findOne();

	ServiceStats findByServiceId(String id);

	PageModel list(int start, int count);

	void update(ServiceStats serviceStats);

	void updAll(long cycle, int failureNumber);

	List<ServiceStats> findAll();

	void deleteByServiceId(String id);

}

