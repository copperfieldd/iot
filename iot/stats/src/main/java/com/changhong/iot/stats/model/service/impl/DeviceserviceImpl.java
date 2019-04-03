package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.device.AppDevice;
import com.changhong.iot.stats.model.bean.device.DeviceType;
import com.changhong.iot.stats.model.bean.device.TDevice;
import com.changhong.iot.stats.model.bean.device.TenantAppSum;
import com.changhong.iot.stats.model.repository.DeviceDao;
import com.changhong.iot.stats.model.service.Deviceservice;
import com.changhong.iot.stats.util.TrendUtil;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.changhong.iot.stats.config.ModelConstants.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceserviceImpl implements Deviceservice {

    @Autowired
    private DeviceDao deviceDao;


    /**
     * 检查参数
     */
    private void checkParameter(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getGroup())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, GROUP);
        }
        String group = parameterDto.getGroup();
        if (!(YEAR.equals(group) || MONTH.equals(group) || DAY.equals(group))) {
            throw new ServiceException(1017, GROUP);
        }
        if (parameterDto.getStarttime() == 0 || parameterDto.getEndtime() == 0) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "starttime or endtime");
        }
    }

    /**
     * 接入租户数（汇总）
     */
    @Override
    public Integer tenantSum(ParameterDto parameterDto) {
        final Optional<TDevice> device = deviceDao.findOneRecent();
        if (device.isPresent()) {
            return device.get().getTenantSum();
        }
        return 0;
    }

    /**
     * 总配置数（汇总）
     */
    @Override
    public Integer typeSum(ParameterDto parameterDto) {
        final Optional<TDevice> device = deviceDao.findOneRecent();
        if (device.isPresent()) {
            return device.get().getDeviceTypeSum();
        }
        return 0;
    }

    /**
     * 新增设备（汇总）
     */
    @Override
    public List<HashMap> newdeviceSum(ParameterDto parameterDto) {
        return deviceDao.newdevicesum();
    }

    /**
     * 新增设备配置（趋势）
     */
    @Override
    public Object newtypeTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, deviceDao.newtypeTrend(parameterDto));
    }


    /**
     * 累计设备配置（趋势）
     */
    @Override
    public Object typeTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, deviceDao.typeTrend(parameterDto));
    }

    /**
     * 新增设备数（趋势）
     */
    @Override
    public Object newDeviceTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(1009, "tenantId");
        }
        return TrendUtil.checkTrendData(parameterDto, deviceDao.newDeviceTrend(parameterDto));
    }

    /**
     * 累计设备数（趋势）
     */
    @Override
    public Object deviceTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(1009, "tenantId");
        }
        return TrendUtil.checkTrendData(parameterDto, deviceDao.deviceTrend(parameterDto));
    }

    /**
     * 新增应用（趋势）
     */
    @Override
    public Object newAppTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, deviceDao.newAppTrend(parameterDto));
    }

    /**
     * 累计应用（趋势）
     */
    @Override
    public Object appTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, deviceDao.appTrend(parameterDto));
    }


    /**
     * 租户下应用（汇总)
     */
    @Override
    public Integer appSumByTenant(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(1009, "tenantId");
        }
        int[] sum = {0};
        deviceDao.findOneRecent().ifPresent(tDevice -> {
            Optional<Integer> first = tDevice.getTenantAppSum()
                    .stream()
                    .filter(item -> parameterDto.getTenantid().equals(item.getTenantId()))
                    .findFirst()
                    .map(TenantAppSum::getNewAppSum);
            first.ifPresent(num -> {
                sum[0] = num;
            });
        });
        return sum[0];
    }

    /**
     * 应用下累计设备（汇总）
     */
    @Override
    public Integer clientSumByApp(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        Optional<TDevice> device = deviceDao.findOneRecent();
        int[] sum = {0};
        device.ifPresent(item -> {
            item.getAppDevice()
                    .stream()
                    .filter(app -> parameterDto.getAppid().equals(app.getAppId()))
                    .findFirst()
                    .map(AppDevice::getDeviceSum)
                    .ifPresent(deviceSum -> {
                        sum[0] = deviceSum;
                    });
        });
        return sum[0];
    }


    /**
     * 不同设备配置下设备（汇总）
     */
    @Override
    public Integer deviceSumByType(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTypeid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "typeid");
        }
        Optional<TDevice> device = deviceDao.findOneRecent();
        int[] sum = {0};
        device.ifPresent(item -> {
            item.getDeviceType()
                    .stream()
                    .filter(type -> parameterDto.getTypeid().equals(type.getTypeId()))
                    .findFirst()
                    .map(DeviceType::getDeviceSum)
                    .ifPresent(deviceSum -> {
                        sum[0] = deviceSum;
                    });
        });
        return sum[0];
    }

    /**
     * 接入设备数（汇总）
     */
    @Override
    public Integer deviceSum(ParameterDto parameterDto) throws ServiceException {
        int[] sum = {0};
        deviceDao.findOneRecent().ifPresent(item -> {
            item.getDeviceType()
                    .stream()
                    .map(DeviceType::getDeviceSum)
                    .reduce((x, y) -> (x + y))
                    .ifPresent(num -> sum[0] = num);
            ;
        });
        return sum[0];
    }

    /**
     * 租户下设备数（汇总)
     */
    @Override
    public Integer deviceSumByTenant(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        Optional<TDevice> device = deviceDao.findOneRecent();
        int[] sum = {0};
        device.ifPresent(item -> {
            item.getAppDevice()
                    .stream()
                    .filter(app -> parameterDto.getTenantid().equals(app.getTenantId()))
                    .findFirst()
                    .map(AppDevice::getDeviceSum)
                    .ifPresent(deviceSum -> {
                        sum[0] = deviceSum;
                    });
        });
        return sum[0];
    }

    /**
     * 设备配置下设备总数（趋势）
     */
    @Override
    public Object deviceSumTrendByType(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTypeid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "typeid");
        }
        return TrendUtil.checkTrendData(parameterDto, deviceDao.deviceSumTrendByType(parameterDto));
    }
}
