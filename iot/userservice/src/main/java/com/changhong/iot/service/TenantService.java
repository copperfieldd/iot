package com.changhong.iot.service;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.TenantDto;
import com.changhong.iot.dto.TenantOptDto;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.searchdto.Tenantfilter;

import java.util.List;
import java.util.Map;

public interface TenantService {

    public TenantDto findById(String id);

    public List<TenantOptDto> findByTenantId(String id);

    public TenantDto findById(String tenantId, String id);

    public Map<String, Object> addTenant(TenantEntity tenantEntity) throws ByteException;

    public boolean updateTenant(TenantEntity tenantEntity) throws ByteException;

    public boolean deleteTenantById(String tenantId, String id) throws ByteException;

    public PageModel listTenante(int start, int count, Tenantfilter tenantfilter, Sort sort) throws ByteException;

    public List<TenantOptDto> allTenant(String tenantId, String name);

    public List<TenantOptDto> findByGradeId(String id);

    /**
     * 获取租户的tenantIds （包括平台id 0）
     * @param
     * @return
     *
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
     * 文件名称： TenantService.java
     * 包名：com.changhong.iot.service
     * 创建人：@author wangkn@bjbths.com
     * 创建时间：2018/10/24 14:59
     * 修改人：wangkn@bjbths.com
     * 修改时间：2018/10/24 14:59
     * 修改备注：
     */
    public List<String> findPids(String tenantId) throws ByteException;

    Map<String,String> listByName(String name) throws ByteException;
}
