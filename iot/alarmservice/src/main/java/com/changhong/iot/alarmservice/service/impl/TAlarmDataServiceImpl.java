package com.changhong.iot.alarmservice.service.impl;

import com.changhong.iot.alarmservice.entity.ModelConstants;
import com.changhong.iot.alarmservice.entity.TAlarmData;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.changhong.iot.alarmservice.AlarmServiceApplication;
import com.changhong.iot.alarmservice.dao.*;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.dto.TAlarmDataDto;
import com.changhong.iot.alarmservice.service.TAlarmDataService;
import com.changhong.iot.alarmservice.system.Cache;
import com.changhong.iot.alarmservice.util.EmptyUtil;
import com.changhong.iot.alarmservice.util.EntityUtil;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

//告警数据业务逻辑层
@Service
public class TAlarmDataServiceImpl implements TAlarmDataService {

    public static final Logger LOGGER = LoggerFactory.getLogger(AlarmServiceApplication.class);

    @Autowired
    private TAlarmDataDao tAlarmDataDao;
    @Autowired
    private TAlarmTypeDao tAlarmTypeDao;
    @Autowired
    private TAlarmServiceDao tAlarmServiceDao;
    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：添加告警数据
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/16:25
     * 修改人：
     * 修改时间：2018\5\11 0011/16:25
     * 修改备注:
     *
     * @param tAlarmData 添加的告警数据
     * @return 返回添加是否成功的信息
     */
    @Override
    public Map addAlarmData(TAlarmData tAlarmData) throws Exception {
        if (null == tAlarmData) {
            return APIResult.getFailure(1009, new String[]{"data"});
        }
//        String accessKey = tAlarmData.getAccessKey();
//        if (EmptyUtil.isEmpty((accessKey))) {
//            return APIResult.getFailure("访问子服务的key为空！！");
//        } else {
//            ConcurrentHashMap<String, TAlarmService> serviceMap = (ConcurrentHashMap<String, TAlarmService>) Cache.map.get("serviceMap");
//            if (!serviceMap.containsKey(accessKey)) {
//                return APIResult.getFailure("访问子服务key在数据库中不存在！！");
//            }
//            tAlarmData.setServiceName(serviceMap.get(accessKey).getServiceName());
//        }
//
//        if (EmptyUtil.isEmpty(tAlarmData.getAlarmTypeId())) {
//            return APIResult.getFailure("告警类型id为空！！");
//        }

        if (EmptyUtil.isEmpty(tAlarmData.getAlarmData())) {
            return APIResult.getFailure(1009, new String[]{"alarmData"});
        }

        //根据告警类容配置对应的告警规则，
        List<TAlarmRule> list = matchRule(tAlarmData);

        //执行通知策略
        LOGGER.info(list.toString());

        tAlarmData.setCreateTime(new Date());
        tAlarmData.setAlarmStatus(0);
        tAlarmData.setId(UUIDUtil.getUUID());


        tAlarmDataDao.save(tAlarmData);
        return APIResult.getSuccess();

    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：带条件的分页查询
     * 创建人: @author zhanlang
     * 创建时间：2018\5\14 0014/16:16
     * 修改人：
     * 修改时间：2018\5\14 0014/16:16
     * 修改备注:
     * 导出excel文件
     *
     * @param start       查询索引，
     * @param count       每页显示条数
     * @param alarmName   告警名称
     * @param serviceName 子服务名称
     * @param alarmType   告警类型
     * @param alarmData   告警内容
     * @param startTime
     * @param endTime
     * @return Map 返回查询结果
     */
    @Override
    public Map alarmDataList(Integer start, Integer count, String alarmName, String serviceName, String alarmType, String alarmData, String startTime, String endTime) throws Exception {
        if (null == start) {
            return APIResult.getFailure(1009,new String[]{"start"});
        }
        if (null == count) {
            return APIResult.getFailure(1009,new String[]{"count"});
        }

        Map map = pageLikeParams(start, count, alarmName, serviceName, alarmType, alarmData, startTime, endTime);


        return APIResult.getSuccess(map);
    }

    @Override
    public void exportExcel(Integer start, Integer count, String alarmName, String serviceName, String alarmType, String alarmData, String startTime, String endTime, Integer excelType, HttpServletResponse response) throws Exception {

        Map map = pageLikeParams(null, null, alarmName, serviceName, alarmType, alarmData, startTime, endTime);
        Vector<Vector<String>> rowName = new Vector<>();
        for (TAlarmDataDto item : (List<TAlarmDataDto>)map.get("value")) {
            Vector<String> row = new Vector<>();

            row.add(item.getAlarmName());
            row.add(item.getServiceName());
            row.add(item.getAlarmType());
            row.add(item.getAlarmData());
            row.add(item.getCreateTime());


            rowName.add(row);
        }

        //设置行名 Vector<String>
        Vector<String> rowTopName = new Vector<String>();
        rowTopName.add("alarmName");
        rowTopName.add("serviceName ");
        rowTopName.add("alarmType");
        rowTopName.add("alarmData");
        rowTopName.add("createTime");

        String excelName = "deviceExport" + StringUtil.getCurrTime();

        ServletOutputStream out = response.getOutputStream();

        if (excelType == 1) {
            response.setHeader("Export-Excel", URLEncoder.encode(excelName + ".xls", "UTF-8"));
        } else {
            response.setHeader("Export-Excel", URLEncoder.encode(excelName + ".xlsx", "UTF-8"));
        }
        //i为2003版本，其他为2007版本
        if (excelType == 1) {
            ExcelUtil.exportToExcelHSSF("sheet", rowTopName, rowName, out);
        } else {
            ExcelUtil.exportToExcelXSSF("sheet", rowTopName, rowName, out);
        }


        out.flush();
        out.close();
    }


    /**
     * 分页条件查询
     */
    public Map pageLikeParams(Integer start, Integer count, String alarmName, String serviceName, String alarmType, String alarmData, String startTime, String endTime) throws InstantiationException, IllegalAccessException {
        //多条件模糊分页分页查询
        Query query = new Query();
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.CREATE_TIME));

        //封装查询条件
        if (!EmptyUtil.isEmpty(alarmName)) {
            Pattern pattern = Pattern.compile("^.*" + alarmName + ".*$", Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("alarmName").regex(pattern));
        }

        if (!EmptyUtil.isEmpty(serviceName)) {
            Pattern pattern = Pattern.compile("^.*" + serviceName + ".*$", Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("serviceName").regex(pattern));
        }

        if (!EmptyUtil.isEmpty(alarmType)) {
            Pattern pattern = Pattern.compile("^.*" + alarmType + ".*$", Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("alarmType").regex(pattern));
        }

        if (!EmptyUtil.isEmpty(alarmData)) {
            Pattern pattern = Pattern.compile("^.*" + alarmData + ".*$", Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where("alarmData").regex(pattern));
        }
        if (EmptyUtil.isNotEmpty(startTime)) {
            Date startDate = StringUtil.getTime(startTime);
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getTime(endTime);
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(startDate).lte(endDate));
            } else {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(startDate));
            }
        } else {
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getTime(endTime);
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).lte(endDate));
            }
        }

        //总条数
        Long totalCount = mongoTemplate.count(query, TAlarmData.class);

        //分页查询
        if (null != start || count != null) {
            query.skip(start);
            query.limit(count);
        }
        List<TAlarmData> list = mongoTemplate.find(query, TAlarmData.class);

        //封装dto
        List dtoList = EntityUtil.entityListToDtoList(list, TAlarmDataDto.class);

        return PageUtil.check(totalCount, dtoList);
    }

    /**
     * 根据告警数据匹配告警规则
     *
     * @param tAlarmData 告警数据
     */
    private List<TAlarmRule> matchRule(TAlarmData tAlarmData) {

        //查询所有的告警规则
        ConcurrentHashMap<String, TAlarmRule> ruleMap = (ConcurrentHashMap) Cache.map.get("ruleMap");

        //告警数据对应的子服务id
        ConcurrentHashMap<String, TAlarmService> serviceMap = (ConcurrentHashMap) Cache.map.get("serviceMap");
//        TAlarmService tAlarmService = serviceMap.get(tAlarmData.getAccessKey());
//        String accessKey = tAlarmService.getAccessKey();


//        //对应的告警类型
//        String alarmTypeId = tAlarmData.getAlarmTypeId();
//
//        //告警内容
//        String alarmData = tAlarmData.getAlarmData();
//
//        //存储和告警数据匹配的告警规则
//        List<TAlarmRule> list = new ArrayList();
//
//        //进行规则匹配
//        for (TAlarmRule tAlarmRule : ruleMap.values()) {
//            //匹配子服务
//            if (!tAlarmRule.getAccessKey().equals("0")) {
//                if (!accessKey.equals(tAlarmRule.getAccessKey())) {
//                    continue;
//                }
//            }
//            //匹配告警类型
//            if (!tAlarmRule.getAlarmTypeId().equals("*")) {
//                if (!tAlarmData.getAlarmTypeId().equals(alarmTypeId)) {
//                    continue;
//                }
//            }
//
//            //匹配告警内容,完全匹配
//            if (tAlarmRule.getContentMatchType() == 0) {
//                String alarmContent = tAlarmRule.getAlarmContent();
//                if (!alarmData.equals(alarmContent)) {
//                    continue;
//                } else {
//                    continue;
//                }
//            } else {
//                //模糊匹配
//                if (alarmData.indexOf(tAlarmRule.getAlarmContent()) == -1) {
//                    continue;
//                }
//            }
//            list.add(tAlarmRule);
//        }
//        return list;
        return null;
    }
}