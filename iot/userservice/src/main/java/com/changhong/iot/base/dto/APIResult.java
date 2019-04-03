package com.changhong.iot.base.dto;

import java.io.Serializable;

public class APIResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private final static int SUCCESS = 0;
    private final static int FAILURE = 1;

    private int status;
    private String message = "";
    private Object value;


    public static APIResult success() {
        return new APIResult().setStatus(SUCCESS);
    }

    public static APIResult failure() {
        return new APIResult().setStatus(FAILURE);
    }

    public int getStatus() {
        return status;
    }

    public APIResult setStatus(int status) {
        this.status = status;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public APIResult setMessage(String message) {
        this.message = message;
        return this;
    }

	public Object getValue() {
		return value;
	}

	public APIResult setValue(Object value) {
		this.value = value;
		return this;
	}

    public APIResult setValues(Object... value) {
        this.value = value;
        return this;
    }

}
