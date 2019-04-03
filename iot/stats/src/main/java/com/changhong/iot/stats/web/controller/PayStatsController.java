package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.service.PayService;
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
@RequestMapping("/api/index/data/pay")
public class PayStatsController {
    @Autowired
    private PayService payService;

    /**
     * 接入租户总数（汇总）
     */
    @GetMapping("tenantsum")
    public ResultData tenantSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.tenantSum(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 总应用数（汇总）
     */
    @GetMapping("appsum")
    public ResultData appSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.appSum(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增应用数（汇总）
     */
    @GetMapping("newappsum")
    public ResultData newAppSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.newAppSum(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 订单总数（汇总）
     */
    @GetMapping("ordersum")
    public ResultData orderSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.orderSum(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 订单总数（趋势）
     */
    @GetMapping("ordertrend")
    public ResultData orderTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.orderTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 新增订单数 趋势 （综合）
     */
    @GetMapping("newordertrend")
    public ResultData newOrderTrend(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.newOrderTrend(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 新增订单数（汇总）
     */
    @GetMapping("newordersum")
    public ResultData newOrderSum(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.newOrderSum(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下订单总数（汇总）
     */
    @GetMapping("appordersumbytenant")
    public ResultData appOrderSumByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.appOrderSumByTenant(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下新增订单数（汇总）
     */
    @GetMapping("newappordersumbytenant")
    public ResultData newAppOrderSumByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = cheekData(payService.newAppOrderSumByTenant(parameterDto));
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 租户下订单数（趋势）
     */
    @GetMapping("ordertrendbytenant")
    public ResultData orderTrendByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.orderTrendByTenant(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 应用订单总数（趋势）
     */
    @GetMapping("ordertrendbyapp")
    public ResultData orderTrendByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.orderTrendByApp(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    /**
     * 租户下新增订单数（趋势）
     */
    @GetMapping("newappordertrendbytenant")
    public ResultData newAppOrderTrendByTenant(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.newappordertrendbytenant(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    /**
     * 应用下新增订单数（趋势）
     */
    @GetMapping("newordertrendbyapp")
    public ResultData newOrderTrendByApp(ParameterDto parameterDto, ResultData resultData) throws ServiceException {
        List<HashMap> data = payService.newOrderTrendByApp(parameterDto);
        resultData.setValue(data);
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }


    private List<HashMap> cheekData(List<HashMap> data) {
        if (data.size() == 0) {
            List list = new ArrayList();
            HashMap map = new HashMap();
            map.put("count", 0);
            list.add(map);
            return list;
        } else {
            return data;
        }
    }
}
