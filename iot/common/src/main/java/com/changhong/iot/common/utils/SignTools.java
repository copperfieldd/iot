package com.changhong.iot.common.utils;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.IOUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.util.*;

/**
 * 签名工具类
 *
 * @author John
 */
public class SignTools {

    /**
     * 获取所有参数
     *
     * @return 参数集合
     */
    public static HashMap<String, String> getAllParameter(HttpServletRequest request) {
        try {
            byte[] bytes = IOUtils.readFully(request.getInputStream(), 0, true);
            return JSON.parseObject(bytes, HashMap.class);
        } catch (IOException e) {
            return null;
        }
    }


    public static Boolean checkSign(String sign, String key, HttpServletRequest request) {
        String var1 = makeSign(key, getAllParameter(request));
        return sign.equals(var1);
    }

    /**
     * 验证签名
     *
     * @return 验证结果
     */
    public static Boolean checkSign(String sign, String key, HashMap<String, String> map) {
        String sign1 = makeSign(key, map);
        return sign.equals(sign1);
    }

    /**
     * 生成签名
     *
     * @return 签名
     */
    public static String makeSign(String key, HashMap<String, String> map) {
        List<Map.Entry<String, String>> list = new ArrayList(map.entrySet());
        list.sort(Comparator.comparing(Map.Entry::getKey));
        String var1 = toUrlParams(list) + "&key=" + key;

        return getMD5(var1);
    }

    /**
     * 转为URL参数格式
     *
     * @return 结果
     */
    private static String toUrlParams(List<Map.Entry<String, String>> list) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> map : list) {
            if (!"sign".equals(map.getKey()) && !"_MAC_".equals(map.getKey()) && !"".equals(map.getValue())) {
                sb.append(map.getKey()).append("=").append(String.valueOf(map.getValue())).append("&");
            }
        }
        if (sb.length() > 0) {
            sb.deleteCharAt(sb.length() - 1);
        }
        return sb.toString();
    }

    /**
     * 获取MD5
     *
     * @return 结果
     */
    private static String getMD5(String message) {
        String md5str = "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] input = message.getBytes();
            byte[] buff = md.digest(input);
            md5str = bytesToHex(buff);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return md5str;
    }

    /**
     * 二进制转十六进制
     *
     * @return 结果
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder md5str = new StringBuilder();
        int digital;
        for (byte aByte : bytes) {
            digital = aByte;
            if (digital < 0) {
                digital += 256;
            }
            if (digital < 16) {
                md5str.append("0");
            }
            md5str.append(Integer.toHexString(digital));
        }
        return md5str.toString().toUpperCase();
    }
}
