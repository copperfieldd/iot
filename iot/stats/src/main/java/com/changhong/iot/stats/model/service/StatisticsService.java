package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.GetStatsRqtDTO;

import java.util.HashMap;

/**
 * Created by guiqijiang on 11/9/18.
 */
public interface StatisticsService {

    /**
     * 统计
     *
     * @param tag
     * @param getStatsRqtDTO
     * @return
     */
    Object count(String domain, String tag, GetStatsRqtDTO getStatsRqtDTO) throws ServiceException;
}
