package com.changhong.iot.stats.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.repository.ApplicationRepository;
import com.changhong.iot.stats.util.StringUtil;
import com.changhong.iot.stats.web.dto.ApplicationRqtDTO;
import javafx.scene.shape.Circle;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Objects;

import static com.changhong.iot.stats.model.bean.ApplicationBase.FIELD_FOUNDER_NAME;
import static com.changhong.iot.stats.model.bean.BaseBean.FIELD_CREATE_TIME;

/**
 * Created by guiqijiang on 11/7/18.
 */
@Repository
public class ApplicationRepositoryImpl extends BaseMongoRepositoryImpl<ApplicationBase> implements ApplicationRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public ApplicationBase findAppByAppId(String appId) {
        return mongoTemplate.findOne(Query.query(Criteria.where("app_id").is(appId)), getEntityClass());
    }

    @Override
    public PageModel<ApplicationBase> findApps(ApplicationRqtDTO base) {
        Criteria criteria = new Criteria();
        if (StringUtils.isNotEmpty(base.getDomain())) {
            criteria.and("domain").regex(base.getDomain());
        }
        if (StringUtils.isNotEmpty(base.getServiceName())) {
            criteria.and("app_name").regex(base.getServiceName());
        }
        if (StringUtils.isNotEmpty(base.getId())) {
            criteria.and("_id").is(base.getId());
        }

        if (EmptyUtil.isNotEmpty(base.getFounderName())) {
            criteria.and(FIELD_FOUNDER_NAME).regex(base.getFounderName());
        }

        final String startTime = base.getStartTime();
        final String endTime = base.getEndTime();

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
        criteria.and(ApplicationBase.FIELD_STATE).ne(BaseBean.State.DELETE.ordinal());
        return super.pageAll(criteria, base.getStart(), base.getCount());
    }

    @Override
    public ApplicationBase findAppByDomain(String domain) {
        return mongoTemplate.findOne(Query.query(Criteria.where("app_domain").is(domain)), getEntityClass());
    }
}
