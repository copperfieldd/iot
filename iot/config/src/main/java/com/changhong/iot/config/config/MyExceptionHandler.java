package com.changhong.iot.config.config;//package com.changhong.iot.config;

import com.changhong.iot.config.base.exception.ByteException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class MyExceptionHandler extends ResponseEntityExceptionHandler {

    public static final Logger LOGGER = LoggerFactory.getLogger(MyExceptionHandler.class);

//    @ExceptionHandler(RuntimeException.class)
//    @ResponseBody
//    public Map showException(RuntimeException e) {
//        Map map = new HashMap();
//        map.put("status", "500");
//        map.put("message", "系统忙");
//        map.put("vale", null);
//        return map;
//    }

    @ExceptionHandler(ByteException.class)
    @ResponseBody
    public Map byteException(ByteException e){
        e.printStackTrace();
        Map map = new HashMap();
        map.put("status", e.id);
        map.put("message", e.msg);
        map.put("value", e.value);
        return map;
    }


}
