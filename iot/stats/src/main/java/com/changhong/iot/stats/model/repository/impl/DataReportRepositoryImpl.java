package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.stats.model.repository.DataReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

/**
 * Created by guiqijiang on 11/12/18.
 */
@Repository
public class DataReportRepositoryImpl implements DataReportRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public void insert(String collectionId, Map map) {
        mongoTemplate.save(map, collectionId);
    }
}
