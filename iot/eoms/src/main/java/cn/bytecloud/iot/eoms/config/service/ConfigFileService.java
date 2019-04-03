/**
 * Project Name:eoms
 * File Name:ConfigFileService.java
 * Package Name:cn.bytecloud.iot.eoms.config.service
 * Date:2018年5月31日上午10:30:16
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.config.service;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

import cn.bytecloud.iot.eoms.config.entity.ConfigFiles;
import cn.bytecloud.iot.eoms.exception.EomsException;

/**
 * ClassName:ConfigFileService <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年5月31日 上午10:30:16 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
public interface ConfigFileService {

	Map<String, Object> getConfigList(String start, String count) throws EomsException;

	Map<String, Object> saveConfigAdd(InputStream inputStream, String originalFilename, String serviceName, String addType) throws EomsException, Exception;

	Map<String, Object> configFileDel(String fileId) throws EomsException, Exception;

	InputStream getFileInputStreamById(String id);

	ConfigFiles findFileEntity(String id);

	void initConfigFile() throws FileNotFoundException;
}

