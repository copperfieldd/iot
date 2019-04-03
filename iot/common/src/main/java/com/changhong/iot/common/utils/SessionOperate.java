package com.changhong.iot.common.utils;

import javax.servlet.http.HttpSession;

/**
 * Created by liangchen on 16/12/3.
 */
public class SessionOperate {
    private static final int MAX_CODE_VERIFY_COUNT = 4;

    private static String getSessionCodeName(String phone){
        return "phone_" + phone + "code";
    }
    private static String getSessionCountName(String phone){
        return "phone_" + phone + "count";
    }
    private static String getSessionCheckCodeName(String phone){

        return "phone_" + phone + "check";
    }

    public static void writeSmsCode(HttpSession session, String phone, String code){
        session.setAttribute(getSessionCodeName(phone), code);
        session.setAttribute(getSessionCountName(phone), 0);
    }

    public static String readSmsCode(HttpSession session, String phone){
        String sessionCode = (String)session.getAttribute(getSessionCodeName(phone));
        Integer verifyCount = (Integer) session.getAttribute(getSessionCountName(phone));
        if(sessionCode == null || verifyCount == null){
            return null;
        }
        verifyCount++;
        if (verifyCount <= MAX_CODE_VERIFY_COUNT) {
            session.setAttribute(getSessionCountName(phone), verifyCount);
        }else {
            session.removeAttribute(getSessionCodeName(phone));
            session.removeAttribute(getSessionCountName(phone));
            sessionCode = null;
        }
        return sessionCode;
    }

    public static void deleteSmsCode(HttpSession session, String phone){
        session.removeAttribute(getSessionCodeName(phone));
        session.removeAttribute(getSessionCountName(phone));
    }

    public static void setCheckSms(HttpSession session, String phone){
        Integer count = (Integer) session.getAttribute(getSessionCheckCodeName(phone));
        if (count == null){
            count = 0;
        }
        session.setAttribute(getSessionCheckCodeName(phone), ++count);
    }

    public static boolean needCheckSms(HttpSession session, String phone){
        Integer check = (Integer) session.getAttribute(getSessionCheckCodeName(phone));
        if (check == null){
            return false;
        }
        return check > 3;
    }
}
