package com.changhong.iot.audit.service.auditLog;

import com.changhong.iot.audit.constant.FieldConstant;
import com.changhong.iot.audit.dao.auditLog.AuditLogDao;

import com.changhong.iot.audit.entity.TAuditLog;
import com.changhong.iot.audit.feign.UserService;
import com.changhong.iot.audit.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.*;

@Service
public class AuditServiceImpl implements AuditService {

    @Autowired
    private AuditLogDao logDao;

    @Autowired
    private UserService userService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public Map list(Integer start, Integer count, String userName, String appName, String type, String clientType, String startTime, String endTime,String token) throws Exception {
        Query query = new Query();
        query.addCriteria(Criteria.where(FieldConstant.DELETED_FLAG).is(false));

        if (EmptyUtil.isNotEmpty(appName)) {
            query.addCriteria(Criteria.where(FieldConstant.APP_NAME).regex(appName));
        }
        if (EmptyUtil.isNotEmpty(userName)) {
            query.addCriteria(Criteria.where(FieldConstant.USER_NAME).regex(userName));
        }
        if (EmptyUtil.isNotEmpty(type)) {
            query.addCriteria(Criteria.where(FieldConstant.AUDIT_TYPE_NAME).regex(type));
        }
        if (EmptyUtil.isNotEmpty(clientType)) {
            query.addCriteria(Criteria.where(FieldConstant.CLIENT_TYPE).regex(clientType));
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


        long totalCount = mongoTemplate.count(query, TAuditLog.class);
        if (null != start && count != null) {
            query.skip(start);
            query.limit(count);
        }
        query.with(new Sort(Sort.Direction.DESC, FieldConstant.CREATE_TIME));
        List<TAuditLog> list = mongoTemplate.find(query, TAuditLog.class);
        List data = new ArrayList();
        list.forEach(item->{
            Map map = new HashMap();
            map.put("id", item.getId());
            map.put("clientType", item.getClientType());
            map.put("createTime", StringUtil.getTime(item.getCreateTime()));
            map.put("clientIp", item.getClientIp());
            map.put("auditCOntent", item.getAuditContent());
            map.put("type", item.getType());
            map.put("userName", item.getUserName());
            map.put("appName", item.getAppName());
            data.add(map);
        });
        return PageUtil.check(totalCount, data);
    }


    @Override
    public void exportExcel(Integer excleType, String userName, String appName, String type, String clientType, String startTime, String endTime, String token, HttpServletResponse response) throws Exception {
        Map map = list(null, null, userName, appName, type, clientType, startTime, endTime, token);

        List<HashMap> list = (List<HashMap>) map.get("value");

        Vector<Vector<String>> rowName = new Vector<>();
        for (HashMap item : list) {
            Vector<String> row = new Vector<>();
            row.add((String) item.get("appName"));
            row.add((String) item.get("userName"));
            row.add((String) item.get("type"));
            row.add((String) item.get("auditCOntent"));
            row.add((String) item.get("clientIp"));
            row.add((String) item.get("clientType"));
            row.add((String) item.get("createTime"));
            rowName.add(row);
        }

        //设置行名 Vector<String>
        Vector<String> rowTopName = new Vector<String>();
        rowTopName.add("Application");
        rowTopName.add("Name ");
        rowTopName.add("Type");
        rowTopName.add("Content");
        rowTopName.add("IP");
        rowTopName.add("Client");
        rowTopName.add("Create Time");

        String excelName = "auditExport" + StringUtil.getCurrTime();

        ServletOutputStream out = response.getOutputStream();

        if (excleType == 1) {
            response.setHeader("Export-Excel", URLEncoder.encode(excelName + ".xls", "UTF-8"));
        } else {
            response.setHeader("Export-Excel", URLEncoder.encode(excelName + ".xlsx", "UTF-8"));
        }
        //i为2003版本，其他为2007版本
        if (excleType == 1) {
            ExcelUtil.exportToExcelHSSF("sheet", rowTopName, rowName, out);
        } else {
            ExcelUtil.exportToExcelXSSF("sheet", rowTopName, rowName, out);
        }


        out.flush();
        out.close();
    }

    /**
     * 添加审计数据
     * @param tAuditLog
     * @param token
     * @throws Exception
     */
    @Override
    public void add(TAuditLog tAuditLog, String token) throws Exception {
        tAuditLog.setDeletedFlag(false);
        tAuditLog.setId(UUIDUtil.getUUID());
        tAuditLog.setCreateTime(new Date());
        tAuditLog.setUpdateTIme(new Date());
        logDao.save(tAuditLog);
    }
}

