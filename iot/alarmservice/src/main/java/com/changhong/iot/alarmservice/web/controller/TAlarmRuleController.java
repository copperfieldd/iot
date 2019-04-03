package com.changhong.iot.alarmservice.web.controller;

import com.changhong.iot.alarmservice.base.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.service.TAlarmRuleService;
import com.changhong.iot.alarmservice.util.EmptyUtil;
import org.apiguardian.api.API;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.changhong.iot.alarmservice.base.controller.BaseController;


import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 告警规则控制层
 */
@RestController
@RequestMapping("/api/rule")
public class TAlarmRuleController extends BaseController {
    @Autowired
    private TAlarmRuleService tAlarmRuleService;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：添加告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/13:43
     * 修改人：
     * 修改时间：2018\5\10 0010/13:43
     * 修改备注:
     *
     * @param tAlarmRule 需要添加的数据
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public APIResult addTAlarmRule(@RequestBody TAlarmRule tAlarmRule) {

        try {
            if (EmptyUtil.isEmpty(tAlarmRule.getRuleName())) {
                return APIResult.failure(1009).setValue(new String[]{"name"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAccessKey())) {
                return APIResult.failure(1009).setValue(new String[]{"accessKey"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAlarmTypeId())) {
                return APIResult.failure(1009).setValue(new String[]{"typeId"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAlarmContent())) {
                return APIResult.failure(1009).setValue(new String[]{"data"});
            }
            if (tAlarmRule.getContentMatchType() == null) {
                return APIResult.failure(1009).setValue(new String[]{"rule"});
            }
            tAlarmRuleService.addTAlarmRule(tAlarmRule);
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1001);
        }
    }


    /**
     * 告警规则详情
     *
     * @param id
     * @return
     */
    @GetMapping("item")
    public APIResult item(String id) {
        try {
            final Map item = tAlarmRuleService.item(id);
            return com.changhong.iot.alarmservice.base.dto.APIResult.success().setValue(item);

        } catch (Exception e) {
            e.printStackTrace();
            return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1001);
        }
    }


    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：删除告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/16:11
     * 修改人：
     * 修改时间：2018\5\10 0010/16:11
     * 修改备注:
     *
     * @param id 需要删除数据的id
     */
    @RequestMapping(value = "/del", method = RequestMethod.GET)
    public Map deletTAlarmRule(String id) {
        try {
            final Map map = tAlarmRuleService.deleteTAlarmRule(id);
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            return com.changhong.iot.alarmservice.dto.APIResult.getFailure(0);
        }
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：修改告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/9:01
     * 修改人：
     * 修改时间：2018\5\11 0011/9:01
     * 修改备注:
     *
     * @param tAlarmRule 修改后的数据
     */
    @RequestMapping(value = "/upd", method = RequestMethod.POST)
    public APIResult updateTAlarmRule(@RequestBody TAlarmRule tAlarmRule) {
        try {
            if (EmptyUtil.isEmpty(tAlarmRule.getId())) {
                return APIResult.failure(1009).setValue(new String[]{"id"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getRuleName())) {
                return APIResult.failure(1009).setValue(new String[]{"name"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAccessKey())) {
                return APIResult.failure(1009).setValue(new String[]{"accessKey"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAlarmTypeId())) {
                return APIResult.failure(1009).setValue(new String[]{"typeId"});
            }
            if (EmptyUtil.isEmpty(tAlarmRule.getAlarmContent())) {
                return APIResult.failure(1009).setValue(new String[]{"data"});
            }
            if (tAlarmRule.getContentMatchType() == null) {
                return APIResult.failure(1009).setValue(new String[]{"rule"});
            }
            tAlarmRuleService.updateTAlarmRule(tAlarmRule);
            return APIResult.success();
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：分页列表显示
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/11:20
     * 修改人：
     * 修改时间：2018\5\11 0011/11:20
     * 修改备注:
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public APIResult findAll(Integer start, Integer count, String ruleName, String serviceName, String alarmType, String startTime, String endTime) {
        try {
            Map map = tAlarmRuleService.findAll(start, count, ruleName, serviceName, alarmType, startTime, endTime);
            return APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.failure(1);
        }
    }

}
