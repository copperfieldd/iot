package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.instance.dto.PobeListDto;
import com.changhong.iot.config.instance.entity.PobeEntity;
import com.changhong.iot.config.searchdto.ServiceStatefilter;
import com.changhong.iot.config.searchdto.Sort;

import java.util.Date;
import java.util.List;

public interface PobeService {

    void add(PobeEntity pobeEntity);

    PobeEntity find(String id);

    List<PobeListDto> pack(List<PobeListDto> list, int type);

    PageModel page(int start, int count, ServiceStatefilter serviceStatefilter, Sort sort) throws ByteException;
}
