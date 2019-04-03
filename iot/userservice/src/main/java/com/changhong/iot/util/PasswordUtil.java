package com.changhong.iot.util;

public class PasswordUtil {

    public static String PASSWORD_REGEX = "[\\S]{8,}";

    public static String PASSWORD_NUMBER_REGEX = ".*[\\d]+.*";

    public static String PASSWORD_CHARACTER_REGEX = ".*[a-zA-Z]+.*";

    public static String PASSWORD_SPECIAL_REGEX = ".*[^\\da-zA-Z\\s]+.*";


    /**
     * 验证密码是否符合格式
     * @param
     * @return
     */
    public static boolean passwordVerification(String password) {
        boolean flag = false;

        if (password.matches(PASSWORD_REGEX)) {
            int i = 0;
            if (password.matches(PASSWORD_NUMBER_REGEX)) {
                i++;
            }
            if (password.matches(PASSWORD_CHARACTER_REGEX)) {
                i++;
            }
            if (password.matches(PASSWORD_SPECIAL_REGEX)) {
                i++;
            }
            if (i > 1) {
                flag = true;
            }
        }
        return flag;
    }

    /**
     * 验证密码是否<b>不</b>符合格式
     * @param
     * @return
     */
    public static boolean passwordNotVerification(String password) {
        return !passwordVerification(password);
    }

}
