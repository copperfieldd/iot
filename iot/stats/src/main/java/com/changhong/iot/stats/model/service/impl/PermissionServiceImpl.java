package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.repository.PermissionDao;
import com.changhong.iot.stats.model.service.PermissionService;
import com.changhong.iot.stats.util.TrendUtil;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import static com.changhong.iot.stats.config.ModelConstants.*;
import static com.changhong.iot.stats.config.ModelConstants.GROUP;

@Service
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    private PermissionDao permissionDao;


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
     * 接口总数（汇总）
     */
    @Override
    public Integer interfaceSum(ParameterDto parameterDto) throws ServiceException {
        int[] sum = {0};
        permissionDao.findOneRecent().ifPresent(permission -> {
            sum[0] = permission.getInterfaceSum();
        });
        return sum[0];
    }

    /**
     * 接口调用次数（汇总）
     */
    @Override
    public List<HashMap> interfaceUseSum(ParameterDto parameterDto) throws ServiceException {
        return permissionDao.interfaceUseSum();
    }

    /**
     * 接口调用次数（趋势）
     */
    @Override
    public List<HashMap> interfaceUseTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, permissionDao.interfaceUseTrend(parameterDto));
    }

    /**
     * 租户下调用接口次数（汇总）
     */
    @Override
    public List<HashMap> interfaceUseByTenant(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return permissionDao.interfaceUseByTenant(parameterDto);
    }

    /**
     * 接口调用次数（趋势）
     */
    @Override
    public Object interfaceUseTrendById(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getInterfaceid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "interfaceid");
        }
        return TrendUtil.checkTrendData(parameterDto, permissionDao.interfaceUseTrendById(parameterDto));
    }

    /**
     * APP调用接口（趋势）
     */
    @Override
    public Object appUseInterfaceTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getInterfaceid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "interfaceid");
        }
        return TrendUtil.checkTrendData(parameterDto, permissionDao.appUseInterfaceTrend(parameterDto));
    }

    /**
     * 租户调用某接口（趋势）
     */
    @Override
    public Object tenantUseInterfaceTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getInterfaceid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "interfaceid");
        }
        return TrendUtil.checkTrendData(parameterDto, permissionDao.tenantUseInterfaceTrend(parameterDto));
    }

    /**
     * 接口调用次数 待条件（趋势）
     */
    @Override
    public Object interfaceTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getInterfaceid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "interfaceid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, permissionDao.interfaceTrend(parameterDto));
    }
}
