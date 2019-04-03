package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.bean.ScriptBase;
import com.changhong.iot.stats.model.repository.ApplicationRepository;
import com.changhong.iot.stats.model.repository.ScriptRepository;
import com.changhong.iot.stats.model.service.ScriptService;
import com.changhong.iot.stats.web.dto.ScriptRptDTO;
import com.changhong.iot.stats.web.dto.ScriptRqtDTO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Service
public class ScriptServiceImpl implements ScriptService {

    @Autowired
    ScriptRepository repository;

    @Autowired
    ApplicationRepository applicationRepository;

    @Override
    public ScriptRptDTO add(ScriptRqtDTO dto) throws ServiceException {
        if (StringUtils.isEmpty(dto.getTag())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "tag");
        }

        if (StringUtils.isEmpty(dto.getServiceId())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "ServiceId");
        }
        ApplicationBase applicationBase = applicationRepository.find(dto.getServiceId());

        if (null == applicationBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }

        ScriptBase byTag = repository.findByTag(dto.getTag(), applicationBase.getId());
        if (null != byTag) {
            throw new ServiceException(ErrorCode.PARAM_ERROR, "tag");
        }

        ScriptBase base = new ScriptBase();
        base.setId(UUID.randomUUID().toString());
        base.setAppId(applicationBase.getId());
        base.setScript(dto.getScript());
        long today = DateUtil.getTime();
        base.setCdt(today);
        base.setUdt(today);
        base.setRemark(dto.getRemark());
        base.setTag(dto.getTag());
        base.setName(dto.getName());
        repository.save(base);
        ScriptRptDTO scriptRptDTO = new ScriptRptDTO(base);
        scriptRptDTO.setServiceName(applicationBase.getAppName());
        return scriptRptDTO;
    }

    @Override
    public void update(ScriptRqtDTO dto) throws ServiceException {

        ScriptBase scriptBase = repository.find(dto.getId());
        if (null == scriptBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        if (StringUtils.isNotEmpty(dto.getServiceId())
                && !scriptBase.getAppId().equals(dto.getServiceId())) {
            ApplicationBase applicationBase = applicationRepository.find(dto.getServiceId());
            if (null != applicationBase) {
                scriptBase.setAppId(applicationBase.getId());
            }
        }
        if (StringUtils.isNotEmpty(dto.getScript()))
            scriptBase.setScript(dto.getScript());

        if (StringUtils.isNotEmpty(dto.getRemark()))
            scriptBase.setRemark(dto.getRemark());
        if (StringUtils.isNotEmpty(dto.getName()))
            scriptBase.setName(dto.getName());
        if (StringUtils.isNotEmpty(dto.getTag())) {
            scriptBase.setTag(dto.getTag());
        }

        long today = DateUtil.getTime();
        scriptBase.setUdt(today);
        repository.save(scriptBase);
    }

    @Override
    public void updateState(String id, BaseBean.State state) throws ServiceException {
        ScriptBase scriptBase = repository.find(id);
        if (null == scriptBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        scriptBase.setState(state);
        repository.save(scriptBase);
    }

    @Override
    public ScriptRptDTO getItem(String id) {
        ScriptBase base = repository.find(id);
        if (null == base) return null;
        ApplicationBase applicationBase = applicationRepository.findAppByAppId(base.getAppId());
        ScriptRptDTO scriptRptDTO = new ScriptRptDTO(base);
        scriptRptDTO.setServiceName(applicationBase.getAppName());
        return scriptRptDTO;
    }

    @Override
    public PageModel<ScriptRptDTO> getScriptList(ScriptRqtDTO dto) {
        PageModel<HashMap> model = repository.findScript(dto);
        List<ScriptRptDTO> list = new ArrayList<>();
        for (HashMap base : model.getList()) {
            ScriptRptDTO scriptRptDTO = new ScriptRptDTO();
            Map map = (Map) base.get("app");
            scriptRptDTO.setServiceName((String) map.get(ApplicationBase.FIELD_APP_NAME));
            scriptRptDTO.setName((String) base.get(ScriptBase.FILED_SCRIPT_NAME));
            scriptRptDTO.setId((String) base.get(ScriptBase.FIELD_ID));
            scriptRptDTO.setRemark((String) base.get(ScriptBase.FILED_REMARK));
            scriptRptDTO.setScript((String) base.get(ScriptBase.FILED_SCRIPT));
            scriptRptDTO.setTag((String) base.get(ScriptBase.FILED_SCRIPT_TAG));
            scriptRptDTO.setCreateTime((Long) base.get(ScriptBase.FIELD_CREATE_TIME));
            scriptRptDTO.setUpdateTime((Long) base.get(ScriptBase.FIELD_UPDATE_TIME));
            scriptRptDTO.setDomain((String) base.get(ApplicationBase.FIELD_APP_DOMAIN));
            scriptRptDTO.setServiceId((String) base.get(ScriptBase.FILED_APP_ID));
            list.add(scriptRptDTO);
        }
        return new PageModel<>(model.getTotalCount(), list);
    }
}
