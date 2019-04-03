package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.instance.dto.PobeListDto;
import com.changhong.iot.config.instance.entity.LatestEntity;
import com.changhong.iot.config.instance.service.LatestService;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class LatestServiceImpl implements LatestService {

    @Resource
    private MongoTemplate mongoTemplate;

    @Override
    public List<PobeListDto> pack(List<PobeListDto> list, int type) {
        if (list == null) {
            return new ArrayList<>();
        }
        for (PobeListDto pobe : list) {
            LatestEntity entity = mongoTemplate.findOne(Query.query(Criteria.where("serviceId").is(pobe.getId()).and("type").is(type)), LatestEntity.class);
            if (entity == null) {
                pobe.setProbeTime(new Date());
                pobe.setValue(0l);
            } else {
                pobe.setProbeTime(entity.getCreateTime());
                pobe.setValue(entity.getValue());
            }
        }

        return list;
    }
}
