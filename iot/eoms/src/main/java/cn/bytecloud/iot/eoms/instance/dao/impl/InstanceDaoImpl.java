/**
 * Project Name:eoms
 * File Name:InstanceDaoImpl.java
 * Package Name:cn.bytecloud.iot.eoms.instance.dao.impl
 * Date:2018年6月6日上午11:06:37
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.dao.impl;

import org.springframework.stereotype.Repository;

import cn.bytecloud.iot.eoms.base.dao.BaseMongoDaoImpl;
import cn.bytecloud.iot.eoms.instance.dao.InstanceDao;
import cn.bytecloud.iot.eoms.instance.entity.ServiceInstances;

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
public class InstanceDaoImpl extends BaseMongoDaoImpl<ServiceInstances> implements InstanceDao {

	@Override
	protected Class<ServiceInstances> getEntityClass() {
		
		// TODO Auto-generated method stub
		return ServiceInstances.class;
	}

}

