package com.changhong.iot.audit.service.auditType;

import com.changhong.iot.audit.entity.TAuditType;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AuditTypeService {
    Optional<TAuditType> save(TAuditType tAuditType) throws Exception;

    Optional<String> upd(TAuditType tAuditType) throws Exception;

    void del(String id) throws Exception;

    Map list(Integer start, Integer count, String name, String type, String startTime, String endTime) throws Exception;

    List<TAuditType> findAll() throws Exception;

    Map item(String id) throws Exception;
}
