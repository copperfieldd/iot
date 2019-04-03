package com.changhong.iot.util;

import com.google.common.base.Strings;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DateUtil {

	/**
	 * 将长时间格式字符串转换为时间 yyyy/MM/dd HH:mm:ss
	 * @param strDate
	 * @return Date
	 */
	public static Date strToDateLong(String strDate) {
		return strToDate(strDate, "yyyy/MM/dd HH:mm:ss");
	}
	/**
	 * 将长时间格式字符串转换为时间 yyyy-MM-dd HH:mm:ss
	 * @param strDate
	 * @return Date
	 */
	public static Date strToDateLong1(String strDate) {
		return strToDate(strDate, "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 * 将长时间格式字符串转换为时间 yyyy/MM/dd
	 * @param strDate
	 * @return Date
	 */
	public static Date strToDateShort(String strDate) {
		return strToDate(strDate, "yyyy/MM/dd");
	}

	/**
	 * 将长时间格式字符串转换为时间 yyyy-MM-dd
	 * @param strDate
	 * @return Date
	 */
	public static Date strToDateShort1(String strDate) {
		return strToDate(strDate, "yyyy-MM-dd");
	}

	private static Date strToDate(String date, String pattern) {
		SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		ParsePosition pos = new ParsePosition(0);
		Date strtodate = formatter.parse(date, pos);
		return strtodate;
	}

	/**
	 * 将长时间格式时间转换为字符串 yyyy/MM/dd HH:mm:ss
	 * @param dateDate
	 * @return String
	 */
	public static String dateToStrLong(Date dateDate) {
		return dateToStr(dateDate, "yyyy/MM/dd HH:mm:ss");
	}

	/**
	 * 将长时间格式时间转换为字符串 yyyy-MM-dd HH:mm:ss
	 * @param dateDate
	 * @return String
	 */
	public static String dateToStrLong1(Date dateDate) {
		return dateToStr(dateDate, "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 *  将长时间格式时间转换为字符串 yyyy/MM/dd
	 * @param dateDate
	 * @return String
	 */
	public static String dateToStrShort(Date dateDate) {
		return dateToStr(dateDate, "yyyy/MM/dd");
	}

	/**
	 *  将长时间格式时间转换为字符串 yyyy-MM-dd
	 * @param dateDate
	 * @return String
	 */
	public static String dateToStrShort1(Date dateDate) {
		return dateToStr(dateDate, "yyyy-MM-dd");
	}

	private static String dateToStr(Date dateDate, String pattern) {
		if (dateDate == null) {
			return "";
		}
		SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		String dateString = formatter.format(dateDate);
		return dateString;
	}

	/**
	 * 获取传入日期月份
	 * @param date
	 * @return
	 */
	public static int getMonthOfDate(final String date) {
		final Calendar cal = Calendar.getInstance();
		cal.setTime(strToDateLong(date));
		return cal.get(Calendar.MONTH) + 1;
	}

	/**
	 * 获取传入日期年份
	 * @param date
	 * @return
	 */
	public static int getYearOfDate(final String date) {
		final Calendar cal = Calendar.getInstance();
		cal.setTime(strToDateLong(date));
		return cal.get(Calendar.YEAR);
	}

	/**
	 * 获取传入日期所在月的第一天
	 * @param date
	 * @return
	 */
	public static Date getFirstDayDateOfMonth(final Date date) {
		final Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		final int last = cal.getActualMinimum(Calendar.DAY_OF_MONTH);
		cal.set(Calendar.DAY_OF_MONTH, last);
		return cal.getTime();
	}

	/**
	 * 获取传入日期所在月的最后一天
	 * @param date
	 * @return
	 */
	public static Date getLastDayOfMonth(final Date date) {
		final Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		final int last = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		cal.set(Calendar.DAY_OF_MONTH, last);
		return cal.getTime();
	}

	/**
	 * 获取当前年度
	 */
	public static int getCurYear(){
		return Calendar.getInstance().get(Calendar.YEAR);

	}

	/**
	 * 获取当前月份
	 */
	public static int getCurMonth(){
		return Calendar.getInstance().get(Calendar.MONTH) + 1;

	}

	/**
	 * 获取上一个月
	 */
	public static int getLastMonth() {
		Calendar cal = Calendar.getInstance();
		cal.add(cal.MONTH, -1);
		SimpleDateFormat dft = new SimpleDateFormat("yyyyMM");
		Integer lastMonth = Integer.valueOf(dft.format(cal.getTime()));
		return lastMonth;
	}

	public static boolean isValidDateTime(String time) {

		if (Strings.isNullOrEmpty(time)) {
			return false;
		}

		// 指定好一个日期格式的字符串
		String pat = "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(time) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{4}/\\d{2}/\\d{2} \\d{2}:\\d{2}:\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(time);

			if (m.matches()) {
				return true;
			}
		}

		return false;
	}


	public static boolean isValidTime(String time) {

		if (Strings.isNullOrEmpty(time)) {
			return false;
		}

		// 指定好一个日期格式的字符串
		String pat = "\\d{2}:\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(time) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{2}:\\d{2}:\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(time);

			if (m.matches()) {
				return true;
			}
		}

		return false;
	}

	public static boolean isValidDate(String date) {

		if (Strings.isNullOrEmpty(date)) {
			return false;
		}

		// 指定好一个日期格式的字符串
		String pat = "\\d{4}-\\d{2}-\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(date) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{4}/\\d{2}/\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(date);

			if (m.matches()) {
				return true;
			}
		}

		return false;
	}


	public static String toTimeStampFormat(String time) {

		return time.replaceAll("/", "-");

	}


	public static String toDateFormat(String date) {

		return date.replaceAll("/", "-");

	}


	public static int compareDays(Date date1,Date date2) {
		int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
		return days;
	}

	/**
	 * getLastDay:(获取当前时间前一天从0点开始). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayStart(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, -1);    //得到前一天
		return strToDateShort(dateToStrShort(calendar.getTime()));
	}

	/**
	 * getLastDay:(获取当前时间前一天以24点结束). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, -1);
		calendar.set(Calendar.HOUR,11);
		calendar.set(Calendar.MINUTE,59);
		calendar.set(Calendar.SECOND,59);
		calendar.set(Calendar.MILLISECOND,999);
		date = calendar.getTime();
		return date;
	}

	/**
	 * 获取任意时间的下一个月
	 * 描述:<描述函数实现的功能>.
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
		cal.set(year,month,cal.get(cal.DAY_OF_MONTH));
		lastMonth = dft.format(cal.getTime());
		return lastMonth;
	}

	/**
	 * 获取任意时间的上一个月
	 * 描述:<描述函数实现的功能>.
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
		cal.set(year,month-2,cal.get(cal.DAY_OF_MONTH));
		lastMonth = dft.format(cal.getTime());
		return lastMonth;
	}

	/**
	 * 获取某年第一天日期
	 * @param year 年份
	 * @return Date
	 */
	public static Date getYearFirst(int year){
		Calendar calendar = Calendar.getInstance();
		calendar.clear();
		calendar.set(Calendar.YEAR, year);
		Date currYearFirst = calendar.getTime();
		return currYearFirst;
	}

	/**
	 * 获取某年最后一天日期
	 * (也是下一年的第一天)
	 * @param year 年份
	 * @return Date
	 */
	public static Date getYearLast(int year){
		Calendar calendar = Calendar.getInstance();
		calendar.clear();
		calendar.set(Calendar.YEAR, year);
		calendar.roll(Calendar.DAY_OF_YEAR, -1);
		calendar.set(Calendar.HOUR,24);
		Date currYearLast = calendar.getTime();

		return currYearLast;
	}


	/**
	 * getLastDay:(获取当前时间的上一年). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastYearEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.YEAR, -1);
		date = calendar.getTime();
		return date;
	}

}
