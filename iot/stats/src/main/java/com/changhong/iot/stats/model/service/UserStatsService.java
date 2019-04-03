package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;

public interface UserStatsService {
    Integer tenantSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newTenantSum(ParameterDto parameterDto) throws ServiceException;

    Integer clientSum(ParameterDto parameterDto);

    List<HashMap> newTenantTrend(ParameterDto parameterDto) throws  ServiceException;

    List<HashMap> tenantTrend(ParameterDto parameterDto) throws  ServiceException;

    List<HashMap> newClientTrend(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> clientTrend(ParameterDto parameterDto) throws ServiceException;

    int tenantAppSum(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newClientTrendByTenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> clientTrendByTenant(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> clientTrendByApp(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newClientTrendByApp(ParameterDto parameterDto) throws ServiceException;

    Integer clientSumByApp(ParameterDto parameterDto) throws ServiceException;

    List<HashMap> newClienTtrendByTenant(ParameterDto parameterDto)throws ServiceException;
}
