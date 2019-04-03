package com.changhong.iot.stats.util;

import com.google.common.base.Strings;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil {

    /**
     * @param date java.util.date
     * @return
     * @author jiangyx
     * @describe 将长时间格式时间转换为字符串 yyyy-MM-dd HH:mm:ss
     */
    public static String dateToStrLong(Date date) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return df.format(date);
    }
	
	/**
     * 随机生成指定长度的字符串
     * 
     * @param length 生成字符串的长度
     * @return
     */
    public static String getRandomUpperString(int length) {
        String base = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
    
    /**
     * 随机生成指定长度的字符串
     * 
     * @param length 生成字符串的长度
     * @return
     */
    public static String getRandomString(int length) {
        String base = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
    
    /**
     * 随机生成指定长度的字符串
     * 
     * @param length 生成字符串的长度
     * @return
     */
    public static String getRandomInteger(int length) {
        String base = "0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
    
    
    /**
     * 随机生成指定长度的字符串
     * 
     * @param length 生成字符串的长度
     * @return
     */
    public static String getRandomString(String seeds, int length) {

        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(seeds.length());
            sb.append(seeds.charAt(number));
        }
        return sb.toString();
    }

    /**
     * 随机生成带有指定前缀的字符串
     * 
     * @param length 含有前缀的长度
     * @param prefix 前缀
     * @return
     */
    public static String getRandomString(int length, String prefix) {
        int len = length - prefix.length();
        if (len > 0) {
            return prefix + getRandomString(len);
        } else {
            return getRandomString(length);
        }
    }
    
    

    /**
     * 获取当前时间 yyyyMMddHHmmss
     * 
     * @return String
     */
    public static String getCurrTime() {
        Date now = new Date();
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String s = outFormat.format(now);
        return s;
    }

    
    

    
    
    public static Integer parseInt(String source) {
    	
    	if (!Strings.isNullOrEmpty(source)) {
    		if (source.contains(".")) {
    			return Integer.valueOf(source.split("\\.")[0]);
    		} else {
    			return Integer.valueOf(source);
    		}
    	}
    	
    	return null;
    }
    
    public static String prefixZero(String source) {
    	
    	if (source.length() == 1) {
    		return "0" + source;
    	}
    	
    	return source;
    }

    public static String getTime(Date date) {
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String s = outFormat.format(date);
        return s;
    }

    public static Date getTime(String date) {
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        try {
             Date parse = outFormat.parse(date);
             return parse;
        } catch (ParseException e) {
        }
        return null;
    }

    public static long getDate(String date) {
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd");
        try {
            Date parse = outFormat.parse(date);
            return parse.getTime();
        } catch (ParseException e) {
        }
        return 0;
    }
}
