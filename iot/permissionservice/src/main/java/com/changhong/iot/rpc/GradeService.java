package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/24 11:35
 */
@Component
public class GradeService {

    @Resource
    private GradeRPC gradeRPC;

    public List<String> getApiIdsByTenantId(String tenantId) {

        ServerResponse<List<String>> serverResponse = gradeRPC.getApiByTenant(tenantId, MyThreadLocal.getToken());

        if (serverResponse.getStatus() != 0) {
            return new ArrayList<>();
        }

        return serverResponse.getValue();
    }

    public List<String> getMenuIdsByTenantId(String tenantId) {

        ServerResponse<List<String>> serverResponse = gradeRPC.getMenuByTenant(tenantId, MyThreadLocal.getToken());

        if (serverResponse.getStatus() != 0) {
            return new ArrayList<>();
        }

        return serverResponse.getValue();
    }
}
