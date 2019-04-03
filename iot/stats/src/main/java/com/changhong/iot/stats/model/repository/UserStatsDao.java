package com.changhong.iot.stats.model.repository;

import com.changhong.iot.stats.model.bean.user.TUser;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface UserStatsDao extends BaseMongoRepository<TUser> {
    Optional<TUser> findOneRecent();

    List<HashMap> newTenantSum(ParameterDto parameterDto);

    List<HashMap> newTenantTrend(ParameterDto parameterDto);

    List<HashMap> tenantTrend(ParameterDto parameterDto);

    List<HashMap> newClientTrend(ParameterDto parameterDto);

    List<HashMap> clientTrend(ParameterDto parameterDto);

    List<HashMap> tenantAppSum(ParameterDto parameterDto);

    List<HashMap> newClientTrendByTenant(ParameterDto parameterDto);

    List<HashMap> clientTrendByTenant(ParameterDto parameterDto);

    List<HashMap> clientTrendByApp(ParameterDto parameterDto);

    List<HashMap> newClientTrendByApp(ParameterDto parameterDto);

    List<HashMap> newClienTtrendByTenant(ParameterDto parameterDto);
}
