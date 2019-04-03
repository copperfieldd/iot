package com.changhong.iot.alarmservice.web.controller;

import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TNotifyType;
import com.changhong.iot.alarmservice.service.TNotifyTypeService;
import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.changhong.iot.alarmservice.base.controller.BaseController;
import com.changhong.iot.alarmservice.dao.TNotifyTypeDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TNotifyType;
import com.changhong.iot.alarmservice.service.TNotifyTypeService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 通知策略控制层
 */
@RestController
@RequestMapping("/api/policy")
public class TNotifyTypeController extends BaseController {
    @Autowired
    private TNotifyTypeService tNotifyTypeService;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：添加通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/16:48
     * 修改人：
     * 修改时间：2018\5\9 0009/16:48
     * 修改备注:
     *
     * @param tNotifyType 添加的数据
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Map addTNotifyType(@RequestBody TNotifyType tNotifyType) {
        Map map = null;
        try {
            map = tNotifyTypeService.addTNotifyType(tNotifyType);
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(1001);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：删除通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/17:54
     * 修改人：
     * 修改时间：2018\5\9 0009/17:54
     * 修改备注:
     *
     * @param id 需要删除的id
     */
    @RequestMapping(value = "/del", method = RequestMethod.GET)
    public Map deleteTNotifyType(String id, boolean flag) {
        Map map = null;
        try {
            map = tNotifyTypeService.deleteTNotifyType(id, flag);
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(1);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：修改通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/18:13
     * 修改人：
     * 修改时间：2018\5\9 0009/18:13
     * 修改备注:
     *
     * @param tNotifyType 修改的数据
     */
    @RequestMapping(value = "/upd", method = RequestMethod.POST)
    public Map updateTNotifyType(@RequestBody TNotifyType tNotifyType) {
        try {
            return tNotifyTypeService.updateTNotifyType(tNotifyType);
        } catch (Exception e) {
            e.printStackTrace();
            return APIResult.getFailure(1);
        }
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：查询通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/9:52
     * 修改人：
     * 修改时间：2018\5\10 0010/9:52
     * 修改备注:
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public com.changhong.iot.alarmservice.base.dto.APIResult searchTNotifyType(Integer start, Integer count, String notifyName, String serviceName, String interFaceName, String startTime, String endTime) {
        Map map = null;
        try {
            if (null == start) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"start"});
            }
            if (null == count) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"count"});
            }
            map = tNotifyTypeService.searchTNotifyType(start, count, notifyName, serviceName, interFaceName, startTime, endTime);
            return com.changhong.iot.alarmservice.base.dto.APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1);
        }
    }
}
