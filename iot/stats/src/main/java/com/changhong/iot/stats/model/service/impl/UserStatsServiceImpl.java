package com.changhong.iot.stats.model.service.impl;


import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.device.TenantAppSum;
import com.changhong.iot.stats.model.bean.user.ClientUserSum;
import com.changhong.iot.stats.model.bean.user.TUser;
import com.changhong.iot.stats.model.repository.UserStatsDao;
import com.changhong.iot.stats.model.service.UserStatsService;
import com.changhong.iot.stats.util.TrendUtil;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static com.changhong.iot.stats.config.ModelConstants.*;
import static com.changhong.iot.stats.config.ModelConstants.GROUP;

@Service
public class UserStatsServiceImpl implements UserStatsService {


    @Autowired
    private UserStatsDao userStatsDao;


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
     * 总租户数（汇总）
     */
    @Override
    public Integer tenantSum(ParameterDto parameterDto) throws ServiceException {
        Optional<TUser> user = userStatsDao.findOneRecent();
        int[] sum = {0};
        user.ifPresent(item -> {
            sum[0] = user.get().getTenantSum();
        });
        return sum[0];
    }

    /**
     * 新增租户（汇总）
     */
    @Override
    public List<HashMap> newTenantSum(ParameterDto parameterDto) throws ServiceException {
        return userStatsDao.newTenantSum(parameterDto);
    }

    /**
     * 总C端用户（汇总）
     */
    @Override
    public Integer clientSum(ParameterDto parameterDto) {
        int[] sum = {0};
        userStatsDao.findOneRecent().ifPresent(user -> {
            user.getClientUserSum()
                    .stream()
                    .map(ClientUserSum::getClientSum)
                    .reduce((x, y) -> x + y)
                    .ifPresent(item -> sum[0] = item);
        });
        return sum[0];
    }


    /**
     * 新增租户（趋势）
     */
    @Override
    public List<HashMap> newTenantTrend(ParameterDto parameterDto) throws  ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.newTenantTrend(parameterDto));
    }

    /**
     * 累计租户（趋势）
     */
    @Override
    public List<HashMap> tenantTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.tenantTrend(parameterDto));
    }

    /**
     * C端新增用户（趋势）
     */
    @Override
    public List<HashMap> newClientTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.newClientTrend(parameterDto));
    }

    /**
     * C端累计用户（趋势）
     */
    @Override
    public List<HashMap> clientTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.clientTrend(parameterDto));
    }

    /**
     * 各租户下应用总数（汇总）
     */
    @Override
    public int tenantAppSum(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantId");
        }
        int[] sum = {0};
        userStatsDao.findOneRecent().ifPresent(user -> {
            user.getTenantAppSum()
                    .stream()
                    .filter(item -> parameterDto.getTenantid().equals(item.getTenantId()))
                    .map(TenantAppSum::getAppSum)
                    .reduce((x, y) -> x + y)
                    .ifPresent(item -> sum[0] = item);
        });
        return sum[0];
    }

    /**
     * 各租户下C端新增用户数（趋势）
     */
    @Override
    public List<HashMap> newClientTrendByTenant(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantId");
        }
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.newClientTrendByTenant(parameterDto));
    }

    /**
     * 各租户下C端用户累计（趋势）
     */
    @Override
    public List<HashMap> clientTrendByTenant(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantId");
        }
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.clientTrendByTenant(parameterDto));
    }



    /**
     * 各应用下C端新增用户总数（趋势）
     */
    @Override
    public List<HashMap> newClientTrendByApp(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.newClientTrendByApp(parameterDto));
    }

    /**
     * 各应用下总C端用户数（汇总）
     */
    @Override
    public Integer clientSumByApp(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }

        int[] sun = {0};
        userStatsDao.findOneRecent().ifPresent(user->{
            user.getClientUserSum()
                    .stream()
                    .filter(item -> item.getAppId().equals(parameterDto.getAppid()))
                    .map(ClientUserSum::getClientSum)
                    .reduce((x, y) -> (x + y))
                    .ifPresent(item->sun[0] = item);

        });
        return sun[0];
    }

    @Override
    public List<HashMap> newClienTtrendByTenant(ParameterDto parameterDto) throws ServiceException {

        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.newClienTtrendByTenant(parameterDto));
    }

    /**
     * 各应用C端累计用户数（趋势）
     */
    @Override
    public List<HashMap> clientTrendByApp(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, userStatsDao.clientTrendByApp(parameterDto));
    }
}
