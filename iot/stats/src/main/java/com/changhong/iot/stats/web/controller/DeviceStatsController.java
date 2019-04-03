package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.service.Deviceservice;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/index/data/device")
public class DeviceStatsController {


    @Autowired
    private Deviceservice deviceservice;

    /**
     * 接入租户数（汇总）
     *
     * @return
     */
    @GetMapping("tenantsum")
    public ResultData tenantSum(ParameterDto parameterDto, ResultData resultData) {
        Integer count = deviceservice.tenantSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 接入设备数（汇总）
     */
    @GetMapping("devicesum")
    public ResultData deviceSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = deviceservice.deviceSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 总配置数（汇总）
     *
     * @return
     */
    @GetMapping("typesum")
    public ResultData typeSum(ParameterDto parameterDto, ResultData resultData) {
        Integer count = deviceservice.typeSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 新增设备（汇总）
     *
     * @return
     */
    @GetMapping("newdevicesum")
    public ResultData newdeviceSum(ParameterDto parameterDto, ResultData resultData) {
        resultData.setValue(deviceservice.newdeviceSum(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增设备配置（趋势）
     */
    @GetMapping("newtypetrend")
    public ResultData newtypeTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.newtypeTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 累计设备配置（趋势）
     */
    @GetMapping("typetrend")
    public ResultData typeTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.typeTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增设备数（趋势）
     */
    @GetMapping("newdevicetrend")
    public ResultData newDeviceTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.newDeviceTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 累计设备数（趋势）
     */
    @GetMapping("devicetrend")
    public ResultData deviceTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.deviceTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增应用（趋势）
     */
    @GetMapping("newapptrend")
    public ResultData newAppTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.newAppTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 累计应用（趋势）
     */
    @GetMapping("apptrend")
    public ResultData appTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.appTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下应用（汇总)
     *
     * @return
     */
    @GetMapping("appsumbytenant")
    public ResultData appSumByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = deviceservice.appSumByTenant(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 应用下累计设备（汇总）
     */
    @GetMapping("clientsumbyapp")
    public ResultData clientSumByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = deviceservice.clientSumByApp(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 不同设备配置下设备（汇总）
     */
    @GetMapping("devicesumbytype")
    public ResultData deviceSumByType(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = deviceservice.deviceSumByType(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下设备数（汇总)
     */
    @GetMapping("devicesumbytenant")
    public ResultData deviceSumByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = deviceservice.deviceSumByTenant(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }
    /**
     * 设备配置下设备总数（趋势）
     */
    @GetMapping("devicesumtrendbytype")
    public ResultData deviceSumTrendByType(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(deviceservice.deviceSumTrendByType(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }
}
