package com.changhong.iot.config.util;

import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.security.Timestamp;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtil {

	public static final Logger LOGGER = LoggerFactory.getLogger(StringUtil.class);

	/**
	 * 随机生成指定长度的字符串
	 * 
	 * @param length
	 *            生成字符串的长度
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
	 * @param length
	 *            生成字符串的长度
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
	 * @param length
	 *            生成字符串的长度
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
	 * @param length
	 *            生成字符串的长度
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
	 * @param length
	 *            含有前缀的长度
	 * @param prefix
	 *            前缀
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

	/**
	 * 过滤Emoji表情字符
	 * 
	 * @param source
	 * @return
	 */
	public static String filterEmoji(String source) {

		if (source != null) {
			Pattern emoji = Pattern.compile("[\ud83c\udc00-\ud83c\udfff]|[\ud83d\udc00-\ud83d\udfff]|[\u2600-\u27ff]",
					Pattern.UNICODE_CASE | Pattern.CASE_INSENSITIVE);
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

	private static final long serialVersionUID = 1L;

	public static String nullToEmpty(Object value) {
		if (null == value) {
			return "";
		}
		String tempString = String.valueOf(value);
		if ("null".equalsIgnoreCase(tempString) || "".equals(tempString)) {
			return "";
		}
		return tempString;
	}

	public static String nvl(Object value, String def) {
		if (null == value) {
			return def;
		}
		String tempString = String.valueOf(value);
		if ("null".equalsIgnoreCase(tempString) || "".equals(tempString)) {
			return def;
		}
		return tempString;
	}

	/**
	 * @describe 判断一个字符是否是“是”
	 * @param val
	 * @return
	 */
	public static boolean isTrue(String val) {
		if (isEmpty(val)) {
			return false;
		}
		return "y".equalsIgnoreCase(val) || "true".equalsIgnoreCase(val) || "1".equals(val);
	}

	/**
	 * @describe 字符串转换成longl类型，默认为0
	 * @param value
	 * @return
	 */
	public static long toLong(Object value) {
		return toLong(value, 0);
	}

	/**
	 * @describe 字符串转换成long
	 * @param value
	 *            要转换的值
	 * @param defaultVal
	 *            默认的值，报错的时候返回默认值
	 * @return
	 */
	public static long toLong(Object value, long defaultVal) {
		try {
			return Long.parseLong(nullToEmpty(value));
		} catch (Exception e) {
			return defaultVal;
		}
	}

	public static boolean isEmpty(Object value) {
		String valueString = nullToEmpty(value);
		if ("null".equalsIgnoreCase(valueString) || "".equals(valueString)) {
			return true;
		}
		return false;
	}

	public static boolean isNotEmpty(String value) {
		return !isEmpty(value);
	}

	public static boolean isNotEmpty(Map<?, ?> map) {
		return !(map == null || map.isEmpty());
	}

	public static boolean isNotEmpty(List<?> list) {
		return !(list == null || list.isEmpty());
	}

	/**
	 * @describe 获得一个随机的编码
	 * @return
	 */
	public static String getUUID() {
		String uuid = UUID.randomUUID().toString();
		uuid = uuid.replaceAll("-", "");
		return uuid;// StringUtil.nullToEmpty(UUID.randomUUID().toString());
	}

	public static String formateNum(String valueString) {
		NumberFormat format = new DecimalFormat("#,##0.00");
		BigDecimal bigDecimal = toBigDecimal(valueString);
		return format.format(bigDecimal.doubleValue());
	}

	/**
	 * 格式化金额
	 * 
	 * @param valueString
	 * @return 格式化后的金额（不包含千分位逗号显示，例如：1234.00）
	 */
	public static BigDecimal formateNumToDecimal(String valueString) {
		BigDecimal bigDecimal = toBigDecimal(valueString);
		return bigDecimal;
	}

	public static BigDecimal toBigDecimal(String value) {
		BigDecimal decimal = new BigDecimal(Double.valueOf("0").doubleValue());
		decimal = decimal.setScale(2, 5);
		if (null == value) {
			return decimal;
		}
		if ("null".equalsIgnoreCase(value) || "".equals(value.trim())) {
			return decimal;
		}
		NumberFormat format = new DecimalFormat("0.00");
		BigDecimal bigDecimal = new BigDecimal(Double.valueOf(value).doubleValue());
		BigDecimal res = new BigDecimal(format.format(bigDecimal));
		return res;
	}

	/**
	 * @describe 日期转换成字符串
	 * @param timestamp
	 * @return
	 */
	public static String dateToString(Timestamp timestamp) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");// 定义格式，不显示毫秒
		return df.format(timestamp);
	}

	/**
	 * @describe string字符串转数组
	 * @parms
	 */
	public static String[] stringToArray(String string) {
		if (isEmpty(string))
			return new String[0];
		String[] result = new String[string.length()];
		for (int i = 0; i < string.length(); i++) {
			result[i] = string.substring(i, i + 1);
		}
		return result;
	}

	/**
	 * @describe AREM_HOUSE_COLLECT --> AremHouseCollect
	 * @param originStr
	 * @return
	 */
	public static String getUpperHeadStrNo_(String originStr) {
		String[] chars = StringUtil.stringToArray(originStr);
		StringBuffer target = new StringBuffer();
		for (int j = 0; j < chars.length; j++) {
			if (j == 0) {
				target.append(chars[j].toUpperCase());
			} else {
				if (chars[j - 1].equals("_")) {
					target.append(chars[j].toUpperCase());
				} else if (!chars[j].equals("_"))
					target.append(chars[j].toLowerCase());
			}
		}
		return target.toString();
	}

	/**
	 * @describe AREM_HOUSE_COLLECT --> aremHouseCollect
	 * @param originStr
	 * @return
	 */
	public static String getLowerHeadStrNo_(String originStr) {
		String[] chars = StringUtil.stringToArray(originStr);
		StringBuffer target = new StringBuffer();
		for (int j = 0; j < chars.length; j++) {
			if (j == 0) {
				target.append(chars[j].toLowerCase());
			} else {
				if (chars[j - 1].equals("_")) {
					target.append(chars[j].toUpperCase());
				} else if (!chars[j].equals("_"))
					target.append(chars[j].toLowerCase());
			}
		}
		return target.toString();
	}

	/**
	 * @describe Date类型转字符串
	 * @param date
	 *            java.util.date
	 * @return
	 */
	public static String dateToString(Date date) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");// 定义格式，不显示毫秒
		return df.format(date);
	}

	/**
	 * @author jiangyx
	 * @describe 将长时间格式时间转换为字符串 yyyy-MM-dd HH:mm:ss
	 * @param date
	 *            java.util.date
	 * @return
	 */
	public static String dateToStrLong(Date date) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return df.format(date);
	}

	/**
	 * 
	 * <p>
	 * clean illegal char
	 * </p>
	 * 
	 * @param str
	 *            cleaned object
	 * @return
	 */
	public static String celanIllegalChar(String str) {
		if (str != null) {
			Pattern pattern = Pattern.compile("\\t|\r|\n");
			Matcher m = pattern.matcher(str);
			return m.replaceAll("");
		}
		return str;
	}

	/**
	 * @describe 转驼峰
	 * @param args
	 */
	public static String strTransHump(String str) {

		String[] split = str.split("_");

		StringBuffer buf = new StringBuffer(split[0].toLowerCase());
		for (int i = 1; i < split.length; ++i) {
			buf.append(split[i].substring(0, 1).toUpperCase()).append(split[i].substring(1, split[i].length()).toLowerCase());
		}
		return buf.toString();
	}

	public static void main(String[] args) {
		// long lo = toLong("0");
		// System.out.println(StringUtil.dateToStrLong(new Date()));
		// System.out.println(lo == 0);
		// System.out.println(isEmpty(lo));
		//System.out.println(strTransHump("AAA_BBB_CdD"));
		LOGGER.info("AAA_BBB_CdD");


	}
}
