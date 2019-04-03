package com.changhong.iot.common.utils;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.net.URLDecoder;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: wanghaoyang
 * Date: 2017-12-07
 * Time: 下午1:40
 */
public class EncodeUtil {

    public static String decodeMac(String mac){
        if(mac.contains("%")){
            try {
                mac = URLDecoder.decode(mac, "UTF-8");
            }catch (Exception e){
                System.out.println(e.toString());
            }
        }
        return mac;
    }

    @Override
    public String toString() {
        return super.toString();
    }

        public static String base64Encode(String string) {
        return new BASE64Encoder().encode(string.getBytes());
    }

    public static String base64Decode(String string) throws Exception {
        return new String(new BASE64Decoder().decodeBuffer(string));
    }
}
