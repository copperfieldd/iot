package com.changhong.iot.alarmservice.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 手机号，邮箱正则匹配
 */
public class MatchUtil {

    /**
     * 手机号码正则匹配
     * @author zhanlang
     */
    public static boolean checkTelephone(String telephone) {
        //正则表达式的模式
        String regex = "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[013678])|(18[0,5-9]))\\d{8}$";
        //正则表达式的匹配器
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(telephone);
        //进行正则匹配
        return m.matches();
    }

    /**
     *邮箱正则匹配
     * @author zhanlang
     */
    public static boolean checkEmail(String email) {
        String regex = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
        return Pattern.matches(regex, email);
    }
}
