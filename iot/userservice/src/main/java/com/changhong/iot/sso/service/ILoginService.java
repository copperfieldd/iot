package com.changhong.iot.sso.service;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UserDto;

public interface ILoginService {

    public UserDto login(String loginName, String password, int type) throws ByteException;

    public UserDto appLogin(String loginName, String password, int type, String appId) throws ByteException;

    public void logout(String token);

    public void refresh(String token);

    void checkPassword(String userName, String password, int type) throws ByteException;
}
