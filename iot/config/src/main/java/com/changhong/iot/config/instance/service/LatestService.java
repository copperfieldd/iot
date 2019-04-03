package com.changhong.iot.config.instance.service;

import com.changhong.iot.config.instance.dto.PobeListDto;

import java.util.List;

public interface LatestService {

    List<PobeListDto> pack(List<PobeListDto> list, int type);
}
