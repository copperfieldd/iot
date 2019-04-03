/**
 * Project Name:eoms
 * File Name:InstanceDaoImpl.java
 * Package Name:com.changhong.iot.eoms.instance.dao.impl
 * Date:2018年6月6日上午11:06:37
 *
*/

package com.changhong.iot.config.instance.dao.impl;


import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.instance.dao.InstanceDao;
import com.changhong.iot.config.instance.entity.ServiceInstances;
import org.springframework.stereotype.Repository;

/**
 * ClassName:InstanceDaoImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 上午11:06:37 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Repository
public class InstanceDaoImpl extends BaseMongoDaoImpl implements InstanceDao {

	@Override
	protected Class<ServiceInstances> getEntityClass() {
		
		// TODO Auto-generated method stub
		return ServiceInstances.class;
	}

}

