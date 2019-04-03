/**
 * Project Name:eoms
 * File Name:InstanceServiceImpl.java
 * Package Name:cn.bytecloud.iot.eoms.instance.service.impl
 * Date:2018年6月6日上午11:04:29
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.CounterService;
import org.springframework.boot.actuate.metrics.GaugeService;
import org.springframework.stereotype.Service;

import cn.bytecloud.iot.eoms.base.dto.PageModel;
import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.instance.dao.InstanceDao;
import cn.bytecloud.iot.eoms.instance.dto.ServiceInstanceDto;
import cn.bytecloud.iot.eoms.instance.entity.ServiceInstances;
import cn.bytecloud.iot.eoms.instance.service.InstanceService;
import cn.bytecloud.iot.eoms.util.DateUtil;
import cn.bytecloud.iot.eoms.util.StringUtil;

/**
 * ClassName:InstanceServiceImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 上午11:04:29 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Service
public class InstanceServiceImpl implements InstanceService {

	@Autowired
	private InstanceDao instanceDao;
	
	@Autowired
    CounterService counterService;
 
    @Autowired
    GaugeService gaugeService;
	
	@Override
	public Map<String, Object> getServiceList(String start, String count) throws EomsException {
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		if(StringUtil.isEmpty(start) || StringUtil.isEmpty(count)){
			throw new EomsException("页码错误");
		}
		
		PageModel page = PageModel.indexToPage(Integer.valueOf(start), Integer.valueOf(count));
		
		PageModel pageFiles = instanceDao.pageByProp(page.getPageNo(), Integer.valueOf(count), "isDelete", 0);
		
		List<ServiceInstances> serviceInstances = pageFiles.getList();
		List<ServiceInstanceDto> serviceInstanceDtos = new ArrayList<ServiceInstanceDto>();
		
		for(ServiceInstances serviceInstance : serviceInstances){
			ServiceInstanceDto serviceInstanceDto = new ServiceInstanceDto();
			serviceInstanceDto.setId(serviceInstance.getId());
			serviceInstanceDto.setServiceName(serviceInstance.getServiceName());
			serviceInstanceDto.setServiceHost(serviceInstance.getServiceHost());
			serviceInstanceDto.setServicePort(serviceInstance.getServicePort().toString());
			serviceInstanceDto.setCreateTime(DateUtil.dateToStrLong(serviceInstance.getCreateTime()));
			serviceInstanceDto.setUpdateTime(DateUtil.dateToStrLong(serviceInstance.getUpdateTime()));
			serviceInstanceDto.setServiceState(serviceInstance.getServiceState().toString());
			serviceInstanceDtos.add(serviceInstanceDto);
		}
		
		//TODO 记
		result.put("data", serviceInstanceDtos);
		return null;
	}

	@Override
	public Map<String, Object> saveInstance(ServiceInstanceDto serviceInstanceDto) throws EomsException {
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		if(StringUtil.isEmpty(serviceInstanceDto.getServiceHost()) || StringUtil.isEmpty(serviceInstanceDto.getServicePort())){
			throw new EomsException("请输入地址");
		}
	    ServiceInstances serviceInstance = new ServiceInstances();
	    serviceInstance.setId(serviceInstanceDto.getId());
	    serviceInstance.setServiceName(serviceInstanceDto.getServiceName());
	    serviceInstance.setServiceHost(serviceInstanceDto.getServiceHost());
	    serviceInstance.setServicePort(Integer.valueOf(serviceInstanceDto.getServicePort()));
	    
	    if(StringUtil.isEmpty(serviceInstance.getId())){
	    	saveService(serviceInstance);
	    }else{
	    	int count = instanceDao.countByCondition(new String[] {"id", "isDelete"}, new Object[] {serviceInstance.getId(), 0});
	    	if(count == 0){
	    		saveService(serviceInstance);
	    	}else{
	    		updateService(serviceInstance);
	    	}
	    }
	    
		return result;
	}

	private void saveService(ServiceInstances serviceInstance) {
		serviceInstance.setCreateTime(new Date());
		serviceInstance.setUpdateTime(new Date());
		serviceInstance.setIsDelete(0);
		instanceDao.save(serviceInstance);
	}
	
	private void updateService(ServiceInstances serviceInstance) {
		instanceDao.updateMaryByProp("id", serviceInstance.getId(),
				new String[] {"serviceName, serviceHost, servicePort, updateTime"},
				new Object[] {serviceInstance.getServiceName(), serviceInstance.getServiceHost(), serviceInstance.getServicePort(), new Date()});
	}

	@Override
	public Map<String, Object> instanceDel(String serviceId) throws EomsException {
		
		//TODO 删除部分还需要做一些逻辑
		Map<String, Object> result = new HashMap<String, Object>();
		if(StringUtil.isEmpty(serviceId)){
			throw new EomsException("请选择服务");
		}
		instanceDao.updateMaryByProp("id", serviceId, "isDelete", 1);
		return result;
	}

}

