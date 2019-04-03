package com.changhong.iot.audit.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;

import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.map.annotate.JsonSerialize;

/**
 * 返回的Json
 */
@JsonSerialize(include =  JsonSerialize.Inclusion.NON_NULL)
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

    @JsonIgnore
    //使之不在json序列化结果当中
    public boolean isSuccess(){
        return this.status == ResponseCode.SUCCESS.getCode();
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


    public static <T> ServerResponse<T> createByErrorMessage(String errorMessage){
        return new ServerResponse<T>(ResponseCode.ERROR.getCode(),errorMessage);
    }

    public static <T> ServerResponse<T> createByErrorCodeMessage(int errorCode,String errorMessage){
        return new ServerResponse<T>(errorCode,errorMessage);
    }

    public static void writeBySuccess(String message, String content, HttpServletResponse res) {
        
        String result = "{\"status\":"+ResponseCode.SUCCESS.getCode()+",\"message\":\""+message+"\",\"value\":"+content+"}";
        
        res.setContentType("application/json; charset=UTF-8");
        try {
            
            PrintWriter write = res.getWriter();
            
            write.write(result);
            write.flush();
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }
    
    public static void writeByError(int code, String message, HttpServletResponse res) {
            
            String result = "{\"status\":"+code+",\"message\":\""+message+"\",\"value\":\"\"}";
            
            res.setContentType("application/json; charset=UTF-8");
            try {
                
                PrintWriter write = res.getWriter();
                
                write.write(result);
                write.flush();
                
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            
        }
        
    }
