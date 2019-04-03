package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.stats.config.ModelConstants;
import com.changhong.iot.stats.model.bean.permission.TPermission;
import com.changhong.iot.stats.model.repository.PermissionDao;
import com.changhong.iot.stats.web.dto.ParameterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static com.changhong.iot.stats.config.ModelConstants.*;

@Repository
public class PermissionDaoImpl extends BaseMongoRepositoryImpl<TPermission> implements PermissionDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 最近一次上报数据
     */
    @Override
    public Optional<TPermission> findOneRecent() {
        Query query = new Query();
        query.limit(1);
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.REPORT_TIME));
        List<TPermission> list = mongoTemplate.find(query, TPermission.class);
        if (list.size() == 0) {
            return Optional.empty();
        }
        return Optional.ofNullable(list.get(0));
    }

    /**
     * 接口调用次数（汇总）
     */
    @Override
    public List<HashMap> interfaceUseSum() {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.unwind(USER_SUM));
        list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
        list.add(Aggregation.group().sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
        list.add(Aggregation.project().andExclude(ID));
        return aggregate(list);
    }

    /**
     * 接口调用次数（趋势）
     *
     * @param parameterDto
     */
    @Override
    public List<HashMap> interfaceUseTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(USER_SUM).as(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.group(ID).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.group(YEAR, MONTH).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }

        return aggregate(list);
    }


    /**
     * 租户下调用接口次数（汇总）
     */
    @Override
    public List<HashMap> interfaceUseByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.sort(new Sort(Sort.Direction.DESC, REPORT_TIME)));
        list.add(Aggregation.limit(1));
        list.add(Aggregation.unwind(USER_SUM));
        list.add(Aggregation.match(Criteria.where(USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
        list.add(Aggregation.group().sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
        list.add(Aggregation.project().andExclude(ID));

        return aggregate(list);
    }

    /**
     * 接口调用次数（趋势）
     */
    @Override
    public List<HashMap> interfaceUseTrendById(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(USER_SUM).as(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(ID).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }

        return aggregate(list);
    }

    /**
     * APP调用接口（趋势）
     */
    @Override
    public List<HashMap> appUseInterfaceTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(USER_SUM).as(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(ID).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }

        return aggregate(list);
    }


    @Override
    public List<HashMap> tenantUseInterfaceTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(USER_SUM).as(USER_SUM));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(ID).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(USER_SUM));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
                list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }

        return aggregate(list);
    }

    /**
     * 接口调用次数 待条件（趋势）
     */
    @Override
    public List<HashMap> interfaceTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(USER_SUM).as(USER_SUM));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(ID).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(YEAR, MONTH).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(USER_SUM).as(USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(USER_SUM + "." + INTERFACE + "." + SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }

        return aggregate(list);
    }

    private void addMatch(ParameterDto parameterDto, List<AggregationOperation> list) {
        list.add(Aggregation.unwind(USER_SUM));
        if (!"*".equals(parameterDto.getTenantid())) {
            list.add(Aggregation.match(Criteria.where(USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        }
        if (!"*".equals(parameterDto.getAppid())) {
            list.add(Aggregation.match(Criteria.where(USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
        }
        list.add(Aggregation.unwind(USER_SUM + "." + INTERFACE));
        if (!"*".equals(parameterDto.getInterfaceid())) {
            list.add(Aggregation.match(Criteria.where(USER_SUM + "." + INTERFACE + ".id").is(parameterDto.getInterfaceid())));
        }
    }


    public List<HashMap> aggregate(List<AggregationOperation> list) {
        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();
        Aggregation aggregation = Aggregation.newAggregation(list).withOptions(aggregationOptions);
        List<HashMap> data = mongoTemplate.aggregate(aggregation, T_PERMISSION, HashMap.class).getMappedResults();
        return data;
    }
}
