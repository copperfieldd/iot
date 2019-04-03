package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.ServiceStats;

import java.util.List;

public interface DiskStatsService {

    void add(DiskStats diskStats);

    PageModel list(int start, int count);

    void update(DiskStats diskStats);

    void updAll(long cycle, long threshold);

    void delete(String id);

    void deleteByServiceId(String id);

    DiskStats findByServiceId(String id);

    DiskStats find(String id);

    DiskStats findOne();

    List<DiskStats> findAll();

}
