package com.changhong.iot.alarmservice.web.controller;

import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmData;
import com.changhong.iot.alarmservice.service.TAlarmDataService;
import com.sun.org.apache.regexp.internal.RE;

import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmData;
import com.changhong.iot.alarmservice.service.TAlarmDataService;

import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 告警控制层
 */
@RestController
@RequestMapping("/api/alarm")
public class AlarmController {
    @Autowired
    private TAlarmDataService tAlarmDataService;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：添加告警数据
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/16:21
     * 修改人：
     * 修改时间：2018\5\11 0011/16:21
     * 修改备注:
     *
     * @param tAlarmData 添加的告警数据
     * @return 返回一个map，里面有添加是否成功的信息！
     */
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Map addAlarmData(@RequestBody TAlarmData tAlarmData) {
        Map map = null;
        try {
            map = tAlarmDataService.addAlarmData(tAlarmData);
        } catch (Exception e) {
            e.printStackTrace();
            map = APIResult.getFailure(0);
        }
        return map;
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.web.controller
     * 方法描述：
     * 创建人: @author zhanlang
     * 创建时间：2018\5\14 0014/16:03
     * 修改人：
     * 修改时间：2018\5\14 0014/16:03
     * 修改备注:
     *
     * @param start 查询索引，
     * @param count 每页显示条数
     * @param alarmName 告警名称
     * @param serviceName 子服务名称
     * @param alarmType 告警类型
     * @param alarmData 告警内容
     * @return Map 返回查询结果
     */
    @RequestMapping(value = "/list",method = RequestMethod.GET)
    public Map alarmDataList(Integer start, Integer count, String alarmName, String serviceName,
                             String alarmType, String alarmData, String startTime,String endTime) {
        Map map = null;
        try {
            map = tAlarmDataService.alarmDataList(start,count,alarmName,serviceName,alarmType,alarmData,startTime,endTime);
        } catch (Exception e) {
            e.printStackTrace();
            map =  APIResult.getFailure(0);
        }
        return map;
    }


    @RequestMapping("/exportExcel")
    public void exportExcel(Integer start, Integer count, String alarmName, String serviceName,
                            String alarmType, String alarmData, String startTime, String endTime, @RequestParam Integer excelType, HttpServletResponse response) {
        try {
            tAlarmDataService.exportExcel(start,count,alarmName,serviceName,alarmType,alarmData,startTime,endTime, excelType,response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}