package com.changhong.iot.service;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.entity.UserEntity;
import com.changhong.iot.searchdto.PlatformManagerfilter;
import com.changhong.iot.searchdto.Sort;
import net.sf.json.JSONArray;

import java.util.List;
import java.util.Map;

public interface UserService {

    public UserEntity findByLoginName(String loginName, int type);

    public UserDto findById(String id);

    public List<UserDto> findByIds(List<String> id);

    public JSONObject getCurrentUserAndTenant(UserDto user) throws ByteException;

    public UserEntity addUser(UserEntity userEntity) throws ByteException;

    public PageModel listPlatformManager(int start, int count, PlatformManagerfilter platformManagerfilter, Sort sort) throws ByteException;

    public UserEntity addPlatformManager(UserEntity userEntity) throws ByteException;

    public void updPlatformManager(String id, String name, String password, String remarks) throws ByteException;

    public boolean updateUser(UserEntity userEntity) throws ByteException;

    public boolean deleteUserByPid(String id);

    public void deleteByTenantId(String tenantId);

    public boolean delete(String id, int currType) throws ByteException;

    public List<UserOptDto> findAllByUnitId(String tenantId, String id);

    public JSONArray findAllByUnitIdTree(String tenantId, String id);

    public boolean batch(List<UserEntity> userEntities) throws ByteException;

    public List<UserOptDto> recursive(String tenantId, String unitId);

    public boolean sort(String thisId, String nextId) throws ByteException;

    public List<UserOptDto> search(String tenantId, String name);

    public void updPassword(String userId, String oldPassword, String newPassword) throws ByteException;

    public void updPassword(String userId, String newPassword) throws ByteException;

    public UserDto findAdminByTenantId(String tenantId);

    public Map<String, String> listByUserName(String tenantId, String userName);

}
