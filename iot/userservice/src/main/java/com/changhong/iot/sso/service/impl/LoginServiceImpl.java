package com.changhong.iot.sso.service.impl;

import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.UserEntity;
import com.changhong.iot.sso.service.ILoginService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.JsonUtil;
import com.changhong.iot.util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class LoginServiceImpl implements ILoginService {
	
    @Autowired
    private RedisTemplate redisTemplate;

	@Autowired
	private MongoTemplate mongoTemplate;

	@Autowired
	private MyThreadLocal myThreadLocal;
    
    @Override
    public UserDto login(String loginName, String password, int type) throws ByteException {

		if (EmptyUtil.isEmpty(loginName)) {
			throw new ByteException(1009, "loginName");
		}
		if (EmptyUtil.isEmpty(password)) {
			throw new ByteException(1009, "password");
		}

		Query query = new Query();
		query.addCriteria(Criteria.where(ConfigField.S_LOGIN_NAME).is(loginName));
		query.addCriteria(Criteria.where(ConfigField.I_DELETE_FLAG).is(ConfigValue.NOT_DELETE));
		query.addCriteria(Criteria.where("type").is(type));

		UserEntity entity = null;
		AppUser appUser = null;

		if (ConfigValue.APPLICATION_MANAGER == type) {
			appUser = mongoTemplate.findOne(query, AppUser.class);
		} else {
			entity = mongoTemplate.findOne(query, UserEntity.class);
		}

		String md5Password = null;
		UserDto userDto = null;

		if (entity == null) {
			if (appUser == null) {
				throw new ByteException(1002);
			} else {
				md5Password = appUser.getPassword();
				userDto = (UserDto) EntityUtil.entityToDto(appUser, UserDto.class);
			}
		} else {
			md5Password = entity.getPassword();
			userDto = (UserDto) EntityUtil.entityToDto(entity, UserDto.class);
		}

		if (md5Password.equals(MD5Util.MD5EncodeUtf8(password))) {

			String token = UUID.randomUUID().toString().replace("-","");

			userDto.setToken(token);

			redisTemplate.boundValueOps(token).set(JsonUtil.obj2String(userDto), 60*8, TimeUnit.MINUTES);

			return userDto;
		} else {
			throw new ByteException(1002);
		}
    }

	@Override
	public UserDto appLogin(String loginName, String password, int type, String appId) throws ByteException {

    	if (EmptyUtil.isEmpty(loginName)) {
			throw new ByteException(1009, "loginName");
		}
		if (EmptyUtil.isEmpty(password)) {
			throw new ByteException(1009, "password");
		}

		Query query = new Query();
		query.addCriteria(Criteria.where(ConfigField.S_LOGIN_NAME).is(loginName));
		query.addCriteria(Criteria.where(ConfigField.I_DELETE_FLAG).is(ConfigValue.NOT_DELETE));
		query.addCriteria(Criteria.where("appId").is(appId));
		query.addCriteria(Criteria.where("type").is(type));

		AppUser appUser = mongoTemplate.findOne(query, AppUser.class);

		String md5Password = null;
		UserDto userDto = null;

		if (appUser == null) {
			throw new ByteException(1002);
		} else {
			md5Password = appUser.getPassword();
			userDto = (UserDto) EntityUtil.entityToDto(appUser, UserDto.class);
		}

		if (md5Password.equals(MD5Util.MD5EncodeUtf8(password))) {

			String token = UUID.randomUUID().toString().replace("-","");

			userDto.setToken(token);

			redisTemplate.boundValueOps(token).set(JsonUtil.obj2String(userDto), 60*8, TimeUnit.MINUTES);

			return userDto;
		} else {
			throw new ByteException(1002);
		}
	}

	@Override
	public void logout(String token) {

		redisTemplate.delete(token);
	}

	@Override
	public void refresh(String token) {
		redisTemplate.boundValueOps(token).expire(60*8, TimeUnit.MINUTES);
	}

	@Override
	public void checkPassword(String userName, String password, int type) throws ByteException {

    	boolean flag = true;

		switch (type) {
			case 0 :
				if (!myThreadLocal.isPlatformManager()) {
					throw new ByteException(1006);
				}
				break;
			case 1 :
			case 2 :
				if (!myThreadLocal.isPlatformManager() && !myThreadLocal.isTenantManager()) {
					throw new ByteException(1006);
				}
				break;
			case 3 :
			case 4 :
			case 5 :
				if (!myThreadLocal.isPlatformManager() && !myThreadLocal.isTenantManager() && !myThreadLocal.isAppManager()) {
					throw new ByteException(1006);
				}
				flag = false;
				break;
			default : throw new ByteException(1004);
		}

		Query query = new Query();
		query.addCriteria(Criteria.where(ConfigField.S_LOGIN_NAME).is(userName));
		query.addCriteria(Criteria.where(ConfigField.I_DELETE_FLAG).is(ConfigValue.NOT_DELETE));
		query.addCriteria(Criteria.where("type").is(type));

		UserEntity userEntity = null;
		AppUser appUser = null;
		String md5Password;

		if (flag) {
			userEntity = mongoTemplate.findOne(query, UserEntity.class);
		} else {
			appUser = mongoTemplate.findOne(query, AppUser.class);
		}

		if (userEntity == null) {
			if (appUser == null) {
				throw new ByteException(1002);
			} else {
				md5Password = appUser.getPassword();
			}
		} else {
			md5Password = userEntity.getPassword();
		}

		if (!md5Password.equals(MD5Util.MD5EncodeUtf8(password))) {
			throw new ByteException(1002);
		}

	}

}
