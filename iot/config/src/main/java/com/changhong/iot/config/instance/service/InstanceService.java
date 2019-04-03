/**
 * Project Name:eoms
 * File Name:InstanceService.java
 * Package Name:com.changhong.iot.eoms.instance.service
 * Date:2018年6月6日上午11:02:23
 *
*/

package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.base.dao.BaseMongoDao;
import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dto.ServiceInstanceDto;
import com.changhong.iot.config.instance.entity.ServiceInstances;
import com.changhong.iot.config.searchdto.Instancefilter;
import com.changhong.iot.config.searchdto.Sort;
import net.sf.json.JSONObject;

import java.util.List;
import java.util.Map;

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
public interface InstanceService<T> {

	PageModel getServiceList(int start, int count, Instancefilter instancefilter, Sort sort) throws ByteException;

	ServiceInstances find(String id);

	List<ServiceInstances> findAll();

	void saveInstance(ServiceInstances serviceInstances);

	void updateInstance(ServiceInstances serviceInstances);

	Map<String, Object> instanceDel(String serviceId);

	public void updStatus(String id, int value);

	ServiceInstances query(ServiceInstances serviceInstances);


}

