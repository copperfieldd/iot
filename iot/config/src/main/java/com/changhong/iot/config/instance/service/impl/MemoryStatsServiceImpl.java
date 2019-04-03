package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dao.MemoryStatsDao;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.MemoryStats;
import com.changhong.iot.config.instance.entity.ServiceStats;
import com.changhong.iot.config.instance.service.MemoryStatsService;
import com.changhong.iot.config.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class MemoryStatsServiceImpl implements MemoryStatsService{

    @Autowired
    private MemoryStatsDao memoryStatsDao;

    @Override
    public void add(MemoryStats memoryStats) {

        memoryStats.setId(UUID.randomUUID().toString());
        memoryStats.setCreateTime(new Date());
        memoryStats.setUpdateTime(new Date());
        memoryStatsDao.save(memoryStats);
    }

    @Override
    public PageModel list(int start, int count) {

        PageModel<ServiceStats> pageAll = memoryStatsDao.pageAll(start, count);

        return pageAll;
    }

    @Override
    public void update(MemoryStats memoryStats) {

        memoryStats.setUpdateTime(new Date());
        memoryStatsDao.updateByParamNotNull(memoryStats);
    }

    @Override
    public void updAll(long cycle, long threshold) {

        memoryStatsDao.updateMaryByProps(null, null,
                new String[] {"cycle", "threshold"}, new Object[] {cycle, threshold});

    }

    @Override
    public void delete(String id) {
        memoryStatsDao.delete(id);
    }

    @Override
    public void deleteByServiceId(String id) {

        MemoryStats serviceId = (MemoryStats) memoryStatsDao.uniqueByProp("serviceId", id);

        if (serviceId != null) {
            memoryStatsDao.delete(serviceId.getId());
        }
    }

    @Override
    public MemoryStats findByServiceId(String id) {
        return (MemoryStats) memoryStatsDao.uniqueByProp("serviceId", id);
    }

    @Override
    public MemoryStats findOne() {
        return (MemoryStats) memoryStatsDao.uniqueByProps(null, null);
    }

    @Override
    public MemoryStats find(String id) {
        return (MemoryStats) memoryStatsDao.find(id);
    }

    @Override
    public List<MemoryStats> findAll() {
        return memoryStatsDao.findAll();
    }
}
