package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.stats.model.repository.DataReportRepository;
import com.changhong.iot.stats.model.service.DataReportService;
import com.changhong.iot.stats.model.service.StructureService;
import com.changhong.iot.stats.web.dto.DataReportRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/**
 * Created by guiqijiang on 11/12/18.
 */
@Service
public class DataReportServiceImpl implements DataReportService {

    @Autowired
    DataReportRepository reportRepository;


    @Autowired
    StructureService structureService;


    @Override
    public void insert(DataReportRqtDTO reportRqtDTO) throws ServiceException {
        structureService.checkedDataStructure(reportRqtDTO);
        String collectionId = reportRqtDTO.getApplicationBase().getDomain() + "_" + reportRqtDTO.getCollection();
        Map map = reportRqtDTO.getData();
        Long reportTime = reportRqtDTO.getReportTime();
        map.put("year", DateUtil.getYearOfDate(reportTime));
        map.put("month", DateUtil.getMonthOfDate(reportTime));
        map.put("day", DateUtil.getDayOfDate(reportTime) - 1);
        map.put("_id", UUID.randomUUID().toString());
        map.put("create_time", DateUtil.getTime());
        map.put("reportTime", reportTime);
        reportRepository.insert(collectionId, reportRqtDTO.getData());
    }
}
