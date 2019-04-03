package cn.bytecloud.iot.eoms.base.dto;

import java.util.Map;

/**
 * 返回前台成功对象
 * */
public class SuccessResponse extends Response {

	private static final long serialVersionUID = -2395996558104816956L;

	public SuccessResponse() {
		super();
		setSuccessFlag();
	}

	public SuccessResponse(Map<Object, Object> map) {
		super(map);
		setSuccessFlag();
	}

	
}
