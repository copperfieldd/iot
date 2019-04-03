package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.MD5Util;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.repository.ApplicationRepository;
import com.changhong.iot.stats.model.service.ApplicationService;
import com.changhong.iot.stats.web.dto.ApplicationRptDTO;
import com.changhong.iot.stats.web.dto.ApplicationRqtDTO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    ApplicationRepository repository;

    @Override
    public boolean checked(String appId, String secret) {
        ApplicationBase base = repository.findAppByAppId(appId);
        if (null != base && base.getAppSecret().equalsIgnoreCase(secret)) {
            return true;
        }
        return false;
    }

    @Override
    public ApplicationRptDTO add(ApplicationRqtDTO dto) throws ServiceException {
        if (StringUtils.isEmpty(dto.getDomain())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "Domain");
        }
        ApplicationBase appByDomain = repository.findAppByDomain(dto.getDomain());
        if (null != appByDomain) {
            throw new ServiceException(ErrorCode.PARAM_ERROR, "Domain");
        }
        ApplicationBase base = new ApplicationBase();
        base.setId(UUID.randomUUID().toString());
        base.setAppName(dto.getServiceName());

        String uuid = UUID.randomUUID().toString();
        base.setAppSecret(MD5Util.md5(uuid));
        base.setDomain(dto.getDomain());
        base.setState(BaseBean.State.NORMAL);
        long today = DateUtil.getTime();
        base.setCdt(today);
        base.setUdt(today);
        base.setFounderId(dto.getFounderId());
        base.setFounderName(dto.getFounderName());
        repository.save(base);
        return new ApplicationRptDTO(base);
    }

    @Override
    public void update(ApplicationRqtDTO dto) throws ServiceException {
        if (StringUtils.isEmpty(dto.getId())) {
            throw new ServiceException(ErrorCode.PARAM_ERROR, "");
        }
        ApplicationBase base = repository.find(dto.getId());
        if (null == base) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA,"");
        }
        if (StringUtils.isNotEmpty(dto.getServiceName())) {
            base.setAppName(dto.getServiceName());
        }
        if (StringUtils.isNotEmpty(dto.getSecret())) {
            base.setAppSecret(dto.getSecret());
        }
        /*if (StringUtils.isNotEmpty(dto.getDomain())) {
            base.setDomain(dto.getDomain());
        }*/
        base.setUdt(DateUtil.getTime());
        repository.save(base);
    }

    @Override
    public void updateState(String id, BaseBean.State state) throws ServiceException {
        ApplicationBase applicationBase = repository.find(id);
        if (null == applicationBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        applicationBase.setUdt(DateUtil.getTime());
        applicationBase.setState(state);
        repository.save(applicationBase);
    }

    @Override
    public ApplicationRptDTO getAppItem(ApplicationRqtDTO dto) {
        if (StringUtils.isNotEmpty(dto.getId())) {
            ApplicationBase base = repository.find(dto.getId());
            if (null == base) {
                return null;
            }
            return new ApplicationRptDTO(base);
        }
        return null;
    }

    @Override
    public PageModel<ApplicationRptDTO> getAppList(ApplicationRqtDTO dto) {
        PageModel<ApplicationBase> bases = repository.findApps(dto);
        List<ApplicationRptDTO> list = new ArrayList<>();
        for (ApplicationBase b : bases.getList()) {
            b.setAppSecret(null);
            b.setUdt(0);
            list.add(new ApplicationRptDTO(b));
        }
        PageModel<ApplicationRptDTO> r = new PageModel<>();
        r.setList(list);
        r.setTotalCount(bases.getTotalCount());
        return r;
    }
}
