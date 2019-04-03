package com.changhong.iot.audit.util;

import java.io.File;

public class FileUtil {

	// 创建目录
 	public static boolean createDir(String destDirName) {
 		File dir = new File(destDirName);
 		if (dir.exists()) {// 判断目录是否存在
 			return false;
 		}

 		if (dir.mkdirs()) {// 创建目标目录
 			return true;
 		} else {
 			return false;
 		}
 	}
}
