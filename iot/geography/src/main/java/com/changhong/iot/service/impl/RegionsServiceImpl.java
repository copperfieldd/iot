package com.changhong.iot.service.impl;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dao.CountryDao;
import com.changhong.iot.dao.RegionsDao;
import com.changhong.iot.entity.CountryEntity;
import com.changhong.iot.entity.RegionsEntity;
import com.changhong.iot.service.RegionsService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.ExcelUtil;
import com.mongodb.BasicDBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class RegionsServiceImpl implements RegionsService {

    @Autowired
    private RegionsDao regionsDao;

    @Autowired
    private CountryDao countryDao;

    @Override
    public RegionsEntity find(String id) {
        return (RegionsEntity) regionsDao.find(id);
    }

    @Override
    public void add(RegionsEntity regionsEntity) throws ByteException {

        Object regionCode = regionsDao.uniqueByProp("regionCode", regionsEntity.getRegionCode());
        if (regionCode != null) {
            throw new ByteException(1010, regionsEntity.getRegionCode());
        }

        Date date = new Date();

        regionsEntity.setId(UUID.randomUUID().toString());
        regionsEntity.setCreateTime(date);
        regionsEntity.setUpdateTime(date);

        regionsDao.save(regionsEntity);

        if (EmptyUtil.isNotEmpty(regionsEntity.getCountryId()) && regionsEntity.getPid().equals("0")) {
            CountryEntity country = (CountryEntity) countryDao.find(regionsEntity.getCountryId());
            if (country != null) {
                country.getRegionIds().add(regionsEntity.getId());
                countryDao.update(country);
            }
        }
    }

    @Override
    public void update(RegionsEntity regionsEntity) {

        regionsEntity.setCountryId(null);
        regionsEntity.setRegionCode(null);
        regionsEntity.setUpdateTime(new Date());
        regionsEntity.setCreateTime(new Date());

        regionsDao.updateByParamNotNull(regionsEntity);
    }

    @Override
    public void delete(String id) {

        List<String> ids = new ArrayList<>();
        ids.add(id);
        deleteByPid(ids);

        regionsDao.delete(id);
    }

    @Override
    public void deleteByCountryId(String id) {
        CountryEntity country = (CountryEntity) countryDao.find(id);
        if (country != null) {
            List<String> regionIds = country.getRegionIds();
            if (regionIds != null) {
                List<RegionsEntity> entities = regionsDao.findByProps(new String[]{"id", "pid"}, new Object[]{new BasicDBObject("$in", regionIds), "0"});
                List<String> ids = new ArrayList<>();
                for (RegionsEntity regionsEntity : entities) {
                    ids.add(regionsEntity.getId());
                }
                deleteByPid(ids);
            }
        }
    }

    public void deleteByPid(List<String> pids) {
        List<RegionsEntity> entities = regionsDao.findByProp("pid", new BasicDBObject("$in", pids));;
        if (EmptyUtil.isNotEmpty(entities)) {
            List<String> ids = new ArrayList<>();
            for (RegionsEntity regionsEntity : entities) {
                ids.add(regionsEntity.getId());
            }
            deleteByPid(ids);
        }
        regionsDao.delete(pids.toArray(new String[0]));
    }

    @Override
    public List<RegionsEntity> opt() {

        return regionsDao.findAll();
    }

    @Override
    public List<Map<String, Object>> children(String id) throws ByteException {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = null;
        List<RegionsEntity> list = findByPid(id);

        if (EmptyUtil.isNotEmpty(list)) {
            for (RegionsEntity regionsEntity : list) {
                map = new HashMap<>();
                map.put("id", regionsEntity.getId());
                map.put("pid", regionsEntity.getPid());
                map.put("name", regionsEntity.getName());
                map.put("children", children(regionsEntity.getId()));

                result.add(map);
            }
        }
        return result;
    }

    @Override
    public List<Map<String, Object>> childrenByCountryId(String countryId) throws ByteException {

        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = null;

        List<RegionsEntity> entities = findByCountryId(countryId);

        for (RegionsEntity regionsEntity : entities) {
            map = new HashMap<>();
            map.put("id", regionsEntity.getId());
            map.put("pid", regionsEntity.getPid());
            map.put("name", regionsEntity.getName());
            map.put("children", children(regionsEntity.getId()));

            result.add(map);
        }
        return result;
    }

    public List<RegionsEntity> findByPid(String pid) {

        return regionsDao.findByProp("pid", pid);
    }

    public List<RegionsEntity> findByCountryId(String countryId) throws ByteException {

        CountryEntity country = (CountryEntity) countryDao.find(countryId);

        if (country == null) {
            throw new ByteException(1012);
        }

        List<String> regionIds = country.getRegionIds();

        if (EmptyUtil.isNotEmpty(regionIds)) {
            return regionsDao.findByProps(new String[] {"id", "pid"}, new Object[] {new BasicDBObject("$in", regionIds), "0"});
        }

        return new ArrayList<>();
    }

    @Override
    public void importRegions(String countryId, InputStream in, String fileName) throws IOException, ByteException {

        List<Map<String, Object>> list = ExcelUtil.readExcel(in, fileName);

        List<String> regionIds = new ArrayList<>();
        RegionsEntity regionsEntity = null;

        for (Map map : list) {
            String pid = "0";
            String pCode = (String) map.get("pCode");
            if (EmptyUtil.isNotEmpty(pCode)) {
                RegionsEntity byCode = findByCode(pCode);
                if (byCode != null) {
                    pid = byCode.getId();
                } else {
                  throw new ByteException(1012);
                }
            }
            regionsEntity = new RegionsEntity();
            regionsEntity.setName((String) map.get("name"));
            regionsEntity.setRegionCode((String) map.get("code"));
            regionsEntity.setPid(pid);
            regionsEntity.setCountryId(countryId);
            regionsEntity.setCreateTime(new Date());
            regionsEntity.setUpdateTime(new Date());

            regionsDao.save(regionsEntity);

            if (pid.equals("0")) {
                regionIds.add(regionsEntity.getId());
            }
        }

        if (EmptyUtil.isNotEmpty(regionIds)) {
            CountryEntity country = (CountryEntity) countryDao.find(countryId);
            if (country != null) {
                List<String> regionIds1 = country.getRegionIds();
                if (regionIds1 == null) {
                    regionIds1 = new ArrayList<>();
                }
                regionIds1.addAll(regionIds);
                country.setRegionIds(regionIds1);
                countryDao.update(country);
            }
        }
    }
    private RegionsEntity findByCode(String code) {
        return (RegionsEntity) regionsDao.uniqueByProp("regionCode", code);
    }
}
