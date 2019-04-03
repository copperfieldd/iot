package com.changhong.iot.audit.web.controller;

import com.changhong.iot.audit.base.dto.APIResult;
import com.changhong.iot.audit.constant.MessageConstant;
import com.changhong.iot.audit.entity.TAuditLog;
import com.changhong.iot.audit.service.auditLog.AuditService;
import com.changhong.iot.audit.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/log")
public class AuditLogController {

    @Autowired
    private MessageConstant messageConstant;
    @Autowired
    private AuditService logService;

    @PostMapping("add")
    public APIResult add(@RequestBody TAuditLog tAuditLog, @RequestHeader("Authorization") String token) {
        try {
//            if (EmptyUtil.isEmpty(tAuditLog.getAuditTypeId())) {
//                return APIResult.failure().setMessage(messageConstant.typeIsNull);
//            }
            if (EmptyUtil.isEmpty(tAuditLog.getAppName())) {
                return APIResult.failure(1009).setValue(new String[]{"applicationName"});
            }
            if (EmptyUtil.isEmpty(tAuditLog.getUserName())) {
                return APIResult.failure(1009).setValue(new String[]{"username"});
            }
            if (EmptyUtil.isEmpty(tAuditLog.getType())) {
                return APIResult.failure(1009).setValue(new String[]{"auditType"});
            }
            if (EmptyUtil.isEmpty(tAuditLog.getAuditContent())) {
                return APIResult.failure(1009).setValue(new String[]{"auditContent"});
            }
            if (EmptyUtil.isEmpty(tAuditLog.getClientType())) {
                return APIResult.failure(1009).setValue(new String[]{"clientType"});
            }
            if (EmptyUtil.isEmpty(tAuditLog.getClientIp())) {
                return APIResult.failure(1009).setValue(new String[]{"clientIp"});
            }
            logService.add(tAuditLog, token);
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }


    @GetMapping("list")
    public APIResult list(Integer start, Integer count, String userName, String appName, String type, String clientType, String startTime, String endTime, @RequestHeader("Authorization") String token
    ) {

        if (start == null || null == count) {
            return APIResult.failure(1009).setValue(new String[]{"start or count"});
        }

        try {
            Map map = logService.list(start, count, userName, appName, type, clientType, startTime, endTime, token);
            return APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

    @GetMapping("/exportExcle")
    public APIResult exportExcle(HttpServletResponse response,@RequestParam Integer excleType, String userName, String appName, String type, String clientType, String startTime, String endTime, @RequestHeader("Authorization") String token) {

        try {
            logService.exportExcel(excleType, userName, appName, type, clientType, startTime, endTime, token, response);
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }
}
