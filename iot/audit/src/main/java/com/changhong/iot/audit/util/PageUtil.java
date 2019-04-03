package com.changhong.iot.audit.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PageUtil {
    public static Map check(long totalcount, List list){
        Map map = new HashMap();
        if (totalcount == 0) {
            map.put("totalCount",0);
            map.put("value",new ArrayList<>());
        }else{
            map.put("totalCount",totalcount);
            map.put("value",list);
        }
        return map;
    };
}
