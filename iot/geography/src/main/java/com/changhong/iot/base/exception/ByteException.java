package com.changhong.iot.base.exception;

public class ByteException extends Exception {

	public Integer id;
	
	public String msg;

	public Object value;
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ByteException(Integer ErrID, Object... value) {
		id = ErrID;
		this.value = value;
		this.printStackTrace();
	}

	public static StringBuffer getTraceInfo(Exception e) {  
		StringBuffer sb = new StringBuffer();  
		StackTraceElement[] stacks = e.getStackTrace();  
		for (int i = 0; i < stacks.length; i++) {  
			if (stacks[i].getClassName().contains("com.changhong.iot.oa")) {
				sb.append("class: ").append(stacks[i].getClassName())  
				.append("; method: ").append(stacks[i].getMethodName())  
				.append("; line: ").append(stacks[i].getLineNumber())  
				.append(";  Exception: ");  
				break;  
		   }  
		}  
		
		return sb;  
	} 
	
	public static final StackTraceElement getStackElement(int index) {
		
		StackTraceElement[] st = new Throwable().getStackTrace();
		return st[index];
	}
	
}
