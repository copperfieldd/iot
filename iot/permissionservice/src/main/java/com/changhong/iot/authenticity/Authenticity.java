package com.changhong.iot.authenticity;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApiInfoDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.rpc.OrgService;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.util.EmptyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Authenticity {

    @Autowired
    private ApiService apiService;

    @Autowired
    private MyThreadLocal myThreadLocal;

    @Autowired
    private OrgService orgService;


    @PostMapping("/authenticity")
    public ServerResponse authenticity(String id, @RequestParam String path) throws ByteException {

        ApiInfoDto api = apiService.findByPath(path);

        if (api != null) {
            if (api.getType() != null && api.getType().equals(ConfigValue.PRIVATE_API)) {
                    String tenantId;
                    int type;
                    String appId;
                    if (EmptyUtil.isEmpty(id)) {
                        id = myThreadLocal.getUserId();
                        type = myThreadLocal.getUser().getType();
                        tenantId = myThreadLocal.getTenantId();
                        appId = myThreadLocal.getUser().getAppId();
                    } else {
                        UserDto user = orgService.findUser(id);
                        tenantId = user.getTenantId();
                        type = user.getType();
                        appId = user.getAppId();
                    }

                    List<String> apiIds = apiService.findAllApiIdByOrgIdAuthenticity(id, type, tenantId, appId);
                    if (!apiIds.contains(api.getId())) {
                        return ServerResponse.createByError(1006);
                    }
            }
        }

        return ServerResponse.createBySuccess();
    }

}
