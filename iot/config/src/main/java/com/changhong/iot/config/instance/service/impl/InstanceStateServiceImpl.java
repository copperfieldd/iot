package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dao.InstanceStateDao;
import com.changhong.iot.config.instance.entity.ServiceStats;
import com.changhong.iot.config.instance.service.InstanceStateService;
import com.changhong.iot.config.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class InstanceStateServiceImpl implements InstanceStateService {
	
	@Autowired
	private InstanceStateDao instanceStateDao;

	@Override
	public void add(ServiceStats serviceStats) {

		serviceStats.setId(UUID.randomUUID().toString());
		serviceStats.setCreateTime(new Date());
		serviceStats.setUpdateTime(new Date());

		instanceStateDao.save(serviceStats);
	}

	@Override
	public ServiceStats findOne() {
		return instanceStateDao.uniqueByProps(null, null);
	}

	@Override
	public ServiceStats findByServiceId(String id) {
		return instanceStateDao.uniqueByProp("serviceId", id);
	}

	@Override
	public PageModel list(int start, int count) {

		PageModel<ServiceStats> pageAll = instanceStateDao.pageAll(start, count);

		return pageAll;
	}

	@Override
	public void update(ServiceStats serviceStats) {

		serviceStats.setUpdateTime(new Date());
		instanceStateDao.updateByParamNotNull(serviceStats);
	}

	@Override
	public void updAll(long cycle, int failureNumber) {

		instanceStateDao.updateMaryByProps(null, null,
				new String[] {"cycle", "failureNumber"}, new Object[] {cycle, failureNumber});

	}

	@Override
	public List<ServiceStats> findAll() {
		return instanceStateDao.findAll();
	}


	@Override
	public void deleteByServiceId(String id) {

		ServiceStats serviceId = instanceStateDao.uniqueByProp("serviceId", id);

		if (serviceId != null) {
			instanceStateDao.delete(serviceId.getId());
		}
	}

}

