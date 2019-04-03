package com.changhong.iot.alarmservice.system;

import javax.xml.stream.events.StartDocument;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 用map做缓存
 */
public class Cache {
    public static final Map map = new ConcurrentHashMap();
}
