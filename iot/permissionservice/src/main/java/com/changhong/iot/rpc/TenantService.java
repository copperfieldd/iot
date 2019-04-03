package com.changhong.iot.rpc;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： TenantService
 * 包名：com.changhong.iot.rpc
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/24 15:05
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/10/24 15:05
 * 修改备注：
 */
@Component
public class TenantService {

    @Resource
    private TenantRPC tenantRPC;

    public List<String> findPids(String tenantId) throws ByteException {

        ServerResponse<List<String>> serverResponse = tenantRPC.getPids(tenantId, MyThreadLocal.getToken());

        if (serverResponse.getStatus() != 0) {
            return new ArrayList<>();
        }

        return serverResponse.getValue();
    }

}
