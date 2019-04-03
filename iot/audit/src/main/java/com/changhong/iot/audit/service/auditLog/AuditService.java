package com.changhong.iot.audit.service.auditLog;

import com.changhong.iot.audit.entity.TAuditLog;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public interface AuditService {
    Map list(Integer start, Integer count, String userName, String appName, String type, String clientType, String startTime, String endTime,String token)throws Exception;

    void exportExcel(Integer excleType, String username, String applicationName, String userId, String auditType, String auditContent, String clientIp, String startTime, HttpServletResponse response) throws Exception;

    void add(TAuditLog tAuditLog, String token) throws Exception;
}
