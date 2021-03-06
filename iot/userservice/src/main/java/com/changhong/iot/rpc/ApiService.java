package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.ApiOptDto;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： RoleService
 * 包名：com.changhong.iot.rpc
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/23 15:06
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/10/23 15:06
 * 修改备注：
 */
@FeignClient("zuul")
public interface ApiService {

    @GetMapping("/permissionservice/api/interface/items")
    public List<ApiOptDto> findByApiIds(@RequestParam("ids") List<String> ids, @RequestHeader("Authorization") String token);

    @GetMapping("/permissionservice/api/interface/delByApp")
    public ServerResponse deleteByAppId(@RequestParam("appId") String appId, @RequestHeader("Authorization") String token);

}
