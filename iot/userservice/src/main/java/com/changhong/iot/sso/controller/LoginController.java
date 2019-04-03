package com.changhong.iot.sso.controller;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.sso.service.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api")
public class LoginController {

	@Resource
	private MyThreadLocal myThreadLocal;

	@Autowired
	private ILoginService loginService;

	@PostMapping(value = "/login")
	public ServerResponse login(@RequestBody String reqBody) throws ByteException {

		JSONObject json = JSONObject.parseObject(reqBody);

		String userName = "";
		String password = "";
		int type;

		if (json.containsKey("username")) {
			userName = json.getString("username");
		} else {
			return ServerResponse.createByError(1009, "username");
		}
		if (json.containsKey("password")) {
			password = json.getString("password");
		} else {
			return ServerResponse.createByError(1009, "password");
		}
		if (json.containsKey("type")) {
			type = json.getIntValue("type");
		} else {
			return ServerResponse.createByError(1009, "type");
		}

		UserDto user = loginService.login(userName, password, type);
		return ServerResponse.createBySuccess(user);
	}

	@PostMapping("/app/login")
	public ServerResponse appEndLogin(@RequestBody String reqBody) throws ByteException {

		JSONObject json = JSONObject.parseObject(reqBody);

		String userName = "";
		String password = "";
		int type = 0;

		if (json.containsKey("username")) {
			userName = json.getString("username");
		} else {
			return ServerResponse.createByError(1009, "username");
		}
		if (json.containsKey("password")) {
			password = json.getString("password");
		} else {
			return ServerResponse.createByError(1009, "password");
		}
		if (json.containsKey("type")) {
			type = json.getIntValue("type");
		} else {
			return ServerResponse.createByError(1009, "type");
		}

		if (type == 1) {
			type = ConfigValue.APPLICATION_USER;
		} else if (type == 2){
			type = ConfigValue.END_USER;
		} else {
			return ServerResponse.createByError(1004, "type");
		}

		UserDto user = loginService.appLogin(userName, password, type, myThreadLocal.getUser().getAppId());
		return ServerResponse.createBySuccess(user);
	}

	@GetMapping(value = "/login/refresh")
	public ServerResponse refresh(){

		loginService.refresh(MyThreadLocal.getToken());

		return ServerResponse.createBySuccess();
	}

	@PostMapping(value = "/logout")
	public APIResult logout(){
		String token = MyThreadLocal.getToken();

		loginService.logout(token);

		return APIResult.success().setMessage("您已成功退出系统！");
	}

	@PostMapping(value = "/password/check")
	public ServerResponse checkPassword(@RequestBody String reqBody) throws ByteException {

		JSONObject json = JSONObject.parseObject(reqBody);

		String userName, password;
		int type;

		if (json.containsKey("username")) {
			userName = json.getString("username");
		} else {
			return ServerResponse.createByError(1009, "username");
		}
		if (json.containsKey("password")) {
			password = json.getString("password");
		} else {
			return ServerResponse.createByError(1009, "password");
		}
		if (json.containsKey("type")) {
			type = json.getIntValue("type");
		} else {
			return ServerResponse.createByError(1009, "type");
		}

		loginService.checkPassword(userName, password, type);
		return ServerResponse.createBySuccess("ok!");
	}


}
