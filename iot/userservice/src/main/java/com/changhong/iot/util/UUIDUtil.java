package com.changhong.iot.util;

import java.util.UUID;

public class UUIDUtil {
    /**
     * 随机生成一个32位的字符串，
     * @return
     */
    public static String getUUID(){
        return UUID.randomUUID().toString();
    }

    /**
     * 随机生成一个32位的字符串去"-"，
     * @return
     */
    public static String getUUIDs(){
        return UUID.randomUUID().toString().replace("-","");
    }


}
