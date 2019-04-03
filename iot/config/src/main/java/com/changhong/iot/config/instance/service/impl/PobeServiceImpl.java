package com.changhong.iot.config.instance.service.impl;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dao.InstanceDao;
import com.changhong.iot.config.instance.dao.PobeDao;
import com.changhong.iot.config.instance.dto.PobeListDto;
import com.changhong.iot.config.instance.entity.PobeEntity;
import com.changhong.iot.config.instance.service.PobeService;
import com.changhong.iot.config.searchdto.DateSearch;
import com.changhong.iot.config.searchdto.ServiceStatefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.DateUtil;
import com.changhong.iot.config.util.EmptyUtil;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationOptions;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service
public class PobeServiceImpl implements PobeService {

    @Resource
    private PobeDao pobeDao;

    @Resource
    private InstanceDao instanceDao;

    @Resource
    private MongoTemplate mongoTemplate;

    @Override
    public void add(PobeEntity pobeEntity) {

        pobeEntity.setId(UUID.randomUUID().toString());
        pobeEntity.setCreateTime(new Date());

        pobeDao.save(pobeEntity);
    }

    @Override
    public PobeEntity find(String id) {
        return (PobeEntity) pobeDao.find(id);
    }

    @Override
    public List<PobeListDto> pack(List<PobeListDto> list, int type) {
        if (list == null) {
            return new ArrayList<>();
        }
        for (PobeListDto pobe : list) {
            PobeEntity entity =  (PobeEntity) pobeDao.uniqueByProps(new String[] {"serviceId", "type"}, new Object[] {pobe.getId(), type}, "createTime desc");
            if (entity == null) {
                pobe.setProbeTime(new Date());
                pobe.setValue(0L);
            } else {
                pobe.setProbeTime(entity.getCreateTime());
                pobe.setValue(entity.getValue());
            }
        }

        return list;
    }

    @Override
    public PageModel page(int start, int count, ServiceStatefilter serviceStatefilter, Sort sort) throws ByteException {

        String order = pobeDao.analysisSort(sort);

        Criteria criteria = new Criteria();

        if (serviceStatefilter != null) {
            if (serviceStatefilter.getServiceName() != null) {
                criteria.and("serviceName").regex(serviceStatefilter.getServiceName());
            }
            if (serviceStatefilter.getServiceHost() != null) {
                criteria.and("serviceHost").regex(serviceStatefilter.getServiceHost());
            }
            if (serviceStatefilter.getServicePort() != null) {
                criteria.and("servicePort").is(serviceStatefilter.getServicePort());
            }
            if (serviceStatefilter.getValue() != null) {
                criteria.and("value").is(serviceStatefilter.getValue());
            }
            DateSearch probeTime = serviceStatefilter.getProbeTime();
            if (probeTime != null) {
                String startTime = probeTime.getStartTime();
                String endTime = probeTime.getEndTime();
                Date startDate = DateUtil.strToDate(startTime);
                Date endDate = DateUtil.strToDate(endTime);
                if (startDate != null || endDate != null) {
                    criteria = criteria.and("probeTime");
                    if (startDate != null) {
                        criteria.gte(startDate);
                    }
                    if (endDate != null) {
                        criteria.lte(endDate);
                    }
                }
            }
        }

        List<AggregationOperation> operations = new ArrayList<>();
        operations.add(Aggregation.lookup("serviceInstances","serviceId","_id","instance"));
        operations.add(Aggregation.unwind("instance"));
        operations.add(Aggregation.match(Criteria.where("type").is(1)));
        operations.add(Aggregation.group("serviceId").last("instance.serviceName").as("serviceName")
                        .last("instance.servicePort").as("servicePort").last("instance.serviceHost").as("serviceHost")
                        .last("value").as("value").last("createTime").as("probeTime"));
        operations.add(Aggregation.match(criteria));

        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();
        AggregationResults<HashMap> aggregate = mongoTemplate.aggregate(Aggregation.newAggregation(operations).withOptions(aggregationOptions), "pobe", HashMap.class);

        int size = aggregate.getMappedResults().size();

        List<org.springframework.data.domain.Sort.Order> list = pobeDao.parseOrder(order);
        operations.add(Aggregation.skip(start));
        operations.add(Aggregation.limit(count));
        if (EmptyUtil.isNotEmpty(list)) {
            operations.add(Aggregation.sort(new org.springframework.data.domain.Sort(list)));
        }
        AggregationResults<PobeListDto> aggre = mongoTemplate.aggregate(Aggregation.newAggregation(operations).withOptions(aggregationOptions), "pobe", PobeListDto.class);

        List<PobeListDto> results = aggre.getMappedResults();

        return new PageModel(size, results);
    }
}
