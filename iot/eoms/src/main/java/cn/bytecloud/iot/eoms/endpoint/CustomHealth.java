/**
 * Project Name:eoms
 * File Name:CustomHealth.java
 * Package Name:cn.bytecloud.iot.eoms.endpoint
 * Date:2018年6月6日下午3:54:52
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.endpoint;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.web.client.RestTemplate;

/**
 * ClassName:CustomHealth <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年6月6日 下午3:54:52 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
public class CustomHealth implements HealthIndicator {

	@Override
	public Health health() {
		try {        
	         RestTemplate restTemplate = new RestTemplate();   
	         restTemplate.getForObject("http://localhost:8080/index",String.class);          
	         return Health.up().build();      
	     }catch (Exception e){      
	      return Health.down().withDetail("down的原因：",e.getMessage()).build();     
	      }
	}

}

