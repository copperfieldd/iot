package com.changhong.iot.service.impl;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dao.UnitDao;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UnitOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.entity.UnitEntity;
import com.changhong.iot.rpc.RoleService;
import com.changhong.iot.service.UnitService;
import com.changhong.iot.service.UserService;
import com.changhong.iot.util.EmptyUtil;
import com.changhong.iot.util.EntityUtil;
import com.changhong.iot.util.UUIDUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class UnitServiceImpl implements UnitService {

    @Resource
    private UnitDao unitDaoImpl;

    @Resource
    private UserService userServiceImpl;

    @Autowired
    private RoleService roleService;

    @Autowired
    private MyThreadLocal myThreadLocal;

    @Override
    public UnitDto findById(String id) {

        UnitEntity entity = (UnitEntity)unitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return (UnitDto) EntityUtil.entityToDto(entity, UnitDto.class);
    }

    @Override
    public List<UnitDto> findByIds(List<String> ids) {
        List list = unitDaoImpl.findAllByPropIn(ConfigField.S_ID, ids,
                new String[]{ConfigField.I_DELETE_FLAG},
                new Object[]{ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(list, UnitDto.class);
    }

    @Override
    public List<UnitDto> findByPid(String pid) {

        List<UnitEntity> entitys = unitDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, ConfigField.I_DELETE_FLAG},
                new Object[] {pid, ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(entitys, UnitDto.class);
    }

    @Override
    public UnitEntity addUnit(UnitEntity unitEntity) throws ByteException {

        UnitEntity entity = (UnitEntity) unitDaoImpl.findMax(ConfigField.I_SORT_NUM);

        int sort = ConfigValue.SORT_STEP_LENGTH;

        if (entity != null) {
            sort += entity.getSortNum();
        }

        Date date = new Date();

        unitEntity.setId(UUIDUtil.getUUID());
        unitEntity.setValid(true);
        unitEntity.setCreateTime(date);
        unitEntity.setUpdateTime(date);
        unitEntity.setDeleteFlag(ConfigValue.NOT_DELETE);
        unitEntity.setSortNum(sort);

        unitDaoImpl.save(unitEntity);

        if (EmptyUtil.isNotEmpty(unitEntity.getRoleIds())) {
            roleService.updateRoleByOrgId(unitEntity.getId(), unitEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        return unitEntity;
    }

    @Override
    public boolean updateUnit(UnitEntity unitEntity) throws ByteException {

        if (unitEntity.getRoleIds() != null) {
            roleService.updateRoleByOrgId(unitEntity.getId(), unitEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        if (myThreadLocal.isAppUser()) {
            throw new ByteException(1006);
        }

        unitEntity.setUpdateTime(new Date());

        return unitDaoImpl.updateByParamNotNull(unitEntity);
    }


    @Override
    public boolean delete(String id) throws ByteException {

        UnitDto unitDto = findById(id);

        if (unitDto == null) {
            throw new ByteException(1012);
        }

        List list = children(unitDto.getTenantId(), id, true);

        if (EmptyUtil.isNotEmpty(list)) {
            throw new ByteException(1001);
        }

        if (myThreadLocal.isAppUser()) {
            throw new ByteException(1006);
        }

        boolean flag = unitDaoImpl.updateOneByProps(
                new String[] {ConfigField.S_ID, myThreadLocal.isPlatformManager() ? null : ConfigField.S_TENANT_ID},
                new Object[] {id, myThreadLocal.getTenantId()},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

        return flag;
    }

    @Override
    public void deleteAllAndChildren(String tenantId) {

        userServiceImpl.deleteByTenantId(tenantId);
        unitDaoImpl.updateMaryByProp(
                ConfigField.S_TENANT_ID, tenantId,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});

    }

    @Override
    public boolean sort(String thisId, String nextId) throws ByteException {

        boolean flag = false;

        int sort = ConfigValue.SORT_STEP_LENGTH;

        //  先查询出自己的信息
        UnitEntity entity = (UnitEntity)unitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {thisId, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1011);
        }

        //  判断是否 不是排在最后
        if (EmptyUtil.isNotEmpty(nextId)) {

            //  获取后面一个元素信息
            UnitEntity nextEntity = (UnitEntity)unitDaoImpl.uniqueByProps(
                    new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {nextId, ConfigValue.NOT_DELETE});

            if (nextEntity != null) {

                //计算出当前元素的sortNum
                sort = nextEntity.getSortNum() - 1;

                //如果当前元素的sortNum正好是步长的倍数，则证明需要重新排序
                if (sort % ConfigValue.SORT_STEP_LENGTH == 0) {

                    List<UnitEntity> list = unitDaoImpl.findByProp(
                            ConfigField.S_PID, nextEntity.getPid(),ConfigField.I_SORT_NUM);

                    if (EmptyUtil.isEmpty(list)) {
                        throw new ByteException(1011);
                    }

                    sort = ConfigValue.SORT_STEP_LENGTH;

                    UnitEntity temp = null;
                    int tempSort = 0;

                    for (UnitEntity unitEntity : list) {

                        if (unitEntity.getId().equals(thisId)) {
                            temp = unitEntity;
                            continue;
                        }
                        if (unitEntity.getId().equals(nextId)) {
                            tempSort = sort;
                            sort += ConfigValue.SORT_STEP_LENGTH;
                        }

                        unitDaoImpl.updateOneByProp(ConfigField.S_ID, unitEntity.getId(),
                                ConfigField.I_SORT_NUM, sort);

                        sort += ConfigValue.SORT_STEP_LENGTH;
                    }

                    unitDaoImpl.updateOneByProp(ConfigField.S_ID, temp.getId(),
                            ConfigField.I_SORT_NUM, tempSort);

                    return true;
                }
                flag = true;
            }
        }

        //  如果是排在最后 获取sortNum最大值+上步长即可
        if (!flag) {

            UnitEntity lastEntity = (UnitEntity)unitDaoImpl.findMax(ConfigField.I_SORT_NUM);

            sort = lastEntity.getSortNum();

            sort += ConfigValue.SORT_STEP_LENGTH - sort % ConfigValue.SORT_STEP_LENGTH;
        }

        return  unitDaoImpl.updateOneByProp(ConfigField.S_ID, entity.getId(),
                ConfigField.I_SORT_NUM, sort);
    }

    @Override
    public List<UnitOptDto> search(String tenantId, String name) {

        List<UnitEntity> unitDtos = unitDaoImpl.findLikeAndProps(
                new String[] {ConfigField.S_NAME}, new Object[] {name},
                new String[] {ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {tenantId, ConfigValue.NOT_DELETE}, null);

        if (unitDtos == null) {
            unitDtos = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(unitDtos, UnitOptDto.class);
    }

    @Override
    public boolean batch(List<UnitEntity> unitEntities) throws ByteException {

        for (UnitEntity unitEntity : unitEntities) {
            addUnit(unitEntity);
        }

        return true;
    }

    @Override
    public JSONArray children(String tenantId, String id, boolean isGetUser) {

        List unitDtos = unitDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, tenantId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        List<UnitOptDto> units = EntityUtil.entityListToDtoList(unitDtos, UnitOptDto.class);

        JSONArray jsonUnit = new JSONArray();

        for (UnitOptDto unit : units) {
            JSONObject obj = JSONObject.fromObject(unit);
            List<UserOptDto> allByUnitId = userServiceImpl.findAllByUnitId(tenantId, unit.getId());
            if (EmptyUtil.isNotEmpty(findByPid(unit.getId())) || EmptyUtil.isNotEmpty(allByUnitId)) {
                obj.put("isLeaf", false);
            } else {
                obj.put("isLeaf", true);
            }
            obj.put("type", 0);
            jsonUnit.add(obj);
        }

        if (isGetUser) {
            jsonUnit.addAll(userServiceImpl.findAllByUnitIdTree(tenantId, id));
        }

        return jsonUnit;
    }

    @Override
    public UnitDto parent(String id) throws ByteException {

        UserDto userDto = userServiceImpl.findById(id);
        UnitDto unitDto = null;
        String pid = null;

        if (userDto == null) {
            unitDto = findById(id);
            if(unitDto == null) {
                throw new ByteException(1012);
            }
            pid = unitDto.getPid();
        } else {
            pid = userDto.getPid();
        }

        return findById(pid);
    }

    @Override
    public UnitDto top(String id) throws ByteException {

        UserDto userDto = userServiceImpl.findById(id);
        UnitDto unitDto = null;
        String tenantId = null;

        if (userDto == null) {
            unitDto = findById(id);
            if(unitDto == null) {
                throw new ByteException(1012);
            }
            tenantId = unitDto.getTenantId();
        } else {
            tenantId = userDto.getTenantId();
        }

        unitDto = topByTenantId(tenantId);

        return unitDto;
    }

    @Override
    public UnitDto topByTenantId(String tenantId) throws ByteException {

        UnitEntity entity = (UnitEntity)unitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_PID, ConfigField.S_TENANT_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {ConfigValue.TOP_ID, tenantId, ConfigValue.NOT_DELETE});

        return (UnitDto) EntityUtil.entityToDto(entity, UnitDto.class);
    }

    @Override
    public List<String> getPids(String orgId) throws ByteException {

        List<String> ids = new ArrayList<>();

        UserDto userDto = userServiceImpl.findById(orgId);
        UnitDto unitDto = null;
        String pid = null;

        if (userDto == null) {
            unitDto = findById(orgId);
            if(unitDto == null) {
                return ids;
            }
            pid = unitDto.getPid();
        } else {
            pid = userDto.getPid();
        }
        ids.add(pid);

        while (!ConfigValue.TOP_ID.equals(pid)) {
            unitDto = findById(pid);
            if (unitDto != null) {
                pid = unitDto.getPid();
                ids.add(pid);
            } else {
                throw new ByteException(1001);
            }
        }

        return ids;
    }
}
