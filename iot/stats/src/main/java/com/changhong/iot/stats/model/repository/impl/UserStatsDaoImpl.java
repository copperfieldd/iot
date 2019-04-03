package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.stats.config.ModelConstants;
import com.changhong.iot.stats.model.bean.user.TUser;
import com.changhong.iot.stats.model.repository.UserStatsDao;
import com.changhong.iot.stats.web.dto.ParameterDto;
import javafx.scene.shape.Circle;
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
public class UserStatsDaoImpl extends BaseMongoRepositoryImpl<TUser> implements UserStatsDao {


    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 最近一次上报数据
     */
    @Override
    public Optional<TUser> findOneRecent() {
        Query query = new Query();
        query.limit(1);
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.REPORT_TIME));
        List<TUser> list = mongoTemplate.find(query, TUser.class);
        if (list.size() == 0) {
            return Optional.empty();
        }
        return Optional.ofNullable(list.get(0));
    }

    /**
     * 新增租户（汇总）
     */
    @Override
    public List<HashMap> newTenantSum(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.group().sum(NEW_TENANT_SUM).as(COUNT));
        list.add(Aggregation.project().andExclude(ID));
        return aggregate(list);
    }

    /**
     * 新增租户（趋势）
     */
    @Override
    public List<HashMap> newTenantTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(NEW_TENANT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(NEW_TENANT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(NEW_TENANT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 累计租户（趋势）
     */
    @Override
    public List<HashMap> tenantTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(TENANT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(TENANT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(TENANT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * C端新增用户（趋势）
     */
    @Override
    public List<HashMap> newClientTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(CLIENT_USER_SUM));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * C端累计用户（趋势）
     */
    @Override
    public List<HashMap> clientTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.group(ID).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 各租户下应用总数（汇总）
     */
    @Override
    public List<HashMap> tenantAppSum(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(TENANT_APP_SUM).as(TENANT_APP_SUM));
                list.add(Aggregation.unwind(TENANT_APP_SUM));
                list.add(Aggregation.match(Criteria.where(TENANT_APP_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(ID).sum(TENANT_APP_SUM + "." + APP_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(TENANT_APP_SUM).as(TENANT_APP_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(TENANT_APP_SUM));
                list.add(Aggregation.match(Criteria.where(TENANT_APP_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(TENANT_APP_SUM + "." + APP_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(TENANT_APP_SUM).as(TENANT_APP_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(TENANT_APP_SUM));
                list.add(Aggregation.match(Criteria.where(TENANT_APP_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(TENANT_APP_SUM + "." + APP_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 各租户下C端新增用户数（趋势）
     */
    @Override
    public List<HashMap> newClientTrendByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(CLIENT_USER_SUM));
        list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 各租户下C端用户累计（趋势）
     */
    @Override
    public List<HashMap> clientTrendByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(ID).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 各应用下总C端用户数（汇总）
     */
    @Override
    public List<HashMap> clientTrendByApp(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.group(ID).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(CLIENT_USER_SUM).as(CLIENT_USER_SUM).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.unwind(CLIENT_USER_SUM));
                list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 各应用下C端新增用户总数（趋势）
     */
    @Override
    public List<HashMap> newClientTrendByApp(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(CLIENT_USER_SUM));
        list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + APP_ID).is(parameterDto.getAppid())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH, DAY));
                break;
            default:
                break;
        }
        return aggregate(list);
    }

    @Override
    public List<HashMap> newClienTtrendByTenant(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(CLIENT_USER_SUM));
        list.add(Aggregation.match(Criteria.where(CLIENT_USER_SUM + "." + TENANT_ID).is(parameterDto.getTenantid())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));

        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, REPORT_TIME)));
                list.add(Aggregation.project(COUNT, YEAR, MONTH));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(CLIENT_USER_SUM + "." + NEW_CLIENT_SUM).as(COUNT).last(REPORT_TIME).as(REPORT_TIME));
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
        List<HashMap> data = mongoTemplate.aggregate(aggregation, T_USER, HashMap.class).getMappedResults();
        return data;
    }
}
