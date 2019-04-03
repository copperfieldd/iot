package com.changhong.iot.alarmservice.service.impl;

import com.changhong.iot.alarmservice.entity.ModelConstants;
import com.changhong.iot.alarmservice.entity.TAlarmRule;
import com.changhong.iot.alarmservice.entity.TAlarmService;
import com.changhong.iot.alarmservice.service.TAlarmServiceService;
import com.changhong.iot.alarmservice.system.Cache;
import com.changhong.iot.alarmservice.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.changhong.iot.alarmservice.base.dto.PageModel;
import com.changhong.iot.alarmservice.dao.TAlarmRuleDao;
import com.changhong.iot.alarmservice.dao.TAlarmServiceDao;
import com.changhong.iot.alarmservice.dto.APIResult;
import com.changhong.iot.alarmservice.dto.TAlarmServiceDto;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 子服务业务逻辑层
 */
@Service
public class TAlarmServiceServiceImpl implements TAlarmServiceService {

    @Autowired
    private TAlarmServiceDao tAlarmServiceDao;
    @Autowired
    private TAlarmRuleDao tAlarmRuleDao;

    @Autowired
    private MongoTemplate mongoTemplate;
    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:11
     * 修改人：添加子服务
     * 修改时间：2018\5\9 0009/11:11
     * 修改备注:
     *
     * @param tAlarmService 添加的数据
     */
    @Override
    public Map addAlarmService(TAlarmService tAlarmService) throws Exception {
        if (null == tAlarmService) {
            return APIResult.getFailure(1009,new String[]{"data"});
        }
        String serviceName = tAlarmService.getServiceName();
        //判断子服务名是否为空
        if (EmptyUtil.isEmpty(serviceName)) {
            //返回错误信息信息
            return APIResult.getFailure(1009,new String[]{"serviceName"});
        }
        if (EmptyUtil.isEmpty(tAlarmService.getServiceDesc())) {
            //返回错误信息信息
            return APIResult.getFailure(1009,new String[]{"desc"});
        }

        //判断子服务名称是否存在
        List<TAlarmService> list = tAlarmServiceDao.findByProp("serviceName", serviceName);
        if (list.size() > 0) {
            return APIResult.getFailure(1010,new String[]{"serviceName"});
        }
        //封装数据
        tAlarmService.setAccessKey(UUIDUtil.getUUID());
        tAlarmService.setCreateTime(new Date());
        tAlarmService.setUpdateTime(new Date());
        tAlarmService.setDeletedFlag(false);
        tAlarmService.setId(UUIDUtil.getUUID());
        tAlarmServiceDao.save(tAlarmService);

        //更新缓存
        Map serviceMap = (Map) Cache.map.get("serviceMap");
        serviceMap.put(tAlarmService.getAccessKey(), tAlarmService);
        //返回成功信息
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：删除子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:13
     * 修改人：
     * 修改时间：2018\5\9 0009/11:13
     * 修改备注:
     *
     * @param id 需要删除的数据的id
     */
    @Override
    public Map deleteAlarmService(String id, boolean flag) throws Exception {
        //查询id在mongo是否存在
        TAlarmService tAlarmService = tAlarmServiceDao.find(id);
        if (null == tAlarmService) {
            return APIResult.getFailure(1012);
        }


        //判断是否关联告警规则
        List<TAlarmRule> list = tAlarmRuleDao.findByProp("serviceId", id);
        if (list.size() > 0) {
            if (flag) {
                for (TAlarmRule tAlarmRule : list) {
                    tAlarmRuleDao.delete(tAlarmRule.getId());
                }
            } else {
                return APIResult.getFailure(1013);
            }
        }
        //执行删除
        tAlarmServiceDao.updateOneByProp("id", id, "deletedFlag", true);


        //更新缓存
        Map serviceMap = (Map) Cache.map.get("serviceMap");
        serviceMap.remove(tAlarmService.getAccessKey());
        return APIResult.getSuccess();
    }


    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：修改子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:14
     * 修改人：
     * 修改时间：2018\5\9 0009/11:14
     * 修改备注:
     *
     * @param tAlarmService 修改后的数据
     */
    @Override
    public Map updateAlarmService(TAlarmService tAlarmService) throws Exception {
        String id = tAlarmService.getId();
        if (EmptyUtil.isEmpty(id)) {
            return APIResult.getFailure(1009,new String[]{"id"});
        }

        TAlarmService oldTAlarmService = tAlarmServiceDao.find(id);
        if (null == oldTAlarmService) {
            return APIResult.getFailure(1009,new String[]{"id"});
        }

        tAlarmService.setAccessKey(oldTAlarmService.getAccessKey());
        String serviceName = tAlarmService.getServiceName();
        if (EmptyUtil.isEmpty(serviceName)) {
            return APIResult.getFailure(1009,new String[]{"serviceName"});
        }

        if (!oldTAlarmService.getServiceName().equals(tAlarmService.getServiceName())) {
            List<TAlarmService> list = tAlarmServiceDao.findByProp("serviceName", tAlarmService.getServiceName());
            if (list.size() > 0) {
                return APIResult.getFailure(1010,new String[]{"serviceName"});
            }
        }

        if (EmptyUtil.isEmpty(tAlarmService.getServiceDesc())) {
            return APIResult.getFailure(1009,new String[]{"desc"});
        }

        tAlarmService.setCreateTime(oldTAlarmService.getCreateTime());
        tAlarmService.setUpdateTime(new Date());
        tAlarmService.setDeletedFlag(oldTAlarmService.isDeletedFlag());
        tAlarmServiceDao.save(tAlarmService);
        //更新缓存
        Map serviceMap = (Map) Cache.map.get("serviceMap");
        serviceMap.put(tAlarmService.getAccessKey(), tAlarmService);
        return APIResult.getSuccess();
    }

    /**
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved
     * 项目名称：告警管理子服务
     * 文件名称：alarmservice
     * 包名：cn.bytecloud.service.impl
     * 方法描述：查询子服务
     * 创建人: @author zhanlang
     * 创建时间：2018\5\9 0009/11:15
     * 修改人：
     * 修改时间：2018\5\9 0009/11:15
     * 修改备注:
     */
    @Override
    public Map searchAlarmService(Integer start, Integer count, String serviceName, String startTime, String endTime) throws Exception {
        Query query = new Query();
        if (EmptyUtil.isNotEmpty(serviceName)) {
            Pattern pattern = Pattern.compile("^.*" + serviceName + ".*$", Pattern.CASE_INSENSITIVE);
            query.addCriteria(Criteria.where(ModelConstants.SERVICE_NAME).regex(pattern));
        }

        if (null == startTime) {
            if (null != endTime) {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).lte(StringUtil.getTime(endTime)));
            }
        } else {
            if (null == endTime) {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(StringUtil.getTime(startTime)));
            } else {
                query.addCriteria(Criteria.where(ModelConstants.CREATE_TIME).gte(StringUtil.getTime(startTime)).lte(StringUtil.getTime(endTime)));
            }
        }
        query.addCriteria(Criteria.where(ModelConstants.DELETED_FLAG).is(false));;
        query.with(new Sort(Sort.Direction.DESC, ModelConstants.CREATE_TIME));

        long totalCount = mongoTemplate.count(query, TAlarmService.class);
        query.skip(start);
        query.limit(count);
        List<TAlarmService> tAlarmServices = mongoTemplate.find(query, TAlarmService.class);
        List list = EntityUtil.entityListToDtoList(tAlarmServices, TAlarmServiceDto.class);
        return PageUtil.check(totalCount,list);
    }
}
