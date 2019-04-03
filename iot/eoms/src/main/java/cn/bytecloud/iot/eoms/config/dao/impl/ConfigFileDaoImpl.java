/**
 * Project Name:eoms
 * File Name:ConfigFileDaoImpl.java
 * Package Name:cn.bytecloud.iot.eoms.config.dao.impl
 * Date:2018年5月31日上午10:39:14
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.config.dao.impl;

import org.springframework.stereotype.Repository;

import cn.bytecloud.iot.eoms.base.dao.BaseMongoDaoImpl;
import cn.bytecloud.iot.eoms.config.dao.ConfigFileDao;
import cn.bytecloud.iot.eoms.config.entity.ConfigFiles;

/**
 * ClassName:ConfigFileDaoImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年5月31日 上午10:39:14 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Repository
public class ConfigFileDaoImpl extends BaseMongoDaoImpl<ConfigFiles> implements ConfigFileDao {

	@Override
	protected Class<ConfigFiles> getEntityClass() {
		
		// TODO Auto-generated method stub
		return ConfigFiles.class;
	}

	
}

