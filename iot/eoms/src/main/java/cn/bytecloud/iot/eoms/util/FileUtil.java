package cn.bytecloud.iot.eoms.util;

import java.io.File;

public class FileUtil {

	// 创建目录
 	public static boolean createDir(String destDirName) {
 		File dir = new File(destDirName);
 		if (dir.exists()) {// 判断目录是否存在
 			return false;
 		}
 		if (!destDirName.endsWith(File.separator)) {// 结尾是否以"/"结束
 			destDirName = destDirName + File.separator;
 		}
 		if (dir.mkdirs()) {// 创建目标目录
 			return true;
 		} else {
 			return false;
 		}
 	}
}
