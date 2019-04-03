package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.MemoryStats;

import java.util.List;

public interface MemoryStatsService {

    void add(MemoryStats memoryStats);

    PageModel list(int start, int count);

    void update(MemoryStats memoryStats);

    void updAll(long cycle, long threshold);

    void delete(String id);

    void deleteByServiceId(String id);

    MemoryStats findByServiceId(String id);

    MemoryStats findOne();

    MemoryStats find(String id);

    List<MemoryStats> findAll();

}
