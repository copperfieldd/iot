package com.changhong.iot.alarmservice.service.impl;

import com.changhong.iot.alarmservice.entity.*;
import com.changhong.iot.alarmservice.service.TAlarmRuleService;
import com.changhong.iot.alarmservice.system.Cache;
import com.changhong.iot.alarmservice.util.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.dao.TAlarmServiceDao;
import com.changhong.iot.alarmservice.dao.TAlarmTypeDao;
import com.changhong.iot.alarmservice.dao.TNotifyTypeDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.util.EmptyUtil;

import java.util.*;

/**
 * 告警规则业务逻辑层
 */
@Service
public class TAlarmRuleServiceImpl implements TAlarmRuleService {
    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;
    @Autowired
    private TAlarmServiceDao tAlarmServiceDao;
    @Autowired
    private TAlarmTypeDao tAlarmTypeDao;
    @Autowired
    private TNotifyTypeDao tNotifyTypeDao;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：添加告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/13:44
     * 修改人：
     * 修改时间：2018\5\10 0010/13:44
     * 修改备注:
     *
     * @param tAlarmRule 需要添加的数据
     */
    @Override
    public void addTAlarmRule(TAlarmRule tAlarmRule) throws Exception {


        tAlarmRule.setCreateTime(new Date());
        tAlarmRule.setId(UUIDUtil.getUUID());
        tAlarmRule.setUpdateTime(new Date());
        tAlarmRule.setDeletedFlag(false);
        tAlarmRuleDao.save(tAlarmRule);

        Map ruleMap = (Map) Cache.map.get("ruleMap");

        //存入缓存
        ruleMap.put(tAlarmRule.getId(), tAlarmRule);
    }


    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：删除告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/16:24
     * 修改人：
     * 修改时间：2018\5\10 0010/16:24
     * 修改备注:
     *
     * @param id 告警规则id
     */
    @Override
    public Map deleteTAlarmRule(String id) throws Exception {
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009,new String[]{"id"});
        }
        TAlarmRule tAlarmRule = tAlarmRuleDao.find(id);
        if (null == tAlarmRule) {
            return APIResult.getFailure(1012);
        }

        tAlarmRuleDao.updateOneByProp("id", id, ModelConstants.DELETED_FLAG, true);
        //删除对应的缓存
        Map ruleMap = (Map) Cache.map.get("ruleMap");
        ruleMap.remove(id);
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：修改告警规则
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/9:04
     * 修改人：
     * 修改时间：2018\5\11 0011/9:04
     * 修改备注:
     *
     * @param tAlarmRule 修改后的数据
     */
    @Override
    public void updateTAlarmRule(TAlarmRule tAlarmRule) throws Exception {

        TAlarmRule old = tAlarmRuleDao.find(tAlarmRule.getId());

        tAlarmRule.setCreateTime(old.getCreateTime());
        tAlarmRule.setDeletedFlag(old.isDeletedFlag());
        tAlarmRule.setUpdateTime(new Date());

        tAlarmRuleDao.update(tAlarmRule);
        //更新缓存
        Map ruleMap = (Map) Cache.map.get("ruleMap");
        ruleMap.put(tAlarmRule.getId(), tAlarmRule);
    }

    /**
     * 版权 @Copyright: 2018  www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：分页列表显示
     * 创建人: @author zhanlang
     * 创建时间：2018\5\11 0011/11:25
     * 修改人：
     * 修改时间：2018\5\11 0011/11:25
     * 修改备注:
     *
     * @param start 查询s索引
     * @param count 每页显示条数
     * @param ruleName
     * @param serviceName
     * @param alarmType
     * @param startTime
     * @param endTime
     * @return map 分页数据
     */
    @Override
    public Map findAll(Integer start, Integer count, String ruleName, String serviceName, String alarmType, String startTime, String endTime) throws Exception {
        List<AggregationOperation> aggList = new ArrayList<>();
        LookupOperation service = LookupOperation.newLookup()
                .from(ModelConstants.T_ALARM_SERVICE)
                .localField(ModelConstants.ACCESS_KEY)
                .foreignField(ModelConstants.ACCESS_KEY)
                .as("service");
        aggList.add(service);
        aggList.add(Aggregation.unwind("service"));

        LookupOperation type = LookupOperation.newLookup()
                .from(ModelConstants.T_ALARM_TYPE)
                .localField(ModelConstants.ALARM_TYPE_ID)
                .foreignField("_id")
                .as("type");
        aggList.add(type);
        aggList.add(Aggregation.unwind("type"));

        if (EmptyUtil.isNotEmpty(startTime)) {
            Date startDate = StringUtil.getTime(startTime);
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getTime(endTime);
                aggList.add(Aggregation.match(new Criteria(ModelConstants.CREATE_TIME).gte(startDate).lte(endDate)));
            } else {
                aggList.add(Aggregation.match(new Criteria(ModelConstants.CREATE_TIME).gte(startDate)));
            }
        } else {
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getTime(endTime);
                aggList.add(Aggregation.match(new Criteria(ModelConstants.CREATE_TIME).lte(endDate)));
            }
        }

        if (EmptyUtil.isNotEmpty(ruleName)) {
            aggList.add(Aggregation.match(Criteria.where(ModelConstants.RULE_NAME).regex(ruleName)));
        }
        if (EmptyUtil.isNotEmpty(serviceName)) {
            aggList.add(Aggregation.match(Criteria.where("service."+ModelConstants.SERVICE_NAME).regex(serviceName)));
        }
        if (EmptyUtil.isNotEmpty(alarmType)) {
            aggList.add(Aggregation.match(Criteria.where("type."+ModelConstants.ALARM_NAME).regex(alarmType)));
        }
        aggList.add(Aggregation.sort(new Sort(Sort.Direction.DESC, ModelConstants.CREATE_TIME)));
        aggList.add(Aggregation.match(Criteria.where(ModelConstants.DELETED_FLAG).is(false)));

        GroupOperation totalCount = Aggregation.group().count().as("totalCount");
        aggList.add(totalCount);

        Aggregation aggregation = Aggregation.newAggregation(aggList);

        List<HashMap> totalList = mongoTemplate.aggregate(aggregation, ModelConstants.T_ALARM_RULE, HashMap.class).getMappedResults();
        if (totalList.size() == 0) {
            return PageUtil.check(0, new ArrayList());
        }

        aggList.add(Aggregation.sort(new Sort(Sort.Direction.DESC, ModelConstants.CREATE_TIME)));

        aggList.remove(totalCount);
        ProjectionOperation project = Aggregation.project()
                .and(ModelConstants.RULE_NAME).as("ruleName")
                .and("service." + ModelConstants.SERVICE_NAME).as("serviceName")
                .and("type." + ModelConstants.ALARM_NAME).as("alarmType")
                .and(ModelConstants.MESSAGES).as("messages")
                .and(ModelConstants.NOTITY_ID).as("notifyId")
                .and(ModelConstants.EMAILS).as("emails")
                .and(ModelConstants.CREATE_TIME).as("createTime")
                .and("_id").as("id").andExclude("_id");
        aggList.add(project);

        if (null != start && count != null) {
            SkipOperation skip = Aggregation.skip(start);
            LimitOperation limit = Aggregation.limit(count);
            aggList.add(skip);
            aggList.add(limit);
        }

        AggregationOptions aggregationOptions = new AggregationOptions.Builder().allowDiskUse(true).build();
        aggregation = Aggregation.newAggregation(aggList).withOptions(aggregationOptions);
        List<HashMap> mappList = mongoTemplate.aggregate(aggregation, ModelConstants.T_ALARM_RULE, HashMap.class).getMappedResults();
        mappList.forEach(item -> {
            item.put("createTime", StringUtil.getTime((Date) item.get("createTime")));
            List messages = (List) item.remove("messages");
            List emails = (List) item.remove("emails");
            StringBuffer sb = new StringBuffer("");
            if (messages.size() > 0) {
                sb.append("短信,");
            }
            if (emails.size() > 0) {
                sb.append("邮件,");
            }
            if (item.remove("notifyId") != null) {
                sb.append("接口,");
            }
            String notify = sb.toString();
            if (notify.length() > 0 ) {
                notify = notify.substring(0, notify.length()-1);
            }
            item.put("notity", notify);

        });

        Map map = new HashMap();
        map.put("totalCount", totalList.get(0).get("totalCount"));
        map.put("value", mappList);

        return PageUtil.check((Integer) totalList.get(0).get("totalCount"), mappList);
    }

    /**
     * 告警规则详情
     *
     * @param id
     * @throws Exception
     */
    @Override
    public Map item(String id) throws Exception {
        final TAlarmRule rule = tAlarmRuleDao.find(id);
        Map map = new HashMap();
        map.put("id", rule.getId());
        map.put("ruleName", rule.getRuleName());
        final List<TAlarmService> accessKey = tAlarmServiceDao.findByProp(ModelConstants.ACCESS_KEY, rule.getAccessKey());
        if (accessKey.size() == 1) {
            map.put("serviceName", accessKey.get(0).getServiceName());
            map.put("accessKey", accessKey.get(0).getAccessKey());
        }

        final TAlarmType tAlarmType = tAlarmTypeDao.find(rule.getAlarmTypeId());
        if (tAlarmType != null) {
            HashMap<Object, Object> type = new HashMap<>();
            type.put("id", tAlarmType.getId());
            type.put("alarmName", tAlarmType.getAlarmName());
            map.put("alarmType", type);
        }

        map.put("alarmContent", rule.getAlarmContent());
        map.put("contentMatchType", rule.getContentMatchType());
//        map.put("notifyMeta",rule.getNotifyMeta());
        final TNotifyType tNotifyType = tNotifyTypeDao.find(rule.getNotifyId());
        if (tNotifyType != null) {
            Map notify = new HashMap<>();
            notify.put("interfaceName", tNotifyType.getInterfaceName());
            notify.put("notifyId", tNotifyType.getId());
            notify.put("url", tNotifyType.getNotifyUrl());
            List<TAlarmService> service = tAlarmServiceDao.findByProp(ModelConstants.ACCESS_KEY, tNotifyType.getAccessKey());
            if (service.size() == 1) {
                notify.put("serviceName", service.get(0).getServiceName());
            }

            map.put("notify", notify);

        }
        map.put("emails", rule.getEmails());
        map.put("messages", rule.getMessages());

        return map;
    }

}