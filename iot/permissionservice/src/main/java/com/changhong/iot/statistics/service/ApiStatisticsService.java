package com.changhong.iot.statistics.service;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApplicationDto;
import com.changhong.iot.entity.ApiEntity;
import com.changhong.iot.rpc.ApplicationService;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.statistics.entity.ApiStatistics;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.UUIDUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ApiStatisticsService {

    public static final Logger LOGGER = LoggerFactory.getLogger(ApiStatisticsService.class);

    @Value("${statistics.loginName}")
    private String statisticsLoginName;

    @Value("${statistics.password}")
    private String statisticsPassword;

    @Value("${statistics.serviceKey}")
    private String statisticsServiceKey;

    @Value("${statistics.collection}")
    private String statisticsCollection;

    @Resource
    private OrgService orgService;

    @Resource
    private StatisticsService statisticsService;

    @Resource
    private ApplicationService applicationService;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Resource
    private MongoTemplate mongoTemplate;

    public void interfaceCallStatistics(String uri) throws ByteException {

        if (EmptyUtil.isEmpty(uri)) {
            return;
        }

        ApiEntity api = mongoTemplate.findOne(Query.query(Criteria.where("dataUrl").is(uri)), ApiEntity.class);

        if (api == null) {
            return;
        }
        ApiStatistics statistics = mongoTemplate.findOne(Query.query(Criteria.where("apiId").is(api.getId())), ApiStatistics.class);

        if (statistics == null) {
            Date date = new Date();
            statistics = new ApiStatistics();
            statistics.setId(UUIDUtil.getUUID());
            statistics.setCreateTime(date);
            statistics.setUpdateTime(date);
            statistics.setApiId(api.getId());
            statistics.setAppId(myThreadLocal.getUser().getAppId());
            statistics.setTenantId(myThreadLocal.getTenantId());
            statistics.setNumber(1l);
            mongoTemplate.save(statistics);
        } else {
            mongoTemplate.updateFirst(Query.query(Criteria.where("id").is(statistics.getId())), Update.update("number", statistics.getNumber()+1), ApiStatistics.class);
        }
    }


    @Scheduled(cron = "0 0 2 * * ?")
    public void statistics() {

        try {

            String token = orgService.login(statisticsLoginName, statisticsPassword, 0).getToken();

            JSONObject object = new JSONObject();
            object.put("interfaceSum", apiCount());
            object.put("useSum", use(token));

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

    public long apiCount() {
        return mongoTemplate.count(null, ApiEntity.class);
    }

    public JSONArray use(String token) {

        JSONArray array = new JSONArray();
        JSONObject object = null;

        List<ApplicationDto> all = applicationService.all(token);

        for (ApplicationDto app : all) {

            JSONArray jsonArray = new JSONArray();

            List<ApiStatistics> list = mongoTemplate.find(Query.query(Criteria.where("appId").is(app.getId())), ApiStatistics.class);
            for (ApiStatistics apiStatistics : list) {
                ApiEntity api = mongoTemplate.findOne(Query.query(Criteria.where("id").is(apiStatistics.getApiId())), ApiEntity.class);
                if (api != null) {
                    object = new JSONObject();
                    object.put("id", api.getId());
                    object.put("name", api.getName());
                    object.put("url", api.getDataUrl());
                    object.put("sum", apiStatistics.getNumber());
                    jsonArray.add(object);
                }
            }

            object = new JSONObject();
            object.put("tenantId", app.getTenantId());
            object.put("appId", app.getId());
            object.put("interface", jsonArray);

            array.add(object);
        }
        return array;
    }

}
