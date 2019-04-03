package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;

public interface Deviceservice {
    Integer tenantSum(ParameterDto parameterDto);

    Integer typeSum(ParameterDto parameterDto);

    List<HashMap> newdeviceSum(ParameterDto parameterDto);

    Object newtypeTrend(ParameterDto parameterDto) throws ServiceException;

    Object typeTrend(ParameterDto parameterDto) throws ServiceException;

    Object newDeviceTrend(ParameterDto parameterDto) throws ServiceException;

    Object deviceTrend(ParameterDto parameterDto) throws ServiceException;

    Object newAppTrend(ParameterDto parameterDto) throws ServiceException;

    Object appTrend(ParameterDto parameterDto) throws ServiceException;

    Integer appSumByTenant(ParameterDto parameterDto) throws ServiceException;

    Integer clientSumByApp(ParameterDto parameterDto) throws ServiceException;

    Integer deviceSumByType(ParameterDto parameterDto) throws ServiceException;

    Integer deviceSum(ParameterDto parameterDto) throws ServiceException;

    Integer deviceSumByTenant(ParameterDto parameterDto) throws ServiceException;


    Object deviceSumTrendByType(ParameterDto parameterDto) throws ServiceException;
}
