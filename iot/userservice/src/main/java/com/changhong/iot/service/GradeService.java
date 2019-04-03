package com.changhong.iot.service;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.GradeDto;
import com.changhong.iot.entity.GradeEntity;
import com.changhong.iot.searchdto.Gradefilter;
import com.changhong.iot.searchdto.Sort;
import net.sf.json.JSONObject;

import java.util.List;

public interface GradeService {

    public GradeDto findById(String id);

    public GradeDto findById(String tenantId, String id);

    public GradeEntity addGrade(GradeEntity gradeEntity) throws ByteException;

    public boolean updateGrade(GradeEntity gradeEntity) throws ByteException;

    public boolean deleteGradeById(String tenantId, String id) throws ByteException;

    public boolean delete(String id) throws ByteException;

    public PageModel<GradeEntity> listGrade(String tenantId, int start, int count, String name);

    public PageModel<GradeEntity> listGrade(String tenantId, int start, int count, Gradefilter filter, Sort sort) throws ByteException;

    public List<String> getMenuIdsByTenantId(String tenantId);

    public List<String> getApiIdsByTenantId(String tenantId);

}
