package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.base.dao.BaseMongoDao;
import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dao.InstanceDao;
import com.changhong.iot.config.instance.dao.PobeDao;
import com.changhong.iot.config.instance.dto.ServiceInstanceDto;
import com.changhong.iot.config.instance.entity.*;
import com.changhong.iot.config.instance.service.DiskStatsService;
import com.changhong.iot.config.instance.service.InstanceService;
import com.changhong.iot.config.instance.service.InstanceStateService;
import com.changhong.iot.config.instance.service.MemoryStatsService;
import com.changhong.iot.config.searchdto.Instancefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.EntityUtil;
import com.changhong.iot.config.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InstanceServiceImpl implements InstanceService {

	@Autowired
	private InstanceDao instanceDao;

	@Autowired
	private InstanceStateService instanceStateService;

	@Autowired
	private DiskStatsService diskStatsService;

	@Autowired
	private MemoryStatsService memoryStatsService;

	@Autowired
	private PobeDao pobeDao;



	@Override
	public PageModel getServiceList(int start, int count, Instancefilter instancefilter, Sort sort) throws ByteException {

		if (sort == null) {
			sort = new Sort();
		}

		if (sort.getName() == null) {
			sort.setName("createTime");
			sort.setOrder("desc");
		}

		PageModel pageFiles = instanceDao.pageFilterAndPropsAndIn(start, count, null, null, null, null,
				instancefilter, null, sort);

		List<ServiceInstances> serviceInstances = pageFiles.getList();
		try {
			pageFiles.setList(EntityUtil.entityListToDtoList(serviceInstances, ServiceInstanceDto.class));
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		}

		return pageFiles;
	}

    @Override
    public ServiceInstances find(String id) {
        return (ServiceInstances) instanceDao.find(id);
    }

	@Override
	public List<ServiceInstances> findAll() {
		return instanceDao.findAll();
	}

	@Override
	public void saveInstance(ServiceInstances serviceInstance) {

		serviceInstance.setId(UUID.randomUUID().toString());
		serviceInstance.setServiceValue(0);
		serviceInstance.setCreateTime(new Date());
		serviceInstance.setUpdateTime(new Date());
		instanceDao.save(serviceInstance);

		ServiceStats entity = new ServiceStats();
		entity.setServiceId(serviceInstance.getId());
		entity.setCycle(300l);
		entity.setFailureNumber(10);
		entity.setNumber(0);
		entity.setId(UUID.randomUUID().toString());
		instanceStateService.add(entity);

		DiskStats diskStats = new DiskStats();
		diskStats.setServiceId(serviceInstance.getId());
		diskStats.setCycle(300l);
		diskStats.setThreshold(524288000l);
		diskStats.setId(UUID.randomUUID().toString());
		diskStatsService.add(diskStats);

		MemoryStats memoryStats = new MemoryStats();
		memoryStats.setServiceId(serviceInstance.getId());
		memoryStats.setCycle(300l);
		memoryStats.setThreshold(524288000l);
		memoryStats.setId(UUID.randomUUID().toString());
		memoryStatsService.add(memoryStats);

		PobeEntity pobeEntity = new PobeEntity();
		pobeEntity.setServiceId(serviceInstance.getId());
		pobeEntity.setValue(0l);
		pobeEntity.setIsAlarmed(false);
		pobeEntity.setCreateTime(new Date());

		pobeEntity.setId(UUID.randomUUID().toString());
		pobeEntity.setType(1);
		pobeDao.save(pobeEntity);
		pobeEntity.setId(UUID.randomUUID().toString());
		pobeEntity.setType(2);
		pobeDao.save(pobeEntity);
		pobeEntity.setId(UUID.randomUUID().toString());
		pobeEntity.setType(3);
		pobeDao.save(pobeEntity);
	}

	@Override
	public void updateInstance(ServiceInstances serviceInstance) {

		serviceInstance.setCreateTime(null);
		serviceInstance.setServiceValue(null);
		serviceInstance.setUpdateTime(new Date());
		instanceDao.updateByParamNotNull(serviceInstance);
	}

	@Override
	public Map<String, Object> instanceDel(String serviceId) {
		
		Map<String, Object> result = new HashMap<String, Object>();

		instanceDao.delete(serviceId);
		instanceStateService.deleteByServiceId(serviceId);
		diskStatsService.deleteByServiceId(serviceId);
		memoryStatsService.deleteByServiceId(serviceId);
		return result;
	}

	@Override
	public void updStatus(String id, int value) {

		instanceDao.updateOneByProp("id", id, "serviceValue", value);

	}


	@Override
	public ServiceInstances query(ServiceInstances serviceInstances) {
		if (StringUtils.isNotBlank(serviceInstances.getServiceName())){
			return (ServiceInstances) instanceDao.uniqueByProp("serviceName",serviceInstances.getServiceName());
		}
		return null;
	}




}

