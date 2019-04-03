package com.changhong.iot.statistics;

import com.changhong.iot.application.entity.AppUser;
import com.changhong.iot.application.entity.ApplicationEntity;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.entity.TenantEntity;
import com.changhong.iot.sso.service.ILoginService;
import com.changhong.iot.util.DateUtil;
import com.mongodb.MongoClient;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Component
public class Statistics {

    public static final Logger LOGGER = LoggerFactory.getLogger(Statistics.class);

    @Resource
    public MongoTemplate mongoTemplate;

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private ILoginService iLoginService;

    @Value("${statistics.loginName}")
    private String statisticsLoginName;

    @Value("${statistics.password}")
    private String statisticsPassword;

    @Value("${statistics.serviceKey}")
    private String statisticsServiceKey;

    @Value("${statistics.collection}")
    private String statisticsCollection;

    @Scheduled(cron = "0 0 2 * * ?")
    public void statistics() {

        try {

            String token = iLoginService.login(statisticsLoginName, statisticsPassword, 0).getToken();

            JSONObject object = statisticsTenant();
            object.put("tenantAppSum", statisticsApp());
            object.put("clientUserSum", statisticsEndUser());

            JSONObject data = new JSONObject();
            data.put("domain", statisticsCollection);
            data.put("collection", statisticsCollection);
            data.put("reportTime", System.currentTimeMillis()/1000);
            data.put("data", object);

            ServerResponse response = statisticsService.datareport(data, token);

            System.out.println(response);

            LOGGER.info("用户服务数据上报：" + data.toString());
        } catch (ByteException e) {
            LOGGER.info("用户服务数据上报：" + e.msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JSONObject statisticsTenant() {

        Date date = new Date();
        Date startDate = DateUtil.getLastDayStart(date);
        Date endDate = DateUtil.strToDateShort(DateUtil.dateToStrShort(date));

        Query query = Query.query(Criteria.where("createTime").gte(startDate).lt(endDate));
        query.addCriteria(Criteria.where("deleteFlag").is(0));

        long newCount = mongoTemplate.count(query, TenantEntity.class);

        query = new Query();
        query.addCriteria(Criteria.where("deleteFlag").is(0));
        query.addCriteria(Criteria.where("createTime").lt(endDate));

        long totalCount = mongoTemplate.count(query, TenantEntity.class);

        JSONObject object = new JSONObject();
        object.put("newTenantSum", newCount);
        object.put("tenantSum", totalCount);

        return object;
    }

    public JSONArray statisticsApp() {

        JSONArray array = new JSONArray();
        JSONObject object = null;

        Date date = new Date();
        Date startDate = DateUtil.getLastDayStart(date);
        Date endDate = DateUtil.strToDateShort(DateUtil.dateToStrShort(date));

        Query totalQuery = new Query();
        totalQuery.addCriteria(Criteria.where("deleteFlag").is(0));
        totalQuery.addCriteria(Criteria.where("createTime").lt(endDate));

        List<TenantEntity> entities = mongoTemplate.find(totalQuery, TenantEntity.class);

        for (TenantEntity tenantEntity : entities) {

            Query query = new Query();
            query.addCriteria(Criteria.where("createTime").gte(startDate).lt(endDate));
            query.addCriteria(Criteria.where("deleteFlag").is(0));
            query.addCriteria(Criteria.where("tenantId").is(tenantEntity.getId()));

            long newCount = mongoTemplate.count(query, ApplicationEntity.class);

            Query query1 = new Query();
            query1.addCriteria(Criteria.where("deleteFlag").is(0));
            query1.addCriteria(Criteria.where("createTime").lt(endDate));
            query1.addCriteria(Criteria.where("tenantId").is(tenantEntity.getId()));

            long totalCount = mongoTemplate.count(query1, ApplicationEntity.class);

            object = new JSONObject();
            object.put("tenantId", tenantEntity.getId());
            object.put("appSum", totalCount);
            object.put("newAppSum", newCount);

            array.add(object);
        }

        return array;
    }

    public JSONArray statisticsEndUser() {

        JSONArray array = new JSONArray();
        JSONObject object = null;

        Date date = new Date();
        Date startDate = DateUtil.getLastDayStart(date);
        Date endDate = DateUtil.strToDateShort(DateUtil.dateToStrShort(date));

        Query totalQuery = new Query();
        totalQuery.addCriteria(Criteria.where("deleteFlag").is(0));
        totalQuery.addCriteria(Criteria.where("createTime").lt(endDate));

        List<ApplicationEntity> entities = mongoTemplate.find(totalQuery, ApplicationEntity.class);

        for (ApplicationEntity applicationEntity : entities) {

            Query query = new Query();
            query.addCriteria(Criteria.where("createTime").gte(startDate).lt(endDate));
            query.addCriteria(Criteria.where("deleteFlag").is(0));
            query.addCriteria(Criteria.where("appId").is(applicationEntity.getId()));

            long newCount = mongoTemplate.count(query, AppUser.class);

            Query query1 = new Query();
            query1.addCriteria(Criteria.where("deleteFlag").is(0));
            query1.addCriteria(Criteria.where("createTime").lt(endDate));
            query1.addCriteria(Criteria.where("appId").is(applicationEntity.getId()));

            long totalCount = mongoTemplate.count(query1, AppUser.class);

            object = new JSONObject();
            object.put("tenantId", applicationEntity.getTenantId());
            object.put("appId", applicationEntity.getId());
            object.put("newClientSum", newCount);
            object.put("clientSum", totalCount);

            array.add(object);
        }

        return array;
    }
}
