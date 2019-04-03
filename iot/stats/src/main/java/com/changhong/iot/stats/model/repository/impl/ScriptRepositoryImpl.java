package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.bean.ScriptBase;
import com.changhong.iot.stats.model.bean.StructureBase;
import com.changhong.iot.stats.model.repository.ScriptRepository;
import com.changhong.iot.stats.util.StringUtil;
import com.changhong.iot.stats.web.dto.ScriptRqtDTO;
import org.apache.commons.lang.StringUtils;
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

import static com.changhong.iot.stats.model.bean.BaseBean.FIELD_CREATE_TIME;
import static com.changhong.iot.stats.model.bean.ScriptBase.DOCUMENT;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Repository
public class ScriptRepositoryImpl extends BaseMongoRepositoryImpl<ScriptBase> implements ScriptRepository {

    @Override
    public PageModel<HashMap> findScript(ScriptRqtDTO dto) {
        List<AggregationOperation> list = new ArrayList<>();
        Criteria criteria = new Criteria();


        //单独维护软删除
        list.add(Aggregation.lookup(ApplicationBase.DOCUMENT, ScriptBase.FILED_APP_ID, ApplicationBase.FIELD_ID, "app"));
        list.add(Aggregation.unwind("$app"));
        list.add(Aggregation.match(Criteria.where("app." + ApplicationBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal())));


        if (StringUtils.isNotEmpty(dto.getServiceNmae())) {
            criteria.and("app."+ApplicationBase.FIELD_APP_NAME).regex(dto.getServiceNmae());
        }

        if (StringUtils.isNotEmpty(dto.getName())) {
            criteria.and(ScriptBase.FILED_SCRIPT_NAME).regex(dto.getName());
        }

        if (StringUtils.isNotEmpty(dto.getTag())) {
            criteria.and(ScriptBase.FILED_SCRIPT_TAG).regex(dto.getTag());
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
        criteria.and(ScriptBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal());
        list.add(Aggregation.match(criteria));


        return super.aggregate(list, dto.getStart(), dto.getCount(),DOCUMENT);
    }

    @Override
    public ScriptBase findByTag(String tag, String appId) {
        return mgt.findOne(Query.query(Criteria.where(ScriptBase.FILED_SCRIPT_TAG).is(tag)
                .and(ScriptBase.FILED_APP_ID).is(appId)
                .and(ScriptBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal())), getEntityClass());
    }
}
