package com.changhong.iot.common.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: chenliang
 * Date: 2017-12-05
 * Time: 下午4:02
 */
public class ThreadObjectHolder {

    private static final ThreadLocal<HashMap<String, Object>> threadLocal = new ThreadLocal<HashMap<String, Object>>();

    public static ThreadLocal<HashMap<String, Object>> getThreadLocal() {
        return threadLocal;
    }

    public static Object getObject(String key){
        Map map = threadLocal.get();
        if (map != null){
            return map.get(key);
        }
        return null;
    }

    public static void setObject(String key, Object object){
        HashMap map = threadLocal.get();
        if (map == null){
            map = new HashMap();
            threadLocal.set(map);
        }
        map.put(key, object);
    }

    public static Object getSetClass(String key, Class clazz){
        Object ob = getObject(key);
        if (ob != null){
            return ob;
        }
        try {
            ob = clazz.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        setObject(key, ob);
        return ob;
    }
}
