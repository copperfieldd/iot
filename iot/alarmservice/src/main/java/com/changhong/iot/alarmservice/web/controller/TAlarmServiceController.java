package com.changhong.iot.alarmservice.web.controller;

import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.service.TAlarmServiceService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.changhong.iot.alarmservice.base.controller.BaseController;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.service.TAlarmServiceService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.Pattern;
import java.util.Map;

/**
 * 子服务控制层
 */
@RestController
@RequestMapping("/api/alarmService")
public class TAlarmServiceController extends BaseController {
    @Autowired
    private TAlarmServiceService alarmServiceService;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述: 添加子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:37
     * 修改人：
     * 修改时间：2018\5\9 0009/10:37
     * 修改备注:
     * @param tAlarmService 添加子服务的数据
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Map addAlarmService(@RequestBody TAlarmService tAlarmService) {
        Map map = null;
        try {
            map = alarmServiceService.addAlarmService(tAlarmService);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(1);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述: 删除子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:37
     * 修改人：
     * 修改时间：2018\5\9 0009/10:37
     * 修改备注:
     * @param id 需要删除的数据的id
     */
    @RequestMapping(value = "/del")
    public Map deleteAlarmService(String id,@RequestParam(defaultValue = "false") boolean flag) {
        Map map = null;
        try {
            map = alarmServiceService.deleteAlarmService(id,flag);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(1);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述: 修改子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:37
     * 修改人：
     * 修改时间：2018\5\9 0009/10:37
     * 修改备注:
     * @param tAlarmService 修改的数据
     */
    @RequestMapping(value = "/upd", method = RequestMethod.POST)
    public Map updateAlarmService(@RequestBody TAlarmService tAlarmService) {
        Map map = null;
        try {
            map = alarmServiceService.updateAlarmService(tAlarmService);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(1);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述: 查询子服务名称
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:37
     * 修改人：
     * 修改时间：2018\5\9 0009/10:37
     * 修改备注:
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public com.changhong.iot.alarmservice.base.dto.APIResult searchAlarmService(Integer start, Integer count, String serviceName, String startTime, String endTime) {
        Map map = null;
        try {
            if (null == start) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"start"});
            }
            if (null == count) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"count"});
            }
            map = alarmServiceService.searchAlarmService(start,count,serviceName,startTime,endTime);
            return com.changhong.iot.alarmservice.base.dto.APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1);
        }
    }
}
