package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.service.PermissionService;
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
@RequestMapping("/api/index/data/permission")
public class PermissionStatsController {

    @Autowired
    private PermissionService permissionService;

    /**
     * 接口总数（汇总）
     */
    @GetMapping("interfacesum")
    public ResultData interfaceSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        Integer count = permissionService.interfaceSum(parameterDto);
        List list = new ArrayList();
        Map map = new HashMap();
        map.put("count", count);
        list.add(map);
        resultData.setValue(list);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 接口调用次数（汇总）
     */
    @GetMapping("interfaceusesum")
    public ResultData interfaceUseSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.interfaceUseSum(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 接口调用次数（趋势）
     */
    @GetMapping("interfaceusetrend")
    public ResultData interfaceUseTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.interfaceUseTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下调用接口次数（汇总）
     */
    @GetMapping("interfaceusebytenant")
    public ResultData interfaceUseByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = permissionService.interfaceUseByTenant(parameterDto);
        if (data.size() == 0) {
            List list = new ArrayList();
            HashMap map = new HashMap();
            map.put("count", 0);
            list.add(map);
            resultData.setValue(list);
        } else {
            resultData.setValue(data);
        }
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 接口调用次数（趋势）
     */
    @GetMapping("interfaceusetrendbyid")
    public ResultData interfaceUseTrendById(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.interfaceUseTrendById(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * APP调用接口（趋势）
     */
    @GetMapping("appuseinterfacetrend")
    public ResultData appUseInterfaceTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.appUseInterfaceTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户调用某接口（趋势）
     */
    @GetMapping("tenantuseinterfacetrend")
    public ResultData tenantUseInterfaceTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.tenantUseInterfaceTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }




    /**
     * 接口调用次数 待条件（趋势）
     */
    @GetMapping("interfacetrend")
    public ResultData interfaceTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        resultData.setValue(permissionService.interfaceTrend(parameterDto));
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }
}
