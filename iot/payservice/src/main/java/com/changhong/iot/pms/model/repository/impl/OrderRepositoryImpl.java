package com.changhong.iot.pms.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.model.repository.OrderRepository;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.aggregation.Field;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by guiqijiang on 10/29/18.
 */
@Repository
public class OrderRepositoryImpl extends BaseMongoRepositoryImpl<OrderBean> implements OrderRepository {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public OrderRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public OrderBean findByOrderSn(String sn) {
        return mongoTemplate.findOne(Query.query(Criteria.where("order_sn").is(sn)), getEntityClass());
    }

    @Override
    public PageModel<OrderBean> findByDTO(OrderRqtDTO reqDTO) {
        Criteria criteria = new Criteria();

        if (StringUtils.isNotEmpty(reqDTO.getOrderSn())) {
            criteria.and("order_sn").regex(reqDTO.getOrderSn());
        }

        if (StringUtils.isNotEmpty(reqDTO.getSubject())) {
            criteria.and("subject").regex(reqDTO.getSubject());
        }

        if (reqDTO.getStatus() != -1) {
            criteria.and("status").is(reqDTO.getStatus());
        }

        if (StringUtils.isNotEmpty(reqDTO.getTradeChannel())) {
            criteria.and("trade_channel").is(Integer.parseInt(reqDTO.getTradeChannel()));
        }

        if (StringUtils.isNotEmpty(reqDTO.getStartTime())) {
            if (StringUtils.isNotEmpty(reqDTO.getEndTime())) {
                criteria.and("create_time").gte(DateUtil.strToDateLong(reqDTO.getStartTime(), "yyyy/MM/dd HH:mm:ss"))
                        .lte(DateUtil.strToDateLong(reqDTO.getEndTime(), "yyyy/MM/dd HH:mm:ss"));
            } else {
                criteria.and("create_time").gte(DateUtil.strToDateLong(reqDTO.getStartTime(), "yyyy/MM/dd HH:mm:ss"));
            }
        } else {
            if (StringUtils.isNotEmpty(reqDTO.getEndTime())) {
                criteria.and("create_time").lte(DateUtil.strToDateLong(reqDTO.getEndTime(), "yyyy/MM/dd HH:mm:ss"));
            }
        }

        Query query = new Query().with(new Sort(Sort.Direction.DESC, "create_time")).addCriteria(criteria);
        query.skip(reqDTO.getStart());
        query.limit(reqDTO.getCount());

        return pageAll(query);
    }

    @Override
    public OrderBean findByOutTradeNo(String outTradeNo) {
        return mongoTemplate.findOne(Query.query(Criteria.where(OrderBean.FILED_OUT_TRADE_NO).is(outTradeNo)),
                getEntityClass());
    }

    @Override
    public List countOrderSum() {
        List<AggregationOperation> operations = new ArrayList<>();
        operations.add(Aggregation.group(OrderBean.FILED_LESSEE_ID, OrderBean.FILED_APP_USER_ID).count().as
                ("orderSum"));
        Field lesseeId = Fields.field("appId", "_id." + OrderBean.FILED_LESSEE_ID);
        Field appUserId = Fields.field("tenantId", "_id." + OrderBean.FILED_APP_USER_ID);
        Field count = Fields.field("orderSum");

        operations.add(Aggregation.project(Fields.from(lesseeId, appUserId, count)));
        Aggregation aggregation = Aggregation.newAggregation(operations);
        return mongoTemplate.aggregate(aggregation, OrderBean.DOCUMENT, HashMap.class).getMappedResults();
    }

    @Override
    public long orderSum(String appUserId) {
        Query query = new Query();
        Long time = DateUtil.dateToLong(new Date(), "yyyy/MM/dd");
        query.addCriteria(Criteria.where(OrderBean.FILED_CREATE_TIME).gte(time));
        query.addCriteria(Criteria.where(OrderBean.FILED_APP_USER_ID).is(appUserId));
        return mongoTemplate.count(query, OrderBean.DOCUMENT);
    }

    @Override
    public long orderSum() {
        return mongoTemplate.count(null, OrderBean.DOCUMENT);
    }

    @Override
    public long newOrderSum() {
        long time = DateUtil.dateToLong(new Date(), "yyyy/MM/dd");
        return mongoTemplate.count(Query.query(Criteria.where(OrderBean.FILED_CREATE_TIME).gte(time)), OrderBean
                .DOCUMENT);
    }
}
