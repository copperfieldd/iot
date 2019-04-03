package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.stats.config.ModelConstants;
import com.changhong.iot.stats.model.bean.device.TDevice;
import com.changhong.iot.stats.model.repository.DeviceDao;
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

import java.util.*;

import static com.changhong.iot.stats.config.ModelConstants.*;


@Repository
public class DeviceDaoImpl extends BaseMongoRepositoryImpl<TDevice> implements DeviceDao {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 租户总数
     */
    @Override
    public Optional<TDevice> findOneRecent() {
        Query query = new Query();
        query.limit(1);
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.REPORT_TIME));
        List<TDevice> list = mongoTemplate.find(query, TDevice.class);
        if (list.size() == 0) {
            return Optional.empty();
        }
        return Optional.ofNullable(list.get(0));
    }


    /**
     * 新增设备（汇总）
     */
    @Override
    public List<HashMap> newdevicesum() {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.unwind(ModelConstants.DEVICE_TYPE));
        list.add(Aggregation.group().sum(ModelConstants.DEVICE_TYPE + "." + ModelConstants.NEW_DEVICE_SUM).as(COUNT));
        list.add(Aggregation.project().andExclude(ID));
        return aggregate(list);
    }


    /**
     * 新增设备配置（趋势）
     */
    @Override
    public List<HashMap> newtypeTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();
        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(ModelConstants.NEW_DEVICE_TYPE_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, YEAR)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.NEW_DEVICE_TYPE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.NEW_DEVICE_TYPE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 累计设备配置（趋势）
     */
    @Override
    public List<HashMap> typeTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(ModelConstants.DEVICE_TYPE_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, YEAR)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(ModelConstants.DEVICE_TYPE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(ModelConstants.DEVICE_TYPE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 新增设备数（趋势）
     */
    @Override
    public List<HashMap> newDeviceTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(ModelConstants.APP_DEVICE));
        addMatch(parameterDto, list);

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.NEW_DEVICE_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, YEAR)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.NEW_DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.NEW_DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 累计设备数（趋势）
     */
    @Override
    public List<HashMap> deviceTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(ModelConstants.APP_DEVICE).as(ModelConstants.APP_DEVICE));
                list.add(Aggregation.unwind(ModelConstants.APP_DEVICE));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(ID).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.DEVICE_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(ModelConstants.APP_DEVICE).as(ModelConstants.APP_DEVICE).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.APP_DEVICE));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(ModelConstants.APP_DEVICE).as(ModelConstants.APP_DEVICE).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.APP_DEVICE));
                addMatch(parameterDto, list);
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.APP_DEVICE + "." + ModelConstants.DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    private void addMatch(ParameterDto parameterDto, List<AggregationOperation> list) {
        if (!"*".equals(parameterDto.getAppid())) {
            list.add(Aggregation.match(Criteria.where(APP_DEVICE + "." + APP_ID).is(parameterDto.getAppid())));
        }
        if (!"*".equals(parameterDto.getTenantid())) {
            list.add(Aggregation.match(Criteria.where(APP_DEVICE + "." + TENANT_ID).is(parameterDto.getTenantid())));
        }
    }

    /**
     * 新增应用（趋势）
     */
    @Override
    public List<HashMap> newAppTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.unwind(ModelConstants.TENANT_APP_SUM));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.NEW_APP_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, YEAR)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.NEW_APP_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.NEW_APP_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    /**
     * 累计应用（趋势）
     */
    @Override
    public List<HashMap> appTrend(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(ModelConstants.TENANT_APP_SUM).as(ModelConstants.TENANT_APP_SUM));
                list.add(Aggregation.unwind(ModelConstants.TENANT_APP_SUM));
                list.add(Aggregation.group(ID).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.APP_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(ModelConstants.TENANT_APP_SUM).as(ModelConstants.TENANT_APP_SUM).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.TENANT_APP_SUM));
                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.APP_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(ModelConstants.TENANT_APP_SUM).as(ModelConstants.TENANT_APP_SUM).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.TENANT_APP_SUM));
                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.TENANT_APP_SUM + "." + ModelConstants.APP_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }

    @Override
    public List<HashMap> deviceSumTrendByType(ParameterDto parameterDto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.match(Criteria.where(ModelConstants.REPORT_TIME).gte(parameterDto.getStarttime()).lte(parameterDto.getEndtime())));
        list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));

        String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                list.add(Aggregation.group(YEAR).last(ModelConstants.DEVICE_TYPE).as(ModelConstants.DEVICE_TYPE));
                list.add(Aggregation.unwind(ModelConstants.DEVICE_TYPE));

                if (!"*".equals(parameterDto.getTypeid())) {
                    list.add(Aggregation.match(Criteria.where(DEVICE_TYPE + "." +TYPE_ID).is(parameterDto.getTypeid())));
                }

                list.add(Aggregation.group(ID).sum(ModelConstants.DEVICE_TYPE + "." + ModelConstants.DEVICE_SUM).as(COUNT));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ID)));
                list.add(Aggregation.project().andInclude(COUNT).andExclude(ID).and(ID).as(YEAR));
                break;
            case MONTH:
                list.add(Aggregation.group(YEAR, MONTH).last(ModelConstants.DEVICE_TYPE).as(ModelConstants.DEVICE_TYPE).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.DEVICE_TYPE));

                if (!"*".equals(parameterDto.getTypeid())) {
                    list.add(Aggregation.match(Criteria.where(DEVICE_TYPE + "." +TYPE_ID).is(parameterDto.getTypeid())));
                }

                list.add(Aggregation.group(YEAR, MONTH).sum(ModelConstants.DEVICE_TYPE + "." + ModelConstants.DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, COUNT));
                break;
            case DAY:
                list.add(Aggregation.group(YEAR, MONTH, DAY).last(ModelConstants.DEVICE_TYPE).as(ModelConstants.DEVICE_TYPE).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.unwind(ModelConstants.DEVICE_TYPE));

                if (!"*".equals(parameterDto.getTypeid())) {
                    list.add(Aggregation.match(Criteria.where(DEVICE_TYPE + "." +TYPE_ID).is(parameterDto.getTypeid())));
                }

                list.add(Aggregation.group(YEAR, MONTH, DAY).sum(ModelConstants.DEVICE_TYPE + "." + ModelConstants.DEVICE_SUM).as(COUNT).last(ModelConstants.REPORT_TIME).as(ModelConstants.REPORT_TIME));
                list.add(Aggregation.sort(new Sort(Sort.Direction.ASC, ModelConstants.REPORT_TIME)));
                list.add(Aggregation.project().andInclude(YEAR, MONTH, DAY, COUNT));
            default:
                break;
        }
        return aggregate(list);
    }


//    /**
//     * 应用下累计设备（汇总）
//     */
//    @Override
//    public List<HashMap> clientSumByApp(String appid) {
//        List<AggregationOperation> list = new ArrayList<>();
//        list.add(Aggregation.unwind(ModelConstants.APP_DEVICE));
//        list.add(Aggregation.group(ModelConstants.APP_ID).sum(ModelConstants.DEVICE_SUM).as(COUNT));
//        list.add(Aggregation.project(COUNT).andExclude(ID));
//        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();        final Aggregation aggregation = Aggregation.newAggregation(list).withOptions(aggregationOptions);
//        List<HashMap> data = mongoTemplate.aggregate(aggregation, ModelConstants.T_DEVICE, HashMap.class).getMappedResults();
//        return data;
//    }

    public List<HashMap> aggregate(List<AggregationOperation> list) {
        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();
        Aggregation aggregation = Aggregation.newAggregation(list).withOptions(aggregationOptions);
        List<HashMap> data = mongoTemplate.aggregate(aggregation, T_DEVICE, HashMap.class).getMappedResults();
        return data;
    }
}
