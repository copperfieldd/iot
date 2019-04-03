package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.service.DataReportService;
import com.changhong.iot.stats.model.service.StructureService;
import com.changhong.iot.stats.web.dto.DataReportRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by guiqijiang on 11/6/18.
 */
@RestController
public class DataReportController {

    @Autowired
    DataReportService dataReportService;

    @PostMapping(APIPathConfConstant.ROUTER_API_DATA_REPORT)
    public ResultData dataReport(@RequestBody DataReportRqtDTO reportRqtDTO, ResultData resultData) throws ServiceException {
        dataReportService.insert(reportRqtDTO);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        return resultData;
    }
}
