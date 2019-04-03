package com.changhong.iot.alarmservice.web.controller;


import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmType;
import com.changhong.iot.alarmservice.service.TAlarmTypeService;
import org.codehaus.jackson.map.Serializers;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.changhong.iot.alarmservice.base.controller.BaseController;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmType;
import com.changhong.iot.alarmservice.service.TAlarmTypeService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 告警类型控制层
 */
@RestController
@RequestMapping("/api/type")
public class TAlarmTypeController extends BaseController{

    @Autowired
    private TAlarmTypeService tAlarmTypeService;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.web.controller
     * 添加告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:46
     * 修改人：
     * 修改时间：2018\5\9 0009/10:46
     * 修改备注:
     *
     * @param tAlarmType 添加的告警类型数据
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Map addTAlarmType(@RequestBody TAlarmType tAlarmType) {
        Map map = null;
        try {
            map = tAlarmTypeService.addTAlarmType(tAlarmType);
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
     * 方法描述：删除告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:24
     * 修改人：
     * 修改时间：2018\5\9 0009/11:24
     * 修改备注:
     * @param id 需要删除的数据的id
     */
    @RequestMapping(value = "/del", method = RequestMethod.GET)
    public Map deleteTalrmType(String id,boolean flag) {
        Map map = null;
        try {
            map = tAlarmTypeService.deleteTalrmType(id,flag);
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
     * 方法描述：修改告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:42
     * 修改人：
     * 修改时间：2018\5\9 0009/11:42
     * 修改备注:
     * @param tAlarmType 修改后的数据
     */
    @RequestMapping(value = "/upd",method = RequestMethod.POST)
    public Map updateTAlarmType(@RequestBody TAlarmType tAlarmType){
        Map map = null;
        try {
            map = tAlarmTypeService.updateTAlarmType(tAlarmType);
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
     * 方法描述：查询告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/14:21
     * 修改人：
     * 修改时间：
     * 修改备注:
     */
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public com.changhong.iot.alarmservice.base.dto.APIResult searchTAlarmType(Integer start, Integer count, String alarmName, String alarmType, String startTime, String endTime ){
        try {

            if (null == start) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"start"});
            }
            if (null == count) {
                return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1009).setValue(new String[]{"count"});
            }
            Map  map = tAlarmTypeService.searchTAlarmType(start,count,alarmName,alarmType,startTime,endTime);
            return com.changhong.iot.alarmservice.base.dto.APIResult.success().setValue(map);
        } catch (Exception e) {
            e.printStackTrace();
            return com.changhong.iot.alarmservice.base.dto.APIResult.failure(1);
        }
    }
}
