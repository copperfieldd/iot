package com.changhong.iot.config;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dao.*;
import com.changhong.iot.entity.*;
import com.changhong.iot.service.ApiService;
import com.changhong.iot.service.MenuService;
import com.changhong.iot.util.EmptyUtil;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Component
public class Checkpermiss {

    @Resource
    private MenuService menuService;

    @Resource
    private ApiService apiService;

    public void checkPermiss(String orgId, List<String> menuIds, List<String> apiIds) throws ByteException {

        List<String> ids = null;

        if (EmptyUtil.isNotEmpty(menuIds)) {

            ids = menuService.findMenuIdsByOrgId(orgId);

            for (String menuId : menuIds) {
                if (!ids.contains(menuId)){
                    throw new ByteException(1012);
                }
            }
        }

        if (EmptyUtil.isNotEmpty(apiIds)) {

            ids = apiService.findAllApiIdByOrgId(orgId, false);

            for (String apiId : apiIds) {
                if (!ids.contains(apiId)) {
                    throw new ByteException(1012);
                }
            }
        }
    }

}
