package com.changhong.iot.service;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.entity.CountryEntity;
import com.changhong.iot.searchdto.Countryfilter;
import com.changhong.iot.searchdto.Sort;

import java.util.List;

public interface CountryService {

    public CountryEntity find(String id);

    public void add(CountryEntity countryEntity);

    public void update(CountryEntity countryEntity);

    public void delete(String id) throws ByteException;

    public PageModel<CountryEntity> page(int start, int count, Countryfilter countryfilter, Sort sort) throws ByteException;

}
