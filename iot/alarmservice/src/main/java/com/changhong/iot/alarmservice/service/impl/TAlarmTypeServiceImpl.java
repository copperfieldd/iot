package com.changhong.iot.alarmservice.service.impl;

import com.changhong.iot.alarmservice.entity.ModelConstants;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TAlarmType;
import com.changhong.iot.alarmservice.service.TAlarmTypeService;
import com.changhong.iot.alarmservice.system.Cache;
import com.changhong.iot.alarmservice.util.*;

import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.dao.TAlarmTypeDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.dto.TAlarmTypeDto;
import com.changhong.iot.alarmservice.util.EmptyUtil;
import com.changhong.iot.alarmservice.util.EntityUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 告警类型的业务层
 */
@Service
public class TAlarmTypeServiceImpl implements TAlarmTypeService {

    @Autowired
    private TAlarmTypeDao tAlarmTypeDao;
    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述: 添加告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/10:51
     * 修改人：
     * 修改时间：2018\5\9 0009/10:51 2018\5\9 0009
     * 修改备注:
     *
     * @param tAlarmType 添加的数据
     */
    @Override
    public Map addTAlarmType(TAlarmType tAlarmType) throws Exception {
        if (null == tAlarmType) {
            return APIResult.getFailure(1009, new String[]{"data"});
        }

        String alarmName = tAlarmType.getAlarmName();
        if (EmptyUtil.isEmpty(alarmName)) {
            return APIResult.getFailure(1009, new String[]{"name"});
        }

        List<TAlarmType> nameList = tAlarmTypeDao.findByProp("alarmName", alarmName);
        if (nameList.size() > 0) {
            return APIResult.getFailure(1010, new String[]{"name"});
        }

        String alarmType = tAlarmType.getAlarmType();
        if (EmptyUtil.isEmpty(alarmType)) {
            return APIResult.getFailure(1009, new String[]{"alarmType"});
        }

        List<TAlarmType> typeList = tAlarmTypeDao.findByProp("alarmType", alarmType);
        if (typeList.size() > 0) {
            return APIResult.getFailure(1010, new String[]{"alarmType"});
        }

        tAlarmType.setAlarmType(alarmType);
        tAlarmType.setCreateTime(new Date());
        tAlarmType.setUpdateTime(new Date());
        tAlarmType.setDeletedFlag(false);
        tAlarmType.setId(UUIDUtil.getUUID());
        tAlarmTypeDao.save(tAlarmType);

        Map map = new HashMap();
        map.put("alarmName", tAlarmType.getAlarmName());
        map.put("alarmType", tAlarmType.getAlarmType());
        map.put("alarmDesc", tAlarmType.getAlarmDesc());
        map.put("createTime", StringUtil.getTime(tAlarmType.getCreateTime()));
        map.put("id", tAlarmType.getId());
        //更新缓存
        Map typeMap = (Map) Cache.map.get("typeMap");
        typeMap.put(tAlarmType.getAlarmType(), tAlarmType);
        return APIResult.getSuccess(map);
    }

    /**
     * 版权 @Copyright:  www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：删除告警类型
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:28
     * 修改人：
     * 修改时间：2018\5\9 0009/11:28
     * 修改备注:
     *
     * @param id 需要删除的数据的id
     */
    @Override
    public Map deleteTalrmType(String id, boolean flag) throws Exception {
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009, new String[]{"id"});
        }

        TAlarmType tAlarmType = tAlarmTypeDao.find(id);
        if (null == tAlarmType) {
            return APIResult.getFailure(1012);
        }


        //判断是否关联告警规则
//        List<TAlarmRule> list = tAlarmRuleDao.findByProp("alarmType", tAlarmType.getAlarmType());
//        if (list.size() > 0) {
//            if (flag) {
//                for (TAlarmRule tAlarmRule : list) {
//                    tAlarmTypeDao.updateOneByProp("id", id, "deletedFlag", true);
//                }
//            } else {
//                return APIResult.getFailure("该告警类型关联了告警规则，你确定要删除?");
//            }
//        }

        tAlarmTypeDao.updateOneByProp("id", id, "deletedFlag", true);

        //更新缓存
        Map typeMap = (Map) Cache.map.get("typeMap");
        typeMap.remove(tAlarmType.getAlarmType());
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:45
     * 修改人：
     * 修改时间：2018\5\9 0009/11:45
     * 修改备注:
     *
     * @param tAlarmType 修改后的数据
     */
    @Override
    public Map updateTAlarmType(TAlarmType tAlarmType) throws Exception {
        if (null == tAlarmType) {
            return APIResult.getFailure(1009, new String[]{"data"});
        }

        String id = tAlarmType.getId();
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009, new String[]{"id"});
        }

        TAlarmType oldTAlarmType = tAlarmTypeDao.find(id);
        if (null == oldTAlarmType) {
            return APIResult.getFailure(1012);
        }

        String oldAlarmType = oldTAlarmType.getAlarmType();
        if (oldAlarmType.equals("sys_info") &&
                oldAlarmType.equals("sys_warn")
                && oldAlarmType.equals("sys_error")) {
            return APIResult.getFailure(1006);
        }


        String alarmName = tAlarmType.getAlarmName();
        if (EmptyUtil.isEmpty(alarmName)) {
            return APIResult.getFailure(1009, new String[]{"name"});
        }

        if (!oldTAlarmType.getAlarmName().equals(tAlarmType.getAlarmName())) {
            List<TAlarmType> listName = tAlarmTypeDao.findByProp("alarmName", alarmName);
            if (listName.size() > 0) {
                return APIResult.getFailure(1010, new String[]{"name"});
            }
        }
        String alarmType = tAlarmType.getAlarmType();
//        String alarmType = "user_" + tAlarmType.getAlarmType();
        if (EmptyUtil.isEmpty(alarmType)) {
            return APIResult.getFailure(1009, new String[]{"alarmType"});
        }

        if (!oldTAlarmType.getAlarmType().equals(tAlarmType.getAlarmType())) {
            List<TAlarmType> listType = tAlarmTypeDao.findByProp("alarmType", alarmType);
            if (listType.size() > 0) {
                return APIResult.getFailure(1010, new String[]{"alarmType"});
            }
        }

        tAlarmType.setCreateTime(oldTAlarmType.getCreateTime());
        tAlarmType.setUpdateTime(new Date());
        tAlarmType.setDeletedFlag(false);
        tAlarmTypeDao.save(tAlarmType);

        //更新缓存
        Map typeMap = (Map) Cache.map.get("typeMap");
        typeMap.put(tAlarmType.getAlarmType(), tAlarmType);
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称： alarmservice
     * 包名：
     * 方法描述：
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/14:26
     * 修改人：
     * 修改时间：2018\5\9 0009/14:26
     * 修改备注:
     */
    @Override
    public Map searchTAlarmType(Integer start, Integer count, String alarmName, String alarmType, String startTime,
                                String endTime) throws Exception {
        Query query = new Query();
        if (EmptyUtil.isNotEmpty(alarmName)) {
            query.addCriteria(Criteria.where("alarmName").regex(alarmName));
        }
        if (EmptyUtil.isNotEmpty(alarmType)) {
            query.addCriteria(Criteria.where("alarmType").regex(alarmType));
        }

        if (null == startTime) {
            if (null != endTime) {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).lte(StringUtil.getTime(endTime)));
            }
        } else {
            if (null == endTime) {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(StringUtil.getTime(startTime)));
            } else {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(StringUtil.getTime(startTime)).lte
                        (StringUtil.getTime(endTime)));
            }
        }
        query.addCriteria(Criteria.where("deletedFlag").is(false));
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.CREATE_TIME));
        long totalCOunt = mongoTemplate.count(query, TAlarmType.class);
        query.skip(start);
        query.limit(count);
        List<TAlarmType> list = mongoTemplate.find(query, TAlarmType.class);
        List data = EntityUtil.entityListToDtoList(list, TAlarmTypeDto.class);
        Map map = PageUtil.check(totalCOunt, data);
        return map;
    }
}
