package com.changhong.iot.alarmservice.service.impl;

import com.changhong.iot.alarmservice.entity.*;
import com.changhong.iot.alarmservice.service.TNotifyTypeService;
import com.changhong.iot.alarmservice.util.*;

import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.dao.TNotifyTypeDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TNotifyType;
import com.changhong.iot.alarmservice.util.EmptyUtil;
import com.changhong.iot.alarmservice.util.HttpClientUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 通知策略业务层
 */
@Service
public class TNotifyTypeServiceImpl implements TNotifyTypeService {
    @Autowired
    private TNotifyTypeDao tNotifyTypeDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service
     * 方法描述：添加通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/16:46
     * 修改人：
     * 修改时间：2018\5\9 0009/16:46
     * 修改备注:
     *
     * @param tNotifyType 添加的数据
     */
    @Override
    public Map addTNotifyType(TNotifyType tNotifyType) throws Exception {
        //判断必要数据是否为空
        String notifyName = tNotifyType.getNotifyName();
        if (EmptyUtil.isEmpty(notifyName)) {
            return APIResult.getFailure(1009, new String[]{"name"});
        } else {
            List<TNotifyType> list = tNotifyTypeDao.findByProp("notifyName", notifyName);
            if (list.size() > 0) {
                return APIResult.getFailure(1010, new String[]{"name"});
            }
        }

        if (EmptyUtil.isEmpty(tNotifyType.getInterfaceName())) {
            return APIResult.getFailure(1009, new String[]{"interface"});
        }


        if (EmptyUtil.isEmpty(tNotifyType.getAccessKey())) {
            return APIResult.getFailure(1009, new String[]{"accessKey"});
        }

        if (EmptyUtil.isEmpty(tNotifyType.getNotifyUrl())) {
            return APIResult.getFailure(1009, new String[]{"Address"});
        } else {
            boolean flag = HttpClientUtil.testUrlWithTimeOut(tNotifyType.getNotifyUrl(), 5000);
            if (!flag) {
                return APIResult.getFailure(1017,new String[]{"Address"});
            }
        }

        tNotifyType.setCreateTime(new Date());
        tNotifyType.setUpdateTime(new Date());
        tNotifyType.setId(UUIDUtil.getUUID());
        tNotifyType.setDeletedFlag(false);
        tNotifyTypeDao.save(tNotifyType);
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud
     * 方法描述：删除通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/17:58
     * 修改人：
     * 修改时间：2018\5\9 0009/17:58
     * 修改备注:
     *
     * @param id 删除数据的id
     */
    @Override
    public Map deleteTNotifyType(String id, boolean flag) throws Exception {
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009, new String[]{"id"});
        }
        TNotifyType tNotifyType = tNotifyTypeDao.find(id);
        if (null == tNotifyType) {
            return APIResult.getFailure(1012);
        }


        //判断是否关联告警规则
//        if (flag) {
//            List<TAlarmRule> list = tAlarmRuleDao.findByProp("notifyId", id);
//            if (list.size() > 0) {
//                for (TAlarmRule tAlarmRule : list) {
//                    tAlarmRuleDao.delete(tAlarmRule.getId());
//                }
//            } else {
//                return APIResult.getFailure(1013);
//            }
//        }

        tNotifyTypeDao.updateOneByProp("id", id, "deletedFlag", true);
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：修改通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/18:15
     * 修改人：
     * 修改时间：2018\5\9 0009/18:15
     * 修改备注:
     *
     * @param tNotifyType 修改的数据
     */
    @Override
    public Map updateTNotifyType(TNotifyType tNotifyType) throws Exception {
        if (null == tNotifyType) {
            return APIResult.getFailure(1012);
        }

        String id = tNotifyType.getId();
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009, new String[]{"id"});
        }

        TNotifyType oldTNotifyType = tNotifyTypeDao.find(id);
        if (null == oldTNotifyType) {
            return APIResult.getFailure(1012);
        }

        String notifyName = tNotifyType.getNotifyName();
        if (EmptyUtil.isEmpty(notifyName)) {
            return APIResult.getFailure(1009, new String[]{"name"});
        }
        if (!notifyName.equals(oldTNotifyType.getNotifyName())) {
            List<TNotifyType> list = tNotifyTypeDao.findByProp("notifyName", notifyName);
            if (list.size() > 0) {
                return APIResult.getFailure(1010, new String[]{"name"});
            }
        }


        if (EmptyUtil.isEmpty(tNotifyType.getAccessKey())) {
            return APIResult.getFailure(1009, new String[]{"serviceName"});
        }

        if (EmptyUtil.isEmpty(tNotifyType.getNotifyUrl())) {
            return APIResult.getFailure(1009, new String[]{"address"});
        }

        tNotifyType.setCreateTime(oldTNotifyType.getCreateTime());
        tNotifyType.setUpdateTime(new Date());
        tNotifyType.setDeletedFlag(false);
        tNotifyTypeDao.save(tNotifyType);

        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：查询通知策略
     * 创建人: @author zhanlang
     * 创建时间：2018\5\10 0010/9:53
     * 修改人：
     * 修改时间：2018\5\10 0010/9:53
     * 修改备注:
     */
    @Override
    public Map searchTNotifyType(Integer start, Integer count, String notifyName, String serviceName, String interFaceName, String startTime, String endTime) throws Exception {
        List<AggregationOperation> aggList = new ArrayList<>();
        LookupOperation lookup2 = LookupOperation.newLookup()
                .from(ModelConstants.T_ALARM_SERVICE)
                .localField(ModelConstants.ACCESS_KEY)
                .foreignField(ModelConstants.ACCESS_KEY)
                .as("service");
        aggList.add(lookup2);
        aggList.add(Aggregation.unwind("service"));

        if (EmptyUtil.isNotEmpty(notifyName)) {
            aggList.add(Aggregation.match(Criteria.where(ModelConstants.NOTIFY_NAME).regex(notifyName)));
        }
        if (EmptyUtil.isNotEmpty(serviceName)) {
            aggList.add(Aggregation.match(Criteria.where("service." + ModelConstants.SERVICE_NAME).regex(serviceName)));
        }
        if (EmptyUtil.isNotEmpty(interFaceName)) {
            aggList.add(Aggregation.match(Criteria.where(ModelConstants.INTERFACE_NAME).regex(interFaceName)));
        }

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

        aggList.add(Aggregation.match(Criteria.where(ModelConstants.DELETED_FLAG).is(false)));

        GroupOperation totalCount = Aggregation.group().count().as("totalCount");
        aggList.add(totalCount);

        Aggregation aggregation = Aggregation.newAggregation(aggList);
        List<HashMap> totalList = mongoTemplate.aggregate(aggregation, ModelConstants.T_NOTIFY_TYPE, HashMap.class).getMappedResults();
        if (totalList.size() == 0) {
            return PageUtil.check(0, new ArrayList());
        }

        aggList.add(Aggregation.sort(new Sort(Sort.Direction.DESC, ModelConstants.UPDATE_TIME)));
        aggList.remove(totalCount);
        ProjectionOperation project = Aggregation.project()
                .and(ModelConstants.NOTIFY_NAME).as("notifyName")
                .and("service." + ModelConstants.SERVICE_NAME).as("serviceName")
                .and("service." + ModelConstants.ACCESS_KEY).as("accessKey")
                .and("service." + ModelConstants.DESC).as("desc")
                .and(ModelConstants.NOTIFY_URL).as("notifyUrl")
                .and(ModelConstants.INTERFACE_NAME).as("interFaceName")
                .and(ModelConstants.NOTIFY_URL_DESC).as("urlDesc")
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
        List<HashMap> mappList = mongoTemplate.aggregate(aggregation, ModelConstants.T_NOTIFY_TYPE, HashMap.class).getMappedResults();
        mappList.forEach(item -> {
            item.put("createTime", StringUtil.getTime((Date) item.get("createTime")));

        });

        Map map = new HashMap();
        map.put("totalCount", totalList.get(0).get("totalCount"));
        map.put("value", mappList);

        return PageUtil.check((Integer) totalList.get(0).get("totalCount"), mappList);
    }
}
