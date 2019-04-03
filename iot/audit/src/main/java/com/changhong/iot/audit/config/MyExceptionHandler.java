package com.changhong.iot.audit.config;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice(annotations = {RestController.class})
public class MyExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public Map showException(Exception ex) {
        ex.printStackTrace();
        Map map = new HashMap();
        map.put("status", 1001);
        return map;
    }
}
