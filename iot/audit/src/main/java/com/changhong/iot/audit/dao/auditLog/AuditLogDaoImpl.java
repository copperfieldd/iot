package com.changhong.iot.audit.dao.auditLog;

import com.changhong.iot.audit.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.constant.TableConstant;
import com.changhong.iot.audit.entity.TAuditLog;
import com.changhong.iot.audit.util.EmptyUtil;
import com.changhong.iot.audit.util.StringUtil;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;


@Repository
public class AuditLogDaoImpl extends BaseMongoDaoImpl<TAuditLog> implements AuditLogDao {

    @Override
    protected Class<TAuditLog> getEntityClass() {
        return TAuditLog.class;
    }

}
