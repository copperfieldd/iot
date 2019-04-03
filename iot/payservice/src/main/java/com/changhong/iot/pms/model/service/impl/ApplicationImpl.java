package com.changhong.iot.pms.model.service.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.pms.model.repository.ApplicationRepository;
import com.changhong.iot.pms.model.service.ApplicationService;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.web.dto.ApplicationRpsDTO;
import com.changhong.iot.pms.web.dto.ApplicationRqtDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午11:44 18-1-25
 */
@Service
public class ApplicationImpl implements ApplicationService {

    @Autowired
    ApplicationRepository mapper;

    @Override
    public String getKeyByAppId(String appId) {
        ApplicationBean applicationBean = mapper.findByAppId(appId);
        return null == applicationBean ? null : applicationBean.getAppSecret();
    }

    @Override
    public ApplicationRpsDTO getApplicationByAppId(String appId) {
        ApplicationBean bean = mapper.findByAppId(appId);
        if (null == bean) {
            return null;
        }

        return new ApplicationRpsDTO(bean);
    }

    @Override
    public PageModel<ApplicationRpsDTO> getApplications(ApplicationRqtDTO request) {
        PageModel<ApplicationBean> modelBean = mapper.findsByDTO(request);
        List<ApplicationRpsDTO> rspDTOs = new ArrayList<>();
        for (ApplicationBean a : modelBean.getList()) {
            rspDTOs.add(new ApplicationRpsDTO(a));
        }

        PageModel<ApplicationRpsDTO> pageModel = new PageModel<>();
        pageModel.setList(rspDTOs);
        pageModel.setTotalCount(modelBean.getTotalCount());

        return pageModel;
    }

    @Override
    public ApplicationBean insert(ApplicationRqtDTO params) throws ServiceException {
        if (StringUtils.isEmpty(params.getSecret())) {
            throw new ServiceException(ErrCode.PARAM_ERROR, "缺少重要参数");
        }
        ApplicationBean applicationBean = new ApplicationBean();
        applicationBean.setAppStatus(0);
        applicationBean.setPhone(params.getPhone());
        applicationBean.setName(params.getName());
        applicationBean.setLeadName(params.getLeadName());
        applicationBean.setAppId(UUID.randomUUID().toString());
        applicationBean.setId(UUID.randomUUID().toString());
        Long today = DateUtil.getTime();
        applicationBean.setCdt(today);
        applicationBean.setUdt(today);
        applicationBean.setAppInfo(params.getDescribe());
        applicationBean.setAppSecret(params.getSecret());
        mapper.save(applicationBean);
        return applicationBean;
    }

    @Override
    public void save(ApplicationRqtDTO params) throws ServiceException {
        ApplicationBean applicationBean = mapper.findByAppId(params.getAppId());
        if (null == applicationBean) {
            throw new ServiceException(ErrCode.PARAM_ERROR, "缺少重要参数");
        }

        applicationBean.setAppSecret(params.getSecret());
        applicationBean.setAppInfo(params.getDescribe());
        applicationBean.setPhone(params.getPhone());
        applicationBean.setLeadName(params.getLeadName());
        applicationBean.setName(params.getName());

        mapper.save(applicationBean);
    }

    @Override
    public void updateStatus(int status, String appId) throws ServiceException {
        ApplicationBean applicationBean = mapper.findByAppId(appId);
        if (null == applicationBean)
            throw new ServiceException(ErrCode.PARAM_ERROR, "未找到应用信息");
        applicationBean.setAppStatus(status);
        mapper.save(applicationBean);
    }

    @Override
    public ApplicationRpsDTO getApplications(int start, int count, UserBean userBean) {

        return null;
    }
}
