package com.changhong.iot.util;//package com.changhong.iot.util;//package com.changhong.iot.util;
//
//import com.changhong.iot.constant.SystemConstant;
//
//import java.io.File;
//
//
//public class DirectoryUtil {
//
//	public static String getProjectDir() {
//
//		// 文件保存路径
//        String curDir = Thread.currentThread().getContextClassLoader().getResource("/").getPath();
//
//        curDir = curDir.replace("/WEB-INF/classes/", "");
//        curDir = curDir.substring(0, curDir.lastIndexOf("/"));
//
//        return curDir;
//
//	}
//
//
//	public static String getExportDir() {
//
//		return getProjectDir() + SystemConstant.FILE_EXPORT_PATH + File.separator;
//
//	}
//
//}
