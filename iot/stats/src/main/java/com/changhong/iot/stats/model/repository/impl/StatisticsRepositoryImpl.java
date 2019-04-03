package com.changhong.iot.stats.model.repository.impl;

import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.stats.model.repository.StatisticsRepository;
import com.mongodb.CommandResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by guiqijiang on 11/9/18.
 */
@Repository
public class StatisticsRepositoryImpl extends BaseMongoRepositoryImpl<HashMap> implements StatisticsRepository {

    Logger logger = LoggerFactory.getLogger(StatisticsRepositoryImpl.class);

    @Autowired
    MongoTemplate template;

    @Override
    public Object runScript(String script) {

        try {
            String marking = "aBcdIhaErhf";
            script = script.replaceAll("\\$", marking);
            script = script.replaceAll("null", "''");
            Map jsonObject = JSONObject.parseObject(script, LinkedHashMap.class);
            Map cursor = new HashMap();
            cursor.put("batchSize", 2147483647);
            jsonObject.put("cursor", cursor);
            script = JSONObject.toJSONString(jsonObject);
            script = script.replaceAll(marking, "\\$");
            Map result = template.executeCommand(script).toMap();
            logger.info(script);
            cursor = (Map) result.get("cursor");
            Object firstBatch = cursor.get("firstBatch");
            return firstBatch;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return null;
        }
    }
}
