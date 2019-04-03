package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.DataReportRqtDTO;

/**
 * Created by guiqijiang on 11/12/18.
 */
public interface DataReportService {

    /**
     * 添加上报数据
     *
     * @param reportRqtDTO
     */
    void insert(DataReportRqtDTO reportRqtDTO) throws ServiceException;
}
