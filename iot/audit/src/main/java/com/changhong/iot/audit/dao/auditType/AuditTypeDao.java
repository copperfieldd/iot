package com.changhong.iot.audit.dao.auditType;

import com.changhong.iot.audit.base.dao.BaseMongoDao;
import com.changhong.iot.audit.entity.TAuditType;

import java.util.List;
import java.util.Optional;

public interface AuditTypeDao extends BaseMongoDao<TAuditType> {
    List<TAuditType> findAllByNotDel();

    Optional<TAuditType> findById(String id);
}
