package cn.bytecloud.iot.eoms.exception;

/**
 * @descpt 后台处理异常
 * @author haocj
 */
public class EomsException extends Exception {

	private static final long serialVersionUID = 1916713150894755377L;

	/** 异常触发类名 */
	protected Class exceptionClass = null;

	protected String message = null;

	public EomsException() {
		super();
	}

	public EomsException(String message, Throwable cause) {
		super(message, cause);
		this.message = message;
	}

	public EomsException(String message) {
		super(message);
		this.message = message;
	}

	public EomsException(Throwable cause) {
		super(cause);
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
