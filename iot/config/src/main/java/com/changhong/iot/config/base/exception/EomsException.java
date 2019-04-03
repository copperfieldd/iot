package com.changhong.iot.config.base.exception;

/**
 * @descpt 后台处理异常
 * @author haocj
 */
public class EomsException extends Exception {

	/** 异常触发类名 */
	protected Class exceptionClass = null;

	protected String message = null;

	public Integer code;

	public EomsException(int id, String message) {
		super(message);
		this.code = id;
		this.message = message;
	}

	/**
	 * 获取 #{bare_field_comment}
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * 设置 #{bare_field_comment}
	 * @param message the message
	 */
	public void setMessage(String message) {
		this.message = message;
	}
	
}
