/**
 * Project Name:eoms
 * File Name:InstanceStateImpl.java
 * Package Name:cn.bytecloud.iot.eoms.instance.dao.impl
 * Date:2018年6月6日下午2:08:13
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.instance.dao.impl;

import org.springframework.stereotype.Repository;

import cn.bytecloud.iot.eoms.base.dao.BaseMongoDaoImpl;
import cn.bytecloud.iot.eoms.instance.dao.InstanceStateDao;
import cn.bytecloud.iot.eoms.instance.entity.ServiceStats;

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

