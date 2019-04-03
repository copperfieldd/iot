package com.changhong.iot.rpc;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.TenantDto;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： TenantRPC
 * 包名：com.changhong.iot.rpc
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/24 15:03
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/10/24 15:03
 * 修改备注：
 */
@FeignClient("zuul")
public interface TenantRPC {

    @GetMapping("/userservice/api/tenant/pids")
    public ServerResponse<List<String>> getPids(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

}
