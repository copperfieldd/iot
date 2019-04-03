package com.changhong.iot.rpc;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UserDto;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： OrgController
 * 包名：com.changhong.iot.rpc
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/10/24 15:02
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/10/24 15:02
 * 修改备注：
 */
@FeignClient("zuul")
public interface OrgRPC {

    @PostMapping(value = "/userservice/api/login")
    public ServerResponse<UserDto> login(@RequestBody String reqBody);

    @GetMapping("/userservice/api/user/current")
    ServerResponse<UserDto> getCurrentUser(@RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/user/item")
    public ServerResponse<UserDto> findUserById(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/unit/item")
    public ServerResponse<UnitDto> findUnitById(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/unit/pids")
    public ServerResponse<List<String>> getPids(@RequestParam("id") String id, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/user/manager")
    public ServerResponse<UserDto> findManagerByAppId(@RequestParam("appId") String appId, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/unit/listByIds")
    public  ServerResponse<List<UnitDto> > findByUnitIds(@RequestParam("ids") List<String> ids, @RequestHeader("Authorization") String token);

    @GetMapping("/userservice/api/user/listByIds")
    public  ServerResponse<List<UserDto>> findByUserIds(@RequestParam("ids") List<String> ids, @RequestHeader("Authorization") String token);
}
