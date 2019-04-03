package com.changhong.iot.service;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UnitOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.UnitEntity;
import net.sf.json.JSONArray;

import java.util.List;

public interface UnitService {

    public UnitDto findById(String id);

    public List<UnitDto> findByIds(List<String> id);

    public List<UnitDto> findByPid(String pid);

    public UnitEntity addUnit(UnitEntity unitEntity) throws ByteException;

    public boolean updateUnit(UnitEntity unitEntity) throws ByteException;

    public boolean delete(String id) throws ByteException;

    public void deleteAllAndChildren(String tenantId);

    public boolean sort(String thisId, String nextId) throws ByteException;

    public List<UnitOptDto> search(String tenantId, String name);

    public boolean batch(List<UnitEntity> unitEntities) throws ByteException;

    public JSONArray children(String tenantId, String id, boolean isGetUser);

    public UnitDto parent(String id) throws ByteException;

    public UnitDto top(String id) throws ByteException;

    public UnitDto topByTenantId(String tenantId) throws ByteException;

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
