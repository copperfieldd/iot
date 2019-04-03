/**
 * Project Name:eoms
 * File Name:ConfigFileDaoImpl.java
 * Package Name:com.changhong.iot.eoms.config.dao.impl
 * Date:2018年5月31日上午10:39:14
 *
*/

package com.changhong.iot.config.configfile.dao.impl;
import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.configfile.dao.ConfigFileDao;
import com.changhong.iot.config.configfile.entity.ConfigFiles;
import org.springframework.stereotype.Repository;

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

