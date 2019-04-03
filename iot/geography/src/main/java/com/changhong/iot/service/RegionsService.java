package com.changhong.iot.service;

import com.alibaba.fastjson.JSONArray;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.entity.RegionsEntity;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public interface RegionsService {

    public RegionsEntity find(String id);

    public void add(RegionsEntity regionsEntity) throws ByteException;

    public void update(RegionsEntity regionsEntity);

    public void delete(String id);

    public void deleteByCountryId(String id);

    public List<RegionsEntity> opt();

    public List<Map<String, Object>> children(String id) throws ByteException;

    public List<Map<String, Object>> childrenByCountryId(String countryId) throws ByteException;

    public List<RegionsEntity> findByPid(String pid);

    public List<RegionsEntity> findByCountryId(String countryId) throws ByteException;

    public void importRegions(String countryId, InputStream in, String fileName) throws IOException, ByteException;
}
