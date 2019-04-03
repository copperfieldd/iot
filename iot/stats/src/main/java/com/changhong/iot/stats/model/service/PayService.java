package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;

public interface PayService {
    List<HashMap> tenantSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> appSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newAppSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> orderSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newOrderTrend(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newOrderSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> appOrderSumByTenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newAppOrderSumByTenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> orderTrendByTenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newappordertrendbytenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newOrderTrendByApp(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> orderTrendByApp(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> orderTrend(ParameterDto parameterDto) throws ServiceException;
}
