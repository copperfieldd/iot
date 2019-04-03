package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.bean.ScriptBase;
import com.changhong.iot.stats.model.bean.StructureBase;
import com.changhong.iot.stats.model.repository.StructureRepository;
import com.changhong.iot.stats.util.StringUtil;
import com.changhong.iot.stats.web.dto.StructureRqtDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;


import static com.changhong.iot.stats.model.bean.ApplicationBase.FIELD_APP_NAME;
import static com.changhong.iot.stats.model.bean.BaseBean.FIELD_CREATE_TIME;
import static com.changhong.iot.stats.model.bean.StructureBase.DOCUMENT;
import static com.changhong.iot.stats.model.bean.StructureBase.FIELD_FOUNDER_NAME;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Repository
public class StructureRepositoryImpl extends BaseMongoRepositoryImpl<StructureBase> implements StructureRepository {

    @Override
    public PageModel<HashMap> pageAll(StructureRqtDTO dto) {
        List<AggregationOperation> list = new ArrayList<>();

        list.add(Aggregation.lookup(ApplicationBase.DOCUMENT, ScriptBase.FILED_APP_ID, ApplicationBase.FIELD_ID, "app"));
        list.add(Aggregation.unwind("app"));
        list.add(Aggregation.match(Criteria.where("app." + ApplicationBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal())));

        Criteria criteria = new Criteria();

        if (EmptyUtil.isNotEmpty(dto.getServiceName())) {
            criteria.and("app." + FIELD_APP_NAME).regex(dto.getServiceName());
        }

        if (StringUtils.isNotEmpty(dto.getCollectionId())) {
            criteria.and(StructureBase.FIELD_COLLECTION_ID).regex(dto.getCollectionId());
        }

        if (StringUtils.isNotEmpty(dto.getCollectionName())) {
            criteria.and(StructureBase.FIELD_COLLECTION_NAME).regex(dto.getCollectionName());
        }

        if (EmptyUtil.isNotEmpty(dto.getFounderName())) {
            criteria.and(FIELD_FOUNDER_NAME).regex(dto.getFounderName());
        }


        final String startTime = dto.getStartTime();
        final String endTime = dto.getEndTime();
        if (EmptyUtil.isEmpty(startTime)) {
            if (EmptyUtil.isNotEmpty(endTime)) {
                criteria.and(FIELD_CREATE_TIME).lte(Objects.requireNonNull(StringUtil.getTime(endTime)).getTime() / 1000);
            }
        } else {
            if (EmptyUtil.isEmpty(endTime)) {
                criteria.and(FIELD_CREATE_TIME).gte(Objects.requireNonNull(StringUtil.getTime(startTime)).getTime() / 1000);
            } else {
                criteria.and(FIELD_CREATE_TIME).gte(Objects.requireNonNull(StringUtil.getTime(startTime)).getTime() / 1000).lte(Objects.requireNonNull(StringUtil.getTime(endTime)).getTime() / 1000);
            }
        }

        criteria.and(StructureBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal());
        list.add(Aggregation.match(criteria));

        return super.aggregate(list, dto.getStart(), dto.getCount(),DOCUMENT);
    }

    public StructureBase findByCollectionName(String collectionName) {
        return super.uniqueByProp(StructureBase.FIELD_COLLECTION_NAME, collectionName);
    }

    @Override
    public long findByAppIdCount(String appId) {
        return mgt.count(Query.query(Criteria.where(StructureBase.FIELD_APP_ID).is(appId)), getEntityClass());
    }

    @Override
    public StructureBase findByCollectionId(String collectionId) {
        return super.uniqueByProp(StructureBase.FIELD_COLLECTION_ID, collectionId);
    }

}
