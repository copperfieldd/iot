package com.changhong.iot.stats.model.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.bean.StructureBase;
import com.changhong.iot.stats.model.repository.ApplicationRepository;
import com.changhong.iot.stats.model.repository.StructureRepository;
import com.changhong.iot.stats.model.service.StructureService;
import com.changhong.iot.stats.web.dto.DataReportRqtDTO;
import com.changhong.iot.stats.web.dto.StructureRptDTO;
import com.changhong.iot.stats.web.dto.StructureRqtDTO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by guiqijiang on 11/8/18.
 */
@Service
public class StructureServiceImpl implements StructureService {

    @Autowired
    StructureRepository repository;

    @Autowired
    ApplicationRepository applicationRepository;

    //检查字段是否符合条件
    private void checkedStructureField(List<StructureRqtDTO.Structure> structures) throws ServiceException {
        for (StructureRqtDTO.Structure s : structures) {
            String fieldId = s.getFieldId();
            if (s.isSys()) {
                throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
            }
            if (StringUtils.isEmpty(fieldId)) {
                throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
            }
            if (StringUtils.isEmpty(s.getFieldType())) {
                throw new ServiceException(ErrorCode.NULL_ERROR, fieldId);
            }

            switch (s.getFieldType()) {
                case "Array":
                    checkedStructureField(s.getChildFields());
                    break;
                case "Object":
                case "Number":
                case "String":
                    break;
                default:
//                    throw new ServiceException(ErrorCode.SERVER_EXCEPTION, "字段:" + fieldId + "为未知或不允许创建的字段类型：" + s.getFieldType()
//                            + "    可选字段：{Array|Object|Number|String|}");
                    throw new ServiceException(ErrorCode.SERVER_EXCEPTION, "");
            }
        }

    }

    //添加系统字段，通用字段
    private void addSysField(List<StructureRqtDTO.Structure> structures) {

        StructureRqtDTO.Structure s1 = new StructureRqtDTO.Structure();

        s1.setFieldName("上报日期-年，系统字段");
        s1.setFieldType("Number");
        s1.setFieldId("year");
        s1.setSys(true);
        structures.add(s1);

        StructureRqtDTO.Structure s2 = new StructureRqtDTO.Structure();
        s2.setFieldName("上报日期-月，系统字段");
        s2.setFieldType("Number");
        s2.setFieldId("month");
        s2.setSys(true);
        structures.add(s2);

        StructureRqtDTO.Structure s3 = new StructureRqtDTO.Structure();
        s3.setFieldName("上报日期-日，系统字段");
        s3.setFieldType("Number");
        s3.setFieldId("day");
        s3.setSys(true);
        structures.add(s3);
    }

    @Override
    public StructureRptDTO addStructure(StructureRqtDTO structureRqtDTO) throws ServiceException {
        List<StructureRqtDTO.Structure> structure = structureRqtDTO.getStructure();
        checkedStructureField(structure);
        ApplicationBase appBase = applicationRepository.find(structureRqtDTO.getServiceId());
        String collectionId = appBase.getDomain() + "_" + structureRqtDTO.getCollectionId();
        StructureBase structureBase = repository.findByCollectionId(collectionId);
        if (null != structureBase) {
            throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
//            throw new ServiceException(ErrorCode.PARAMETER_ERROR, "已经存在的标识ID:" + structureRqtDTO.getCollectionId());
        }

        StructureBase base = new StructureBase();
        base.setId(UUID.randomUUID().toString());
        base.setFounderId(structureRqtDTO.getFounderId());
        base.setFounderName(structureRqtDTO.getFounderName());
        base.setAppId(appBase.getId());
        addSysField(structure);
        base.setStructure(JSON.toJSONString(structure));
        base.setCollectionName(structureRqtDTO.getCollectionName());
        base.setCollectionId(collectionId);
        base.setRemark(structureRqtDTO.getRemark());
        long today = DateUtil.getTime();
        base.setCdt(today);
        base.setUdt(today);
        repository.save(base);

        StructureRptDTO rptDTo = new StructureRptDTO(base);
        rptDTo.setServiceName(appBase.getAppName());
        return rptDTo;
    }

    @Override
    public void updateStructureState(String id, BaseBean.State state) throws ServiceException {
        StructureBase structureBase = repository.find(id);
        if (null == structureBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        structureBase.setState(state);
        repository.save(structureBase);
    }

    @Override
    public void updateStructure(StructureRqtDTO rqtDTO) throws ServiceException {
        if (StringUtils.isEmpty(rqtDTO.getId())) {
            throw new ServiceException(ErrorCode.NULL_ERROR, "ID");
        }
        List<StructureRqtDTO.Structure> structure = rqtDTO.getStructure();
        checkedStructureField(structure);

        StructureBase base = repository.find(rqtDTO.getId());
        if (null == base) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        ApplicationBase applicationBase = applicationRepository.find(rqtDTO.getServiceId());
        if (null == applicationBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        base.setAppId(applicationBase.getId());
        base.setCollectionName(rqtDTO.getCollectionName());
        //删除系统字段后重新添加，避免重复
        Iterator<StructureRqtDTO.Structure> iterator = structure.iterator();
        while (iterator.hasNext()) {
            StructureRqtDTO.Structure s = iterator.next();
            switch (s.getFieldId()) {
                case "year":
                case "month":
                case "day":
                    iterator.remove();
                    break;
            }
        }
        //添加系统字段
        addSysField(structure);
        base.setStructure(JSON.toJSONString(structure));
        base.setRemark(rqtDTO.getRemark());
        base.setUdt(DateUtil.getTime());
        repository.save(base);
    }

    @Override
    public StructureRptDTO getStructureItem(String id) {
        StructureBase base = repository.find(id);
        if (null == base) return null;
        ApplicationBase applicationBase = applicationRepository.findAppByAppId(base.getAppId());
        StructureRptDTO rptDTo = new StructureRptDTO(base);
        rptDTo.setServiceName(applicationBase.getAppName());
        return rptDTo;
    }

    @Override
    public PageModel<StructureRptDTO> getStructureList(StructureRqtDTO rqtDTo) {
        PageModel<HashMap> pageModel = repository.pageAll(rqtDTo);
        List<StructureRptDTO> list = new ArrayList<>();
        for (HashMap base : pageModel.getList()) {
            StructureRptDTO rptDTo = new StructureRptDTO();
            Map app = (Map) base.get("app");
            rptDTo.setServiceId((String) app.get(ApplicationBase.FIELD_ID));
            rptDTo.setServiceName((String) app.get(ApplicationBase.FIELD_APP_NAME));

            rptDTo.setCollectionName((String) base.get(StructureBase.FIELD_COLLECTION_NAME));
            rqtDTo.setId((String) base.get(StructureBase.FIELD_ID));
            rptDTo.setDomain((String) base.get(ApplicationBase.FIELD_APP_DOMAIN));
            rptDTo.setCollectionId((String) base.get(StructureBase.FIELD_COLLECTION_ID));
            rptDTo.setStructure((String) base.get(StructureBase.FIELD_STRUCTURE));
            rptDTo.setCreateTime((Long) base.get(StructureBase.FIELD_CREATE_TIME));
            rptDTo.setUpdateTime((Long) base.get(StructureBase.FIELD_UPDATE_TIME));
            rptDTo.setRemark((String) base.getOrDefault(StructureBase.FIELD_REMARK, ""));
            rptDTo.setState((Integer) base.get(StructureBase.FIELD_STATE));
            rptDTo.setFounderName((String) base.get(StructureBase.FIELD_FOUNDER_NAME));
            rptDTo.setId((String) base.get("_id"));
            list.add(rptDTo);
        }
        return new PageModel<>(pageModel.getTotalCount(), list);
    }

    @Override
    public void checkedDataStructure(DataReportRqtDTO reportDTO) throws ServiceException {
        if (null == reportDTO.getData() ||
                StringUtils.isEmpty(reportDTO.getDomain()) ||
                StringUtils.isEmpty(reportDTO.getCollection()) ||
                reportDTO.getReportTime() == 0
                ) {
            throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
        }

        ApplicationBase base = applicationRepository.findAppByDomain(reportDTO.getDomain());
        if (null == base) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        reportDTO.setApplicationBase(base);

        String collectionName = base.getDomain() + "_" + reportDTO.getCollection();
        StructureBase structureBase = repository.findByCollectionId(collectionName);
        if (null == structureBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        String str = structureBase.getStructure();
        List<StructureRqtDTO.Structure> structures = JSONObject.parseArray(str, StructureRqtDTO.Structure.class);
        checkedStructureDataField(null, structures, reportDTO.getData());
    }

    private void checkedStructureDataField(String parentFieldName, List<StructureRqtDTO.Structure> list, Map hashMap) throws ServiceException {

        for (StructureRqtDTO.Structure s : list) {
            if (s.isSys()) {
                continue;
            }
            String fieldId;
            if (StringUtils.isNotEmpty(parentFieldName)) {
                fieldId = parentFieldName + "." + s.getFieldId();
            } else {
                fieldId = s.getFieldId();
            }
            Object o = hashMap.get(s.getFieldId());
            if (null == o) {
                throw new ServiceException(ErrorCode.PARAMETER_ERROR, "" );
            }
            String type = s.getFieldType();
            String cls = o.getClass().getName();
            cls = cls.substring(cls.lastIndexOf(".") + 1);
            if ("Array".equalsIgnoreCase(type)) {
                if (o instanceof List) {
                    List l = (List) o;
                    if (l.size() > 0) {
                        checkedStructureDataField(fieldId, s.getChildFields(), (HashMap) l.get(0));
                    }
                } else {
                    throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
//                    throw new ServiceException(ErrorCode.PARAMETER_ERROR, fieldId + "   类型错误:" + cls + "  to:Array");
                }
            } else if ("Number".equalsIgnoreCase(type)) {
                if (!(o instanceof Number)) {
//                    throw new ServiceException(ErrorCode.PARAM_ERROR, fieldId + "   类型错误:" + cls + "  to:Number");
                    throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");
                }

            } else if ("Object".equalsIgnoreCase(type)) {
                if (!(o instanceof Map)) {
//                    throw new ServiceException(ErrorCode.PARAM_ERROR, fieldId + "   类型错误:" + cls + "  to:Object");
                    throw new ServiceException(ErrorCode.PARAMETER_ERROR, "");

                }
            }
        }
    }
}
