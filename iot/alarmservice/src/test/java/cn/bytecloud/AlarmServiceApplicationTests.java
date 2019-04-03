package cn.bytecloud;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.internal.matchers.Find;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.TextScore;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import com.changhong.iot.alarmservice.base.dto.PageModel;
import com.changhong.iot.alarmservice.dao.TAlarmServiceDao;
import com.changhong.iot.alarmservice.dao.TAlarmTypeDao;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.service.TAlarmServiceService;
import com.changhong.iot.alarmservice.service.TAlarmTypeService;

import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AlarmServiceApplicationTests {

    @Test
    public void updateTest() throws Exception {

    }


}
