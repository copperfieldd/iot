/**
 * Project Name:eoms
 * File Name:CustomMetrics.java
 * Package Name:cn.bytecloud.iot.eoms.endpoint
 * Date:2018年6月6日下午3:51:24
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.endpoint;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.PublicMetrics;
import org.springframework.boot.actuate.metrics.Metric;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import cn.bytecloud.iot.eoms.instance.controller.ServiceInstanceController;

/**
 * ClassName:CustomMetrics <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 下午3:51:24 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Component
public class CustomMetrics implements PublicMetrics {
	
	private ApplicationContext applicationContext;
	
    @Autowired
    public CustomMetrics(ApplicationContext applicationContext) {       
       this.applicationContext = applicationContext;   
    }

	@Override
	public Collection<Metric<?>> metrics() {
		List<Metric<?>> metrics = new ArrayList<Metric<?>>();
        
		metrics.add(new Metric<Long>("spring.startup-date",applicationContext.getStartupDate()));
        metrics.add(new Metric<Integer>("spring.bean.definitions",applicationContext.getBeanDefinitionCount()));
        metrics.add(new Metric<Integer>("spring.beans",applicationContext.getBeanNamesForType(Object.class).length));
        metrics.add(new Metric<Integer>("spring.controllers",applicationContext.getBeanNamesForAnnotation((Class<? extends Annotation>) ServiceInstanceController.class).length));      
        
        return metrics;
	}

}

