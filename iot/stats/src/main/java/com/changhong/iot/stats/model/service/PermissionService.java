package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;

public interface PermissionService {
    Integer interfaceSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> interfaceUseSum(ParameterDto parameterDto) throws ServiceException;

    Object interfaceUseTrend(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> interfaceUseByTenant(ParameterDto parameterDto) throws ServiceException;

    Object interfaceUseTrendById(ParameterDto parameterDto) throws ServiceException;

    Object appUseInterfaceTrend(ParameterDto parameterDto) throws ServiceException;

    Object tenantUseInterfaceTrend(ParameterDto parameterDto) throws ServiceException;

    Object interfaceTrend(ParameterDto parameterDto) throws ServiceException;
}
