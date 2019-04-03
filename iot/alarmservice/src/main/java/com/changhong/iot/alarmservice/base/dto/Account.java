package com.changhong.iot.alarmservice.base.dto;

import java.io.Serializable;

public class Account implements Serializable {
private static final long serialVersionUID = 1L;

    private String username;
    
    private String password;
    
    private String mobile;

    private Long userId;


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}

	
	public Long getUserId() {
		return userId;
	}


	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getMobile() {
		return mobile;
	}


	public void setMobile(String mobile) {
		this.mobile = mobile;
	}


}
