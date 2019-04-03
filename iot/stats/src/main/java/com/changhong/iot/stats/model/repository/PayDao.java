package com.changhong.iot.stats.model.repository;

import com.changhong.iot.stats.model.bean.TPay;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;

public interface PayDao extends BaseMongoRepository<TPay> {
    List<HashMap> tenantSum();

    List<HashMap> appSum();

    List<HashMap> newAppSum();

    List<HashMap> orderSum(ParameterDto parameterDto);

    List<HashMap> newOrderTrend(ParameterDto parameterDto);

    List<HashMap> newOrderSum(ParameterDto parameterDto);

    List<HashMap> appOrderSumByTenant(ParameterDto parameterDto);

    List<HashMap> newAppOrderSumByTenant(ParameterDto parameterDto);

    List<HashMap> orderTrend(ParameterDto parameterDto);
}
