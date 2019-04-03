package com.changhong.iot.config.util;

import java.util.List;
import java.util.Map;

public class EmptyUtil {

	public static boolean isEmpty(String str) {
		return str == null || str.equals("") || str.trim().equals("") || str.length() <= 0;
	}

	public static <T> boolean isEmpty(List<T> list) {
		return list == null || list.isEmpty();
	}

	public static <K, V> boolean isEmpty(Map<K, V> map) {
		return map == null || map.isEmpty();
	}

	public static <T> boolean isEmpty(T[] array) {
		return array == null || array.length == 0;
	}

	public static boolean isNotEmpty(String str) {
		return !isEmpty(str);
	}

	public static <T> boolean isNotEmpty(List<T> list) {
		return !isEmpty(list);
	}

	public static <K, V> boolean isNotEmpty(Map<K, V> map) {
		return !isEmpty(map);
	}

	public static <T> boolean isNotEmpty(T[] array) {
		return !isEmpty(array);
	}
}
