package com.changhong.iot.audit.util;

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
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss");
        String s = outFormat.format(now);
        return s;
    }

    public static String getTime(Date date) {
        if (date == null)
            return null;
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String s = outFormat.format(date);
        return s;
    }

    public static String getMonthDate(Date date) {
        if (date == null)
            return null;
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM");
        String s = outFormat.format(date);
        return s;
    }

    public static String getStatisticsTime(Date date) {
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd");
        String s = outFormat.format(date);
        return s;
    }

    public static Date getData(String date) throws ParseException {
        if (EmptyUtil.isEmpty(date))
            return null;
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date parse = outFormat.parse(date);
        return parse;
    }

    public static Date data(String date) throws ParseException {
        if (EmptyUtil.isEmpty(date))
            return null;
        SimpleDateFormat outFormat = new SimpleDateFormat("yyyy/MM/dd");
        Date parse = outFormat.parse(date);
        return parse;
    }

    /**
     * 过滤Emoji表情字符
     *
     * @param source
     * @return
     */
    public static String filterEmoji(String source) {

        if (source != null) {
            Pattern emoji = Pattern.compile("[\ud83c\udc00-\ud83c\udfff]|[\ud83d\udc00-\ud83d\udfff]|[\u2600-\u27ff]", Pattern.UNICODE_CASE | Pattern.CASE_INSENSITIVE);
            Matcher emojiMatcher = emoji.matcher(source);
            if (emojiMatcher.find()) {
                source = emojiMatcher.replaceAll("*");
                return source;
            }
            return source;
        }
        return source;
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
}
