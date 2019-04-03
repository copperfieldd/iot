/**
 * Project Name:eoms
 * File Name:InstanceStateImpl.java
 * Package Name:com.changhong.iot.eoms.instance.dao.impl
 * Date:2018年6月6日下午2:08:13
 *
*/

package com.changhong.iot.config.instance.dao.impl;

import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.instance.dao.InstanceStateDao;
import com.changhong.iot.config.instance.entity.ServiceStats;
import org.springframework.stereotype.Repository;

/**
 * ClassName:InstanceStateImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 下午2:08:13 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Repository
public class InstanceStateDaoImpl extends BaseMongoDaoImpl<ServiceStats> implements InstanceStateDao {

	@Override
	protected Class<ServiceStats> getEntityClass() {
		
		// TODO Auto-generated method stub
		return ServiceStats.class;
	}

}

