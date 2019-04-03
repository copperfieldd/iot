package com.changhong.iot.service;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.ServiceOptDto;
import com.changhong.iot.entity.ServiceEntity;

import java.util.List;

public interface ServiceService {

    void add(ServiceEntity serviceEntity) throws ByteException;

    void upd(ServiceEntity serviceEntity);

    void del(String id);

    ServiceEntity find(String id);

    PageModel page(String name, int start, int count);

    List<ServiceOptDto> opt();

}
