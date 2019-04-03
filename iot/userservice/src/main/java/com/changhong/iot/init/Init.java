package com.changhong.iot.init;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.dao.UserDao;
import com.changhong.iot.entity.UserEntity;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.MD5Util;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.Date;
import java.util.UUID;

@Component
public class Init {

    @Resource
    private UserDao userDao;

    @PostConstruct
    public void init() throws ByteException {

        UserEntity userDto = (UserEntity)userDao.uniqueByProps(
                new String[] {ConfigField.S_LOGIN_NAME, ConfigField.I_DELETE_FLAG},
                new Object[] {"root", ConfigValue.NOT_DELETE});

        if (userDto == null) {

            Date date = new Date();

            System.err.println("系统初始化中！");

            String password = UUID.randomUUID().toString().substring(0, 6);

            UserEntity userEntity = new UserEntity();

            userEntity.setLoginName("root");
            userEntity.setUserName("root");
            userEntity.setPid(ConfigValue.TOP_ID);
            userEntity.setTelephone("");
            userEntity.setRemarks("超级管理员");
            userEntity.setTenantId(ConfigValue.TOP_ID);
            userEntity.setValid(true);
            userEntity.setPassword(MD5Util.MD5EncodeUtf8(password));

            userEntity.setCreateTime(date);
            userEntity.setUpdateTime(date);
            userEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
            userEntity.setSortNum(1);
            userEntity.setIsSystem(true);
            userEntity.setType(ConfigValue.PLATFORM_MANAGER);

            userDao.save(userEntity);

            System.err.println("root:password=" + password);

            System.err.println("系统初始化完毕！");
        }
    }
}
