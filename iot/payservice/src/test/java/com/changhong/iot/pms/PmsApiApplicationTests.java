package com.changhong.iot.pms;

import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PmsApiApplicationTests {

    @Autowired
    MongoTemplate mongoTemplate;

    @Test
    public void contextLoads() {
        ApplicationBean applicationBean = new ApplicationBean();
        applicationBean.setId(UUID.randomUUID().toString());
        applicationBean.setAppId(UUID.randomUUID().toString());
        applicationBean.setAppSecret("654321");
        applicationBean.setAppStatus(0);
        applicationBean.setName("xixi");
        mongoTemplate.save(applicationBean);
    }

}
