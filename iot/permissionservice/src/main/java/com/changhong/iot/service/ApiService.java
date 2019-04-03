package com.changhong.iot.service;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.ApiInfoDto;
import com.changhong.iot.entity.ApiEntity;
import com.changhong.iot.searchdto.Apifilter;
import com.changhong.iot.searchdto.Sort;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface ApiService {

    public ApiInfoDto findByPath(String path);

    public ApiInfoDto find(String apiId);

    public boolean save(ApiEntity apiEntity) throws ByteException;

    public boolean update(ApiEntity apiEntity) throws ByteException;

    public boolean delete(String apiId) throws ByteException;

    public void deleteByAppId(String appId) throws ByteException;

    public boolean delete(String tenantId, String apiId);

    public ApiInfoDto find(String tenantId, String apiId);

    public PageModel listByServiceId(int start, int count, String serviceId, Apifilter apifilter, Sort sort) throws ByteException;

    public PageModel listByAppId(int start, int count, String appId, Apifilter apifilter, Sort sort) throws ByteException;

    public List<ApiInfoDto> findAllApiByOrgId(String id, boolean isGetPublic) throws ByteException;

    public List<String> findAllApiIdByOrgId(String id, boolean isGetPublic) throws ByteException;

    public List<String> findAllApiIdByOrgIdAuthenticity(String id, int type, String tenantId, String appId) throws ByteException;

    public List<ApiInfoDto> findAllApiByRoleId(String roleId);

    public List<ApiInfoDto> findAllApiByTenantId(String tenantId, boolean isGetPublic) throws ByteException;

    public PageModel findAllApiByTenantId(String tenantId, boolean isGetPublic, int start, int count) throws ByteException;

    public List<ApiEntity> findByAppId(String appId, boolean isGetPublic);

    public List<ApiInfoDto> findApiByApiIds(List<String> apiIds);

    public String getComplexName(ApiInfoDto api);

    public void setComplexName(List<ApiInfoDto> list);

    public void importApi(InputStream in, String fileName) throws ByteException, IOException;

}
