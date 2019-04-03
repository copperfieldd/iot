package com.changhong.iot.service.impl;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.dao.CountryDao;
import com.changhong.iot.entity.CountryEntity;
import com.changhong.iot.searchdto.Countryfilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.CountryService;
import com.changhong.iot.service.RegionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class CountyServiceImpl implements CountryService {

    @Autowired
    private CountryDao countryDao;

    @Autowired
    private RegionsService regionsService;

    @Override
    public CountryEntity find(String id) {
        return (CountryEntity) countryDao.find(id);
    }

    @Override
    public void add(CountryEntity countryEntity) {

        Date date = new Date();

        countryEntity.setId(null);
        countryEntity.setCreateTime(date);
        countryEntity.setUpdateTime(date);

        countryDao.save(countryEntity);
    }

    @Override
    public void update(CountryEntity countryEntity) {

        countryEntity.setUpdateTime(new Date());
        countryEntity.setCreateTime(null);

        countryDao.updateByParamNotNull(countryEntity);

    }

    @Override
    public void delete(String id) throws ByteException {

        CountryEntity countryEntity = find(id);

        if (countryEntity == null) {
            throw new ByteException(1012);
        }

        regionsService.deleteByCountryId(id);

        countryDao.delete(id);
    }

    @Override
    public PageModel<CountryEntity> page(int start, int count, Countryfilter countryfilter, Sort sort) throws ByteException {

        return countryDao.pageFilterAndPropsAndIn(start, count, null, null, null, null,
                countryfilter, null, sort);
    }
}
