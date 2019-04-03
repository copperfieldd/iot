package com.changhong.iot.service.impl;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.ServiceDao;
import com.changhong.iot.dto.ServiceOptDto;
import com.changhong.iot.entity.ServiceEntity;
import com.changhong.iot.service.ServiceService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class ServiceServiceImpl implements ServiceService {

    @Resource
    private ServiceDao serviceDao;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Override
    public void add(ServiceEntity serviceEntity) throws ByteException {

        Date date = new Date();

        serviceEntity.setId(UUIDUtil.getUUID());
        serviceEntity.setCreateTime(date);
        serviceEntity.setUpdateTime(date);
        serviceEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        serviceEntity.setCreatorId(myThreadLocal.getUserId());
        serviceEntity.setCreatorName(myThreadLocal.getUserName());

        serviceDao.save(serviceEntity);
    }

    @Override
    public void upd(ServiceEntity serviceEntity) {

        serviceEntity.setUpdateTime(new Date());

        serviceDao.updateByParamNotNull(serviceEntity);
    }

    @Override
    public void del(String id) {
        serviceDao.delete(id);
    }

    @Override
    public ServiceEntity find(String id) {
        return (ServiceEntity) serviceDao.find(id);
    }

    @Override
    public PageModel page(String name, int start, int count) {

        PageModel page = null;

        if (EmptyUtil.isEmpty(name)) {
            page = serviceDao.pageAll(start, count);
        } else {
            page = serviceDao.pageLikeProp(start, count, "name", name);
        }

        return page;
    }

    @Override
    public List<ServiceOptDto> opt() {

        List<ServiceEntity> all = serviceDao.findAll();

        return EntityUtil.entityListToDtoList(all, ServiceOptDto.class);
    }
}
