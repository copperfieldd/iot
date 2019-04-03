package com.changhong.iot.audit.init;

import com.changhong.iot.audit.entity.TAuditType;
import com.changhong.iot.audit.service.auditType.AuditTypeService;
import com.changhong.iot.audit.util.ByteUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.awt.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SystemInit {

    @Autowired
    private AuditTypeService typeService;

    private String SYS_SEC_LONGIN = "sys_sec_login";
    private String SYS_SEC_LONGOUT = "sys_sec_logout";
    private String SYS_SEC_LIST = "sys_sec_list";
    private String SYS_SEC_ADD = "sys_sec_add";
    private String SYS_SEC_UDPATE = "sys_sec_update";
    private String SYS_SEC_DELETE = "sys_sec_delete";

    /**
     * 初始化审计类型
     */
    @PostConstruct
    public void initAuditType() {
        List<String> SYSTYPES = new ArrayList<String>();
        SYSTYPES.add(SYS_SEC_LONGIN);
        SYSTYPES.add(SYS_SEC_LONGOUT);
        SYSTYPES.add(SYS_SEC_LIST);
        SYSTYPES.add(SYS_SEC_ADD);
        SYSTYPES.add(SYS_SEC_UDPATE);
        SYSTYPES.add(SYS_SEC_DELETE);
        try {
            List<TAuditType> list = typeService.findAll();
            list.stream().filter(type -> SYSTYPES.contains(type.getType())).distinct().map(SYSTYPES::remove);
            SYSTYPES.forEach(type -> {
                TAuditType tAuditType = new TAuditType();
                tAuditType.setDeletedFlag(false);
                tAuditType.setCreateTime(new Date());
                tAuditType.setUpdateTIme(new Date());
                tAuditType.setName(type);
                tAuditType.setType(type);
                try {
                    typeService.save(tAuditType);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        System.out.println(ByteUtil.bytesToHexString("100102011816000002".getBytes()));
    }
}
