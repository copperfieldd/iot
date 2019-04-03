package com.changhong.iot.pms.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import com.changhong.iot.pms.model.repository.ApplicationRepository;
import com.changhong.iot.pms.web.dto.ApplicationRqtDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

/**
 * Created by guiqijiang on 10/30/18.
 */
@Repository
public class ApplicationRepositoryImpl extends BaseMongoRepositoryImpl<ApplicationBean>
        implements ApplicationRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public ApplicationBean findByAppId(String appId) {
        return mongoTemplate.findOne(Query.query(Criteria.where("app_id").is(appId)), getEntityClass());
    }

    @Override
    public PageModel<ApplicationBean> findsByDTO(ApplicationRqtDTO reqDTO) {
        Criteria criteria = new Criteria();

        criteria.and("app_status").ne(2);

        if (StringUtils.isNotEmpty(reqDTO.getName())) {
            criteria.and("name").regex(reqDTO.getName());
        }

        if (StringUtils.isNotEmpty(reqDTO.getLeadName())) {
            criteria.and("lead_name").regex(reqDTO.getLeadName());
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
}
