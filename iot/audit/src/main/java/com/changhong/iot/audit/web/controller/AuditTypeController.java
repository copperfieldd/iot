package com.changhong.iot.audit.web.controller;

import com.changhong.iot.audit.base.dto.APIResult;
import com.changhong.iot.audit.constant.MessageConstant;
import com.changhong.iot.audit.entity.TAuditType;
import com.changhong.iot.audit.service.auditType.AuditTypeService;
import com.changhong.iot.audit.util.EmptyUtil;
import com.changhong.iot.audit.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/type")
public class AuditTypeController {

    @Autowired
    private MessageConstant messageConstant;

    @Autowired
    private AuditTypeService typeService;


    @GetMapping("item")
    public APIResult item(String id){
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.failure(1009).setValue(new String[]{"id"});
        }
        try {
            Map map = typeService.item(id);
            return APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);        }
    }


    @GetMapping("list")
    public APIResult list(Integer start,Integer count,String name,String type,String startTime,String endTime){
        if (start == null || count == null) {
            return APIResult.failure(1009).setValue(new String[]{"start or count"});
        }
        try {
            Map map = typeService.list(start, count,name,type,startTime,endTime);
            return APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }


    /**
     * 添加审计类型
     *
     * @param tAuditType
     * @return
     */
    @PostMapping("add")
    public APIResult add(@RequestBody TAuditType tAuditType) {

        try {
            if (EmptyUtil.isEmpty(tAuditType.getName())) {
                return APIResult.failure(1009).setValue(new String[]{"name"});
            }
            if (EmptyUtil.isEmpty(tAuditType.getType())) {
                return APIResult.failure(1009).setValue(new String[]{"type"});
            }
            if (tAuditType.getType().length() > 20) {
                return APIResult.failure(1017).setValue(new String[]{"type"});
            }
            Optional<TAuditType> auditType = typeService.save(tAuditType);
            if (auditType.isPresent()) {
                TAuditType item = auditType.get();
                Map map = new HashMap();
                map.put("id", item.getId());
                map.put("name", item.getName());
                map.put("type", item.getType());
                map.put("desc", item.getDesc());
                map.put("createTime", StringUtil.getTime(item.getCreateTime()));
                return APIResult.success().setValue(map);
            }
            return APIResult.failure(1);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

    /**
     * 修改审计类型
     *
     * @param tAuditType
     * @return
     */
    @PostMapping("upd")
    public APIResult upd(@RequestBody TAuditType tAuditType) {

        try {
            if (EmptyUtil.isEmpty(tAuditType.getId())) {
                return APIResult.failure(1009).setValue(new String[]{"id"});
            }
            if (EmptyUtil.isEmpty(tAuditType.getName())) {
                return APIResult.failure(1009).setValue(new String[]{"name"});
            }
            if (EmptyUtil.isEmpty(tAuditType.getType())) {
                return APIResult.failure(1009).setValue(new String[]{"type"});
            }
            if (tAuditType.getType().length() > 20) {
                return APIResult.failure(1017).setValue(new String[]{"type"});
            }
            Optional<String> message = typeService.upd(tAuditType);
            if (message.isPresent()) {
                return APIResult.failure(1010).setValue(new String[]{"name"});
            }
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

    /**
     * 添加审计类型
     *
     * @return
     */
    @GetMapping("del")
    public APIResult del(String ids) {

        try {
            if (EmptyUtil.isEmpty(ids)) {
                return APIResult.failure(1009).setValue(new String[]{"ids"});
            }
             typeService.del(ids);
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

}
