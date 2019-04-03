package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.TPay;
import com.changhong.iot.stats.model.repository.PayDao;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.changhong.iot.stats.config.ModelConstants.*;

@Repository
public class PayDaoImpl extends BaseMongoRepositoryImpl<TPay> implements PayDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 接入租户总数（汇总）
     */
    @Override
    public List<HashMap> tenantSum() {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.group().sum(TENANT_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }


    /**
     * 总应用数（汇总）
     */
    @Override
    public List<HashMap> appSum() {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.unwind(TENANT_APP_SUM));
        list.add(Aggregation.group().sum(TENANT_APP_SUM + "." + APP_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }

    /**
     * 新增应用数（汇总）
     */
    @Override
    public List<HashMap> newAppSum() {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.unwind(TENANT_APP_SUM));
        list.add(Aggregation.group().sum(TENANT_APP_SUM + "." + NEW_APP_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }


    /**
     * 订单总数（汇总）
     *
     * @param parameterDto
     */
    @Override
    public List<HashMap> orderSum(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.group().sum(ORDER_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }

    /**
     * 新增订单数（汇总）
     */
    @Override
    public List<HashMap> newOrderSum(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.unwind(APP_ORDER_SUM));
        list.add(Aggregation.group().sum(APP_ORDER_SUM + "." + NEW_ORDER_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }


    /**
     * 租户下订单总数（汇总）
     */
    @Override
    public List<HashMap> appOrderSumByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.unwind(APP_ORDER_SUM));
        list.add(Aggregation.match(Criteria.where(APP_ORDER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        list.add(Aggregation.group().sum(APP_ORDER_SUM + "." + ORDER_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }

    /**
     * 租户下新增订单数（汇总）
     */
    @Override
    public List<HashMap> newAppOrderSumByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.unwind(APP_ORDER_SUM));
        list.add(Aggregation.match(Criteria.where(APP_ORDER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        list.add(Aggregation.group().sum(APP_ORDER_SUM + "." + NEW_ORDER_SUM).as(COUNT));
        list.add(Aggregation.project(COUNT).andExclude(ID));

        return aggregate(list);
    }

    /**
     * 订单总数 （趋势）
     *
     * @param parameterDto
     * @return
     */
    @Override
    public List<HashMap> orderTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(APP_ORDER_SUM).as(APP_ORDER_SUM));
                list.add(Aggregation.unwind(APP_ORDER_SUM));
                addMatch(list, parameterDto);
                list.add(Aggregation.group(ID).sum(APP_ORDER_SUM + "." + ORDER_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(APP_ORDER_SUM).as(APP_ORDER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(APP_ORDER_SUM));
                addMatch(list, parameterDto);
                list.add(Aggregation.group(YEAR, MONTH).sum(APP_ORDER_SUM + "." + ORDER_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(APP_ORDER_SUM).as(APP_ORDER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(APP_ORDER_SUM));
                addMatch(list, parameterDto);
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(APP_ORDER_SUM + "." + ORDER_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    private void addMatch(List<AggregationOperation> list, ParameterDto parameterDto) {
        if (!"*".equals(parameterDto.getTenantid())) {
            list.add(Aggregation.match(Criteria.where(APP_ORDER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        }
        if (!"*".equals(parameterDto.getAppid())) {
            list.add(Aggregation.match(Criteria.where(APP_ORDER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
        }
    }

    /**
     * 新增订单数（趋势）
     */
    @Override
    public List<HashMap> newOrderTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.unwind(APP_ORDER_SUM));
        addMatch(list, parameterDto);

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(APP_ORDER_SUM + "." + NEW_ORDER_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(APP_ORDER_SUM + "." + NEW_ORDER_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(APP_ORDER_SUM + "." + NEW_ORDER_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }


    public List<HashMap> aggregate(List<AggregationOperation> list) {
        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();
        Aggregation aggregation = Aggregation.newAggregation(list).withOptions(aggregationOptions);
        List<HashMap> data = mongoTemplate.aggregate(aggregation, T_PAY, HashMap.class).getMappedResults();
        return data;
    }
}
