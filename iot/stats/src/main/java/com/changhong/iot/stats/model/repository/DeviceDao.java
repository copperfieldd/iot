package com.changhong.iot.stats.model.repository;

import com.changhong.iot.stats.model.bean.device.TDevice;
import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface DeviceDao extends BaseMongoRepository<TDevice> {
    Optional<TDevice> findOneRecent();

    List<HashMap> newdevicesum();

    List<HashMap> newtypeTrend(ParameterDto parameterDto);

    List<HashMap> typeTrend(ParameterDto parameterDto);

    List<HashMap> newDeviceTrend(ParameterDto parameterDto);

    List<HashMap> deviceTrend(ParameterDto parameterDto);

    List<HashMap> newAppTrend(ParameterDto parameterDto);

    List<HashMap> appTrend(ParameterDto parameterDto);

    List<HashMap> deviceSumTrendByType(ParameterDto parameterDto);

//    List<HashMap> clientSumByApp(String appid);
}
