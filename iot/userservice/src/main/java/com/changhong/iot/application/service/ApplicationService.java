package com.changhong.iot.application.service;

import com.changhong.iot.application.base.BaseService;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.searchdto.Appfilter;
import com.changhong.iot.searchdto.Sort;

import java.util.List;
import java.util.Map;

public interface ApplicationService extends BaseService<ApplicationEntity> {

    /**
     * 添加应用，并且自动生成应用管理员与应用的顶级组织机构（管理在顶级组织机构下）
     * @param
     * @return
     */
    public Map<String, String> addAppAndOther(ApplicationEntity entity) throws ByteException;

    public void updateApp(ApplicationEntity entity) throws ByteException;

    public void deleteByTenantId(String id) throws ByteException;

    public PageModel page(int start, int count, Appfilter appfilter, Sort sort) throws ByteException;

    public PageModel page(String tenantId, int start, int count, Appfilter appfilter, Sort sort) throws ByteException;

    public List<ApplicationEntity> all(String tenantId, String name);

    public void deleteApp(String id) throws ByteException;

}
