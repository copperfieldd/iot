package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dao.DiskStatsDao;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.MemoryStats;
import com.changhong.iot.config.instance.entity.ServiceStats;
import com.changhong.iot.config.instance.service.DiskStatsService;
import com.changhong.iot.config.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DiskStatsServiceImpl implements DiskStatsService {

    @Autowired
    private DiskStatsDao diskStatsDao;

    @Override
    public void add(DiskStats diskStats) {

        diskStats.setId(UUID.randomUUID().toString());
        diskStats.setCreateTime(new Date());
        diskStats.setUpdateTime(new Date());
        diskStatsDao.save(diskStats);
    }

    @Override
    public PageModel list(int start, int count) {

        PageModel<ServiceStats> pageAll = diskStatsDao.pageAll(start, count);

        return pageAll;
    }

    @Override
    public void update(DiskStats diskStats) {

        diskStats.setUpdateTime(new Date());
        diskStatsDao.updateByParamNotNull(diskStats);
    }

    @Override
    public void updAll(long cycle, long threshold) {

        diskStatsDao.updateMaryByProps(null, null,
                new String[] {"cycle", "threshold"}, new Object[] {cycle, threshold});

    }

    @Override
    public void delete(String id) {
        diskStatsDao.delete(id);
    }

    @Override
    public void deleteByServiceId(String id) {

        DiskStats serviceId = (DiskStats) diskStatsDao.uniqueByProp("serviceId", id);

        if (serviceId != null) {
            diskStatsDao.delete(serviceId.getId());
        }
    }

    @Override
    public DiskStats findByServiceId(String id) {
        return (DiskStats) diskStatsDao.uniqueByProp("serviceId", id);
    }

    @Override
    public DiskStats findOne() {
        return (DiskStats) diskStatsDao.uniqueByProps(null, null);
    }

    @Override
    public DiskStats find(String id) {
        return (DiskStats) diskStatsDao.find(id);
    }

    @Override
    public List<DiskStats> findAll() {
        return diskStatsDao.findAll();
    }
}
