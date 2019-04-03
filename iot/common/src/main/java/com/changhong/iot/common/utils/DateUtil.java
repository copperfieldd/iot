package com.changhong.iot.common.utils;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

    public static final String FORMAT = "yyyy年MM月dd HH:mm:ss";

    public static long getTime() {
        return System.currentTimeMillis() / 1000;
    }

    public static long dateToLong(Date date, String format) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
        String dt = simpleDateFormat.format(date);
        return DateUtil.strToDateLong(dt, format);
    }

    public static String intToDateStr(long time) {
        if (0 == time) return "时间错误";
        Long aLong = time * 1000;
        return dateToStrLong(new Date(aLong));

    }

    /*
     * 返回字符类型的时间
     *
     * @param time
     * @param format
     * @return
     */
    public static String format(long time, String format) {
        SimpleDateFormat s = new SimpleDateFormat(format);
        int len = String.valueOf(time).length();
        if (len == 10) time = time * 1000l;
        return s.format(time);
    }

    /**
     * 格式化当前时间
     *
     * @param format
     * @return
     */
    public static String format(String format) {
        return format(getTime(), format);
    }

    public static String format(long time) {
        return format(time, FORMAT);
    }

    public static long compareWithNow(String dateStr, String dateStr1) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM");
        try {
            String afferentYearMonth = dateStr;
            String nowYearMonth = dateStr1;
            Calendar afferent = Calendar.getInstance();
            Calendar now = Calendar.getInstance();
            afferent.setTime(sdf.parse(afferentYearMonth));
            now.setTime(sdf.parse(nowYearMonth));
            int year = (now.get(Calendar.YEAR) - afferent.get(Calendar.YEAR)) * 12;
            int month = now.get(Calendar.MONTH) - afferent.get(Calendar.MONTH);
            return Math.abs(year + month);
        } catch (ParseException e) {
            return 0;
        }
    }

    /**
     * 获取传入时间的年
     *
     * @param time
     * @return
     */
    public static int getYear(long time) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(time * 1000l);
        return calendar.get(Calendar.YEAR);
    }

    /**
     * 获取传入时间的月
     *
     * @param time
     * @return
     */
    public static int getMonth(long time) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(time * 1000l);
        return calendar.get(Calendar.MONTH);
    }

    /**
     * @param strDate
     * @return Date
     * @author Rita
     * @date 2018年5月13日 下午12:51:15
     * @MethodsName: strToDateLong
     * @Description: 将长时间格式字符串转换为时间 yyyy/MM/dd HH:mm:ss
     */
    public static long strToDateLong(String strDate, String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        ParsePosition pos = new ParsePosition(0);
        Date strtodate = formatter.parse(strDate, pos);
        if (null == strtodate) return -1;
        long time = strtodate.getTime() / 1000;
        return time;
    }

    /**
     * @param strDate
     * @return Date
     * @author Rita
     * @date 2018年5月13日 下午12:51:15
     * @MethodsName: strToDateLong
     * @Description: 将长时间格式字符串转换为时间 yyyy/MM/dd HH:mm:ss
     */
    public static Date strToDateLong(String strDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        ParsePosition pos = new ParsePosition(0);
        Date strtodate = formatter.parse(strDate, pos);
        return strtodate;
    }


    /**
     * @param dateDate
     * @return String
     * @author Rita
     * @date 2018年5月13日 下午1:10:03
     * @MethodsName: dateToStrLong
     * @Description: 将长时间格式时间转换为字符串 yyyy/MM/dd HH:mm:ss
     */
    public static String dateToStrLong(Date dateDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String dateString = formatter.format(dateDate);
        return dateString;
    }


    public static Long arithmetic(long time, int year, int month, int day, char type) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(time * 1000);
        switch (type) {
            case '+':
                calendar.add(Calendar.YEAR, year);
                calendar.add(Calendar.MONTH, month);
                calendar.add(Calendar.DATE, day);
                return (calendar.getTime().getTime() / 1000);
            case '-':
                calendar.add(Calendar.YEAR, -year);
                calendar.add(Calendar.MONTH, -month);
                calendar.add(Calendar.DATE, -day);
                return (calendar.getTimeInMillis() / 1000);
        }
        return 0l;

    }

    /**
     * getFirstDayDateOfMonth:(获取传入日期月份). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static int getMonthOfDate(final String date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(strToDateLong(date));
        return cal.get(Calendar.MONTH) + 1;
    }

    /**
     * @param
     * @return
     */
    public static int getMonthOfDate(final Date date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal.get(Calendar.MONTH) + 1;
    }

    /**
     * @param
     * @return
     */
    public static int getYearOfDate(final Date date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return cal.get(Calendar.YEAR);
    }

    /**
     * @param time 10位
     * @return
     */
    public static int getYearOfDate(final long time) {
        final Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time * 1000L);
        return cal.get(Calendar.YEAR);
    }

    /**
     * @param time 10位
     * @return
     */
    public static int getMonthOfDate(final long time) {
        final Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time * 1000L);
        return cal.get(Calendar.MONTH) + 1;
    }

    /**
     * @param time 10位
     * @return
     */
    public static int getDayOfDate(final long time) {
        final Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time * 1000L);
        return cal.get(Calendar.DATE) + 1;
    }

    /**
     * getFirstDayDateOfMonth:(获取传入日期年份). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static int getYearOfDate(final String date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(strToDateLong(date));
        return cal.get(Calendar.YEAR);
    }

    /**
     * getFirstDayDateOfMonth:(获取传入日期所在月的第一天). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static Date getFirstDayDateOfMonth(final Date date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        final int last = cal.getActualMinimum(Calendar.DAY_OF_MONTH);
        cal.set(Calendar.DAY_OF_MONTH, last);
        return cal.getTime();
    }

    /**
     * getLastDayOfMonth:(获取传入日期所在月的最后一天). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static Date getLastDayOfMonth(final Date date) {
        final Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        final int last = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        cal.set(Calendar.DAY_OF_MONTH, last);
        return cal.getTime();
    }

    /**
     * @author haocj
     * 获取当前年度
     */
    public static int getCurYear() {
        return Calendar.getInstance().get(Calendar.YEAR);

    }

    /**
     * @author haocj
     * 获取当前月份
     */
    public static int getCurMonth() {
        return Calendar.getInstance().get(Calendar.MONTH) + 1;

    }

    //2.0新加时间结构格式化
    public static final String STANDARD_FORMAT = "yyyy-MM-dd HH:mm:ss";


    /**
     * getLastDay:(获取当前时间前一天以24点结束). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static Date getLastDayEnd(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        calendar.set(Calendar.HOUR, 11);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        date = calendar.getTime();
        return date;
    }

    /**
     * 获取任意时间的下一个月
     * 描述:<描述函数实现的功能>.
     *
     * @param repeatDate
     * @return
     */
    public static String getPreMonth(String repeatDate) {
        String lastMonth = "";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dft = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        int year = Integer.parseInt(repeatDate.substring(0, 4));
        String monthsString = repeatDate.substring(5, 7);
        int month;
        if ("0".equals(monthsString.substring(0, 1))) {
            month = Integer.parseInt(monthsString.substring(1, 2));
        } else {
            month = Integer.parseInt(monthsString.substring(0, 2));
        }
        cal.set(year, month, cal.get(cal.DAY_OF_MONTH));
        lastMonth = dft.format(cal.getTime());
        return lastMonth;
    }

    /**
     * 获取任意时间的上一个月
     * 描述:<描述函数实现的功能>.
     *
     * @param repeatDate
     * @return
     */
    public static String getBefMonth(String repeatDate) {
        String lastMonth = "";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dft = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        int year = Integer.parseInt(repeatDate.substring(0, 4));
        String monthsString = repeatDate.substring(5, 7);
        int month;
        if ("0".equals(monthsString.substring(0, 1))) {
            month = Integer.parseInt(monthsString.substring(1, 2));
        } else {
            month = Integer.parseInt(monthsString.substring(0, 2));
        }
        cal.set(year, month - 2, cal.get(cal.DAY_OF_MONTH));
        lastMonth = dft.format(cal.getTime());
        return lastMonth;
    }

    /**
     * 获取某年第一天日期
     *
     * @param year 年份
     * @return Date
     */
    public static Date getYearFirst(int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(Calendar.YEAR, year);
        Date currYearFirst = calendar.getTime();
        return currYearFirst;
    }

    /**
     * 获取某年最后一天日期
     * (也是下一年的第一天)
     *
     * @param year 年份
     * @return Date
     */
    public static Date getYearLast(int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.clear();
        calendar.set(Calendar.YEAR, year);
        calendar.roll(Calendar.DAY_OF_YEAR, -1);
        calendar.set(Calendar.HOUR, 24);
        Date currYearLast = calendar.getTime();

        return currYearLast;
    }


    /**
     * getLastDay:(获取当前时间的上一年). <br/>
     *
     * @param date
     * @return
     * @author haocj
     * @since JDK 1.8
     */
    public static Date getLastYearEnd(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.YEAR, -1);
        date = calendar.getTime();
        return date;
    }

    public static void main(String[] args) {
        System.out.println(dateToStrLong(getLastYearEnd(new Date())));
    }

}
