package com.changhong.iot.audit.service.auditType;

import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.constant.MessageConstant;
import com.changhong.iot.audit.dao.auditType.AuditTypeDao;
import com.changhong.iot.audit.entity.TAuditType;
import com.changhong.iot.audit.util.EmptyUtil;
import com.changhong.iot.audit.util.PageUtil;
import com.changhong.iot.audit.util.StringUtil;
import com.changhong.iot.audit.util.UUIDUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuditTypeServiceImpl implements AuditTypeService {
    @Autowired
    private AuditTypeDao typeDao;

    @Autowired
    private MessageConstant messageConstant;

    @Autowired
    private MongoTemplate mongoTemplate;


    /**
     * 添加审计类型
     *
     * @param tAuditType
     * @throws Exception
     */
    @Override
    public Optional<TAuditType> save(TAuditType tAuditType) throws Exception {

        List<TAuditType> list = typeDao.findAllByNotDel();

        boolean flag = true;
        for (TAuditType type : list) {
            if (tAuditType.getName().equals(type.getName())) {
                flag = false;
                break;
            }
        }

        if (flag) {
            tAuditType.setId(UUIDUtil.getUUID());
            tAuditType.setDeletedFlag(false);
            tAuditType.setUpdateTIme(new Date());
            tAuditType.setCreateTime(new Date());

            typeDao.save(tAuditType);
            return Optional.ofNullable(tAuditType);
        } else {
            return Optional.empty();
        }
    }

    /**
     * 修改审计类型
     *
     * @param tAuditType
     * @return
     */
    @Override
    public Optional<String> upd(TAuditType tAuditType) {
        List<TAuditType> list = typeDao.findAllByNotDel();

        for (TAuditType type : list) {
            if (tAuditType.getName().equals(type.getName()) && !tAuditType.getId().equals(type.getId())) {
                return Optional.of(messageConstant.nameRepeat);
            }
        }
        typeDao.updateOneByProp("id", tAuditType.getId(), new String[]{FieldConstant.NAME, FieldConstant.TYPE, FieldConstant.DESC}, new Object[]{tAuditType.getName(), tAuditType.getType(), tAuditType.getDesc()});
        return Optional.empty();
    }

    /**
     * 删除审计类型
     *
     * @param ids
     * @return
     * @throws Exception
     */
    @Override
    public void del(String ids) throws Exception {
        Arrays.stream(ids.split(",")).distinct().collect(Collectors.toList()).forEach(id -> {
            typeDao.updateOneByProp("id", id, FieldConstant.DELETED_FLAG, true);
        });
    }

    @Override
    public Map list(Integer start, Integer count, String name, String type, String startTime, String endTime) throws Exception {
        Query query = new Query();
        query.addCriteria(Criteria.where(FieldConstant.DELETED_FLAG).is(false));
        query.with(new Sort(Sort.Direction.DESC, FieldConstant.CREATE_TIME));

        if (EmptyUtil.isNotEmpty(name)) {
            query.addCriteria(Criteria.where(FieldConstant.NAME).regex(name));
        }
        if (EmptyUtil.isNotEmpty(type)) {
            query.addCriteria(Criteria.where(FieldConstant.TYPE).regex(type));
        }

        if (EmptyUtil.isNotEmpty(startTime)) {
            Date startDate = StringUtil.getData(startTime);
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getData(endTime);
                query.addCriteria( Criteria.where(FieldConstant.CREATE_TIME).gte(startDate).lte(endDate));
            } else {
                query.addCriteria( Criteria.where(FieldConstant.CREATE_TIME).gte(startDate));
            }
        } else {
            if (EmptyUtil.isNotEmpty(endTime)) {
                Date endDate = StringUtil.getData(endTime);
                query.addCriteria( Criteria.where(FieldConstant.CREATE_TIME).lte(endDate));
            }
        }
        long totalCount = mongoTemplate.count(query, TAuditType.class);
        query.skip(start);
        query.limit(count);
        List<TAuditType> list = mongoTemplate.find(query, TAuditType.class);
        List data = new ArrayList();
        list.forEach(item -> {
            Map map = new HashMap();
            map.put("id", item.getId());
            map.put("name", item.getName());
            map.put("type", item.getType());
            map.put("desc", item.getDesc());
            map.put("createTime", StringUtil.getTime(item.getCreateTime()));
            data.add(map);
        });
        Map map = PageUtil.check(totalCount, data);
        return map;
    }


    /**
     * 查新所有审计类型
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<TAuditType> findAll() throws Exception {
        return typeDao.findByProp(FieldConstant.DELETED_FLAG, false);
    }

    @Override
    public Map item(String id) throws Exception {
        List<TAuditType> list = typeDao.findByProps(new String[]{FieldConstant.DELETED_FLAG, "id"}, new Object[]{false, id});
        if (list.size() != 1) {
            throw new RuntimeException();
        }
        TAuditType type = list.get(0);
        Map map = new HashMap();
        map.put("id", type.getId());
        map.put("name", type.getName());
        map.put("type", type.getType());
        map.put("desc", type.getDesc());
        return map;

    }
}
