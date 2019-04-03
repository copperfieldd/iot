package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.HttpRequestUtil;
import com.changhong.iot.stats.model.service.StatisticsService;
import com.changhong.iot.stats.web.dto.GetStatsRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;

/**
 * Created by guiqijiang on 11/6/18.
 */
@RestController
public class IndexController {

    @Autowired
    StatisticsService statisticsService;


//    @GetMapping(APIPathConfConstant.ROUTER_API_INDEX_DATA + "/{domain}/{tag}")
    public ResultData getStatistics(@PathVariable("domain") String domain,
                                    @PathVariable("tag") String tag,
                                    HttpServletRequest request,
                                    GetStatsRqtDTO getStatsRqtDTO,
                                    ResultData resultData) throws IOException, ServiceException {
        getStatsRqtDTO.putAll(request.getParameterMap());
        resultData.setValue(statisticsService.count(domain, tag, getStatsRqtDTO));
//        resultData.setMessage("ok");
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }
}
