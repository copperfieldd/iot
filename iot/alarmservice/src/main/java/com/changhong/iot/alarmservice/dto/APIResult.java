package com.changhong.iot.alarmservice.dto;

import com.sun.corba.se.spi.ior.ObjectKey;

import java.util.HashMap;
import java.util.Map;

public class APIResult {
    public static Map getFailure(int status,String[] value){
        Map map = new HashMap();
        map.put("status",status);
        map.put("value",value);
        return map;
    }
    public static Map getFailure(int status){
        Map map = new HashMap();
        map.put("status",status);
        return map;
    }
    public static Map getSuccess(){
        Map map = new HashMap();
        map.put("status",0);
        return map;
    }
    public static Map getSuccess(Object object){
        Map map = new HashMap();
        map.put("status",0);
        map.put("value",object);
        return map;
    }

}
