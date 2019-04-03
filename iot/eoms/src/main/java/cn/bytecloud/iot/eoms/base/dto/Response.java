package cn.bytecloud.iot.eoms.base.dto;

import java.util.HashMap;
import java.util.Map;

import cn.bytecloud.iot.eoms.util.StringUtil;


/**
 * 功能：定义各种通用的常量值、保存各种参数便于前后台交互的各个环节使用
 * 1、保存各工作环境的各种变量值包括
 * 2、定义各种通用变量值
 * @author haocj
 *
 */
public abstract class Response extends HashMap<Object, Object> {

	private static final long serialVersionUID = 47067542629985123L;

	public Response() {
		super();
	}

	public Response(Map<Object, Object> map) {
		super(map);
	}

	/**
	 * 返回前台成功标识
	 */
	private static final int FLAG_SUCCESS = 0;
	
	/**
	 * 返回前台警告标识
	 */
	private static final int FLAG_WARN = -1;
	
	/**
	 * 返回前台失败标识
	 */
	private static final int FLAG_FAIL = 1;
	
	/**
	 * 返回前台数据
	 */
	protected static final String KEY_VALUE = "value";

	/**
	 * 返回前台成功失败标志
	 */
	protected static final String KEY_STATUS = "status";
	
	/**
	 * 返回消息
	 */
	protected static final String KEY_MSG = "message";
	
	/**
	 * 返回状态码
	 */
	protected static final String KEY_CODE="code";
	
	
	
	/** 
	 * 设置成功标志
	 * */
	protected void setSuccessFlag(){
		put(KEY_STATUS, FLAG_SUCCESS);
	}
	
	/**
	 * 设置警告标志
	 * */
	protected void setWarnFlag(){
	  put(KEY_STATUS, FLAG_WARN);
	}
	
	/**
	 * 设置失败标志
	 * */
	protected void setFailFlag(){
		put(KEY_STATUS, FLAG_FAIL);
	}
	
	/**
	 * 设置返回前台消息
	 * */
	public Response setMsg(String msg){
		put(KEY_MSG, msg);
		return this;
	}
	
	/**
	 * 获取返回前台消息
	 * */
	public String getMsg(){
		if(StringUtil.isEmpty(get(KEY_MSG))){
			return null;
		}
		return get(KEY_MSG).toString();
	}
	
	/**
	 * 设置返回前台数据对象
	 * */
	public Response setValue(Object dataObject) {
		put(KEY_VALUE, dataObject);
		return this;
	}
	
	/**
	 * 设置返回前台数据对象
	 * */
	public Object getData() {
		return get(KEY_VALUE);
	}
	
		  
}
