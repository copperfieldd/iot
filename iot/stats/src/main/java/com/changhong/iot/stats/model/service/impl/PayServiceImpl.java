package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.repository.PayDao;
import com.changhong.iot.stats.model.service.PayService;
import com.changhong.iot.stats.util.TrendUtil;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import static com.changhong.iot.stats.config.ModelConstants.*;
import static com.changhong.iot.stats.config.ModelConstants.GROUP;

@Service
public class PayServiceImpl implements PayService {
    @Autowired
    private PayDao payDao;


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
     * 接入租户总数（汇总）
     */
    @Override
    public List<HashMap> tenantSum(ParameterDto parameterDto) throws ServiceException {
       return payDao.tenantSum();
    }

    /**
     * 总应用数（汇总）
     */
    @Override
    public List<HashMap> appSum(ParameterDto parameterDto) throws ServiceException {
        return payDao.appSum();
    }

    /**
     * 新增应用数（汇总）
     */
    @Override
    public List<HashMap> newAppSum(ParameterDto parameterDto) throws ServiceException {
        return payDao.newAppSum();
    }

    /**
     * 订单总数（汇总）
     */
    @Override
    public List<HashMap> orderSum(ParameterDto parameterDto) throws ServiceException {
        return payDao.orderSum(parameterDto);
    }

    /**
     * 新增订单数（趋势）
     */
    @Override
    public List<HashMap> newOrderTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.newOrderTrend(parameterDto));
    }


    /**
     * 新增订单数（汇总）
     */
    @Override
    public List<HashMap> newOrderSum(ParameterDto parameterDto) throws ServiceException {
        return payDao.newOrderSum(parameterDto);
    }

    /**
     * 租户下订单总数（汇总）
     */
    @Override
    public List<HashMap> appOrderSumByTenant(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return payDao.appOrderSumByTenant(parameterDto);
    }

    /**
     * 租户下新增订单数（汇总）
     */
    @Override
    public List<HashMap> newAppOrderSumByTenant(ParameterDto parameterDto) throws ServiceException {
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return payDao.newAppOrderSumByTenant(parameterDto);
    }

    /**
     * 订单总数（趋势）
     */
    @Override
    public List<HashMap> orderTrend(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.orderTrend(parameterDto));
    }

    /**
     * 租户下订单数（趋势）
     */
    @Override
    public List<HashMap> orderTrendByTenant(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.orderTrend(parameterDto));
    }

    /**
     * 应用订单总数（趋势）
     */
    @Override
    public List<HashMap> orderTrendByApp(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.orderTrend(parameterDto));
    }




    /**
     * 租户下新增订单数（趋势）
     */
    @Override
    public List<HashMap> newappordertrendbytenant(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getTenantid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tenantid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.newOrderTrend(parameterDto));
    }

    /**
     * 应用下新增订单数（趋势）
     */
    @Override
    public List<HashMap> newOrderTrendByApp(ParameterDto parameterDto) throws ServiceException {
        checkParameter(parameterDto);
        if (EmptyUtil.isEmpty(parameterDto.getAppid())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "appid");
        }
        return TrendUtil.checkTrendData(parameterDto, payDao.newOrderTrend(parameterDto));
    }
}
