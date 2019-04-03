package com.changhong.iot.authenticity;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Authenticity {

    @Autowired
    private MyThreadLocal myThreadLocal;

    @PostMapping("/identity")
    public ServerResponse identity(@RequestHeader("Authorization") String token) throws ByteException {

        if (EmptyUtil.isEmpty(token)) {
            return ServerResponse.createByError(1005);
        }

        if (tokenIsValid()) {
            return ServerResponse.createBySuccess();
        } else {
            return ServerResponse.createByError(1005);
        }
    }

    public boolean tokenIsValid() throws ByteException {

        UserDto user = myThreadLocal.getUser();

        if (user != null && EmptyUtil.isNotEmpty(user.getId())) {
            return true;
        } else {
            return false;
        }
    }

}
