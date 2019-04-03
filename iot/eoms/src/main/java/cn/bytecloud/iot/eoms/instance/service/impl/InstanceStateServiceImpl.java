/**
 * Project Name:eoms
 * File Name:InstanceStateServiceImpl.java
 * Package Name:cn.bytecloud.iot.eoms.instance.service.impl
 * Date:2018年6月6日下午1:30:18
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.instance.dao.InstanceDao;
import cn.bytecloud.iot.eoms.instance.dao.InstanceStateDao;
import cn.bytecloud.iot.eoms.instance.dto.ServiceInstanceDto;
import cn.bytecloud.iot.eoms.instance.service.InstanceStateService;
import cn.bytecloud.iot.eoms.util.StringUtil;

/**
 * ClassName:InstanceStateServiceImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 下午1:30:18 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Service
public class InstanceStateServiceImpl implements InstanceStateService{
	
	@Autowired
	private InstanceDao instanceDao;
	
	@Autowired
	private InstanceStateDao instanceStateDao;
	
	@Override
	public Map<String, Object> updateInstanceState(ServiceInstanceDto serviceInstanceDto) throws EomsException {
		
		Map<String, Object> result = new HashMap<String, Object>();
		if(StringUtil.isEmpty(serviceInstanceDto.getId())){
			throw new EomsException("请选择服务");
		}
		instanceDao.updateMaryByProp("id", serviceInstanceDto.getId(), "serviceState", Integer.valueOf(serviceInstanceDto.getServiceState()));
		return null;
	}

}

