package com.changhong.iot.stats.model.repository;

import com.changhong.iot.stats.model.bean.permission.TPermission;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface PermissionDao extends BaseMongoRepository<TPermission> {
    Optional<TPermission> findOneRecent();

    List<HashMap> interfaceUseSum();

    List<HashMap> interfaceUseTrend(ParameterDto parameterDto);

    List<HashMap> interfaceUseByTenant(ParameterDto parameterDto);

    List<HashMap> interfaceUseTrendById(ParameterDto parameterDto);

    List<HashMap> appUseInterfaceTrend(ParameterDto parameterDto);

    List<HashMap> tenantUseInterfaceTrend(ParameterDto parameterDto);

    List<HashMap> interfaceTrend(ParameterDto parameterDto);
}
