package com.changhong.iot.common.response;

import com.changhong.iot.common.config.ErrorCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by chenliang on 16-12-2.
 */
@Setter
@Getter
public class ResultData<T> implements Serializable {
    private int status = ErrorCode.SUCCESS;

    private String message = "ok";

    private T value;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}
