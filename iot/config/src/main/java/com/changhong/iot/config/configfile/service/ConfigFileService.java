/**
 * Project Name:eoms
 * File Name:ConfigFileService.java
 * Package Name:com.changhong.iot.eoms.config.service
 * Date:2018年5月31日上午10:30:16
 *
*/

package com.changhong.iot.config.configfile.service;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.configfile.entity.ConfigFiles;
import com.changhong.iot.config.searchdto.ConfigFilefilter;
import com.changhong.iot.config.searchdto.Sort;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

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

	Map<String, Object> getConfigList(int start, int count, ConfigFilefilter configFilefilter, Sort sort) throws EomsException, ByteException;

	Map<String, Object> saveConfigAdd(String fileName, String serviceName, String id, String content) throws EomsException, Exception;

	void updConifgContent(String id, String content, String fileName, String serviceName) throws EomsException;

	Map<String, Object> configFileDel(String fileId) throws EomsException, Exception;

	InputStream getFileInputStreamById(String id);

	ConfigFiles findFileEntity(String id);

	void initConfigFile();
}

