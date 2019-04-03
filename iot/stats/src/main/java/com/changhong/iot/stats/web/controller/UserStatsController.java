package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.service.UserStatsService;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.rowset.serial.SerialException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/index/data/user")
public class UserStatsController {

    @Autowired
    private UserStatsService userStatsService;


    /**
     * 总租户数（汇总）
     */
    @GetMapping("tenantsum")
    public ResultData tenantSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = userStatsService.tenantSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增租户（汇总）
     */
    @GetMapping("newtenantsum")
    public ResultData newTenantSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.newTenantSum(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 总C端用户（汇总）
     */
    @GetMapping("clientsum")
    public ResultData clientSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = userStatsService.clientSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增租户（趋势）
     */
    @GetMapping("newtenanttrend")
    public ResultData newTenantTrend(ParameterDto parameterDto, ResultData resultData) throws SerialException, ServiceException {
        List<HashMap> data = userStatsService.newTenantTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 累计租户（趋势）
     */
    @GetMapping("tenanttrend")
    public ResultData tenantTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.tenantTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * C端新增用户（趋势）
     */
    @GetMapping("newclienttrend")
    public ResultData newClientTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.newClientTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * C端累计用户（趋势）
     */
    @GetMapping("clienttrend")
    public ResultData clientTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.clientTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各租户下应用总数（汇总）
     */
    @GetMapping("tenantappsum")
    public ResultData tenantAppSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        int count = userStatsService.tenantAppSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各租户下C端用户累计（趋势）
     */
    @GetMapping("clienttrendbytenant")
    public ResultData clientTrendByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.clientTrendByTenant(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各租户下C端用户累计（趋势）
     */
    @GetMapping("newclienttrendbytenant")
    public ResultData newClienTtrendByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.newClienTtrendByTenant(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各应用下总C端用户数（汇总）
     */
    @GetMapping("clientsumbyapp")
    public ResultData clientSumByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        final Integer count = userStatsService.clientSumByApp(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各应用下C端新增用户总数（趋势）
     */
    @GetMapping("newclienttrendbyapp")
    public ResultData newClientTrendByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.newClientTrendByApp(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 各应用C端累计用户数（趋势）
     */
    @GetMapping("clienttrendbyapp")
    public ResultData clientTrendByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = userStatsService.clientTrendByApp(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }
}
