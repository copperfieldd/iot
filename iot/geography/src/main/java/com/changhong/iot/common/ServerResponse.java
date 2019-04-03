package com.changhong.iot.common;

import java.io.Serializable;

/**
 * 返回的Json
 */
//@JsonSerialize(include =  JsonSerialize.Inclusion.NON_NULL)
//保证序列化json的时候,如果是null的对象,key也会消失
public class ServerResponse<T> implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int status;
    private String message;
    private T value;

    private ServerResponse(int status){
        this.status = status;
    }
    private ServerResponse(int status,T data){
        this.status = status;
        this.value = data;
    }

    private ServerResponse(int status,String message,T value){
        this.status = status;
        this.message = message;
        this.value = value;
    }

    private ServerResponse(int status,String msg){
        this.status = status;
        this.message = msg;
    }

    public int getStatus(){
        return status;
    }
    public T getValue(){
        return value;
    }
    public String getMessage(){
        return message;
    }


    public static <T> ServerResponse<T> createBySuccess(){
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode());
    }

    public static <T> ServerResponse<T> createBySuccessMessage(String msg){
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),msg);
    }

    public static <T> ServerResponse<T> createBySuccess(T data){
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),data);
    }

    public static <T> ServerResponse<T> createBySuccess(String msg,T data){
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),msg,data);
    }


    public static <T> ServerResponse<T> createByError(){
        return new ServerResponse<T>(ResponseCode.ERROR.getCode(),ResponseCode.ERROR.getDesc());
    }

    public static <T> ServerResponse<T> createByError(int id, Object... value){
        return new ServerResponse<T>(id, (T) value);
    }

    public static <T> ServerResponse<T> createByError(int id, Object value){
        return new ServerResponse<T>(id, (T) value);
    }


    public static <T> ServerResponse<T> createByErrorMessage(String errorMessage){
        return new ServerResponse<T>(ResponseCode.ERROR.getCode(),errorMessage);
    }

    public static <T> ServerResponse<T> createByErrorCodeMessage(int errorCode,String errorMessage){
        return new ServerResponse<T>(errorCode,errorMessage);
    }
}
