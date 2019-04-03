package com.changhong.iot.application.service;

import com.changhong.iot.application.entity.AppUnit;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UnitOptDto;

import java.util.List;

public interface AppUnitService {

    public UnitDto findById(String id);

    public List<UnitDto> findByIds(List<String> id);

    public AppUnit addUnit(AppUnit unitEntity) throws ByteException;

    public boolean updateUnit(AppUnit unitEntity) throws ByteException;

    public boolean delete(String id) throws ByteException;

    public void deleteByAppId(String id);

    public boolean sort(String thisId, String nextId) throws ByteException;

    public List<UnitOptDto> search(String appId, String name);

    public boolean batch(List<AppUnit> unitEntities) throws ByteException;

    public List children(String appId, String id, boolean isGetUser);

    public UnitDto parent(String id) throws ByteException;

    public UnitDto top(String id) throws ByteException;

    public UnitDto topByAppId(String appId) throws ByteException;

    /**
     * 获取组织机构的pid列表（包括顶级pid 0）
     * @param
     * @return
     *
     * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
     * 文件名称： UnitService.java
     * 包名：com.changhong.iot.service
     * 创建人：@author wangkn@bjbths.com
     * 创建时间：2018/10/24 14:51
     * 修改人：wangkn@bjbths.com
     * 修改时间：2018/10/24 14:51
     * 修改备注：
     */
    public List<String> getPids(String orgId) throws ByteException;
}
