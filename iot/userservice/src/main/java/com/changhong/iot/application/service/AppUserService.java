package com.changhong.iot.application.service;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.searchdto.EndUserfilter;
import com.changhong.iot.searchdto.Sort;
import net.sf.json.JSONArray;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface AppUserService {

    public AppUser findByLoginName(String loginName, String appId);

    public UserDto findById(String id);

    public net.sf.json.JSONObject findByIdOrEndUser(String id);

    public List<UserDto> findByIds(List<String> id);

    public AppUser addUser(AppUser userEntity) throws ByteException;

    public boolean updateUser(AppUser userEntity) throws ByteException;

    public boolean deleteUserByPid(String id);

    public boolean delete(String id, int currType) throws ByteException;

    public void deleteByAppId(String id);

    public List<UserOptDto> findAllByUnitId(String appId, String id);

    public boolean batch(List<AppUser> userEntities, String appId) throws ByteException;

    public List<UserOptDto> recursive(String appId, String unitId);

    public boolean sort(String thisId, String nextId) throws ByteException;

    public List<UserOptDto> search(String appId, String name);

    public PageModel endUserList(int start, int count, EndUserfilter endUserfilter, Sort sort) throws ByteException;

    public void updPassword(String userId, String oldPassword, String newPassword) throws ByteException;

    public void updPassword(String userId, String newPassword) throws ByteException;

    public JSONArray findAllByUnitIdTree(String appId, String id);

    public AppUser findAppManager(String appId);

    Map<String,String> listByUserName(String tenantId, String userName);
}
