package com.changhong.iot.application.service.impl;

import com.changhong.iot.application.dao.AppUnitDao;
import com.changhong.iot.application.entity.AppUnit;
import com.changhong.iot.application.service.AppUnitService;
import com.changhong.iot.application.service.AppUserService;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.config.ConfigField;
import com.changhong.iot.config.ConfigValue;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UnitOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.dto.UserOptDto;
import com.changhong.iot.rpc.RoleService;
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
public class AppUnitServiceImpl implements AppUnitService {

    @Resource
    private AppUnitDao appUnitDaoImpl;

    @Resource
    private AppUserService appUserServiceImpl;

    @Autowired
    private RoleService roleService;

    @Autowired
    private MyThreadLocal myThreadLocal;

    @Override
    public UnitDto findById(String id) {

        AppUnit entity = (AppUnit)appUnitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {id, ConfigValue.NOT_DELETE});

        return (UnitDto) EntityUtil.entityToDto(entity, UnitDto.class);
    }

    @Override
    public List<UnitDto> findByIds(List<String> ids) {
        List list = appUnitDaoImpl.findAllByPropIn(ConfigField.S_ID, ids,
                new String[]{ConfigField.I_DELETE_FLAG},
                new Object[]{ConfigValue.NOT_DELETE});

        return EntityUtil.entityListToDtoList(list, UnitDto.class);
    }

    public List<AppUnit> findByPid(String id) {

        List<AppUnit> list = appUnitDaoImpl.findByProps(
                new String[]{ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[]{id, ConfigValue.NOT_DELETE});

        return list;
    }

    @Override
    public AppUnit addUnit(AppUnit unitEntity) throws ByteException {

        AppUnit entity = (AppUnit) appUnitDaoImpl.findMax(ConfigField.I_SORT_NUM);

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

        appUnitDaoImpl.save(unitEntity);

        if (EmptyUtil.isNotEmpty(unitEntity.getRoleIds())) {
            roleService.updateRoleByOrgId(unitEntity.getId(), unitEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        return unitEntity;
    }

    @Override
    public boolean updateUnit(AppUnit unitEntity) throws ByteException {

        if (unitEntity.getRoleIds() != null) {
            roleService.updateRoleByOrgId(unitEntity.getId(), unitEntity.getRoleIds(), MyThreadLocal.getToken());
        }

        unitEntity.setUpdateTime(new Date());

        return appUnitDaoImpl.updateByParamNotNull(unitEntity);
    }


    @Override
    public boolean delete(String id) throws ByteException {

        UnitDto unitDto = findById(id);

        if (unitDto == null) {
            throw new ByteException(1012);
        }

        List list = children(unitDto.getAppId(), id, true);

        if (EmptyUtil.isNotEmpty(list)) {
            throw new ByteException(1001, ConstErrors.C_MSG_CHILDREN);
        }

        boolean flag = appUnitDaoImpl.updateOneByProps(
                new String[] {ConfigField.S_ID, myThreadLocal.isAppUser() ? ConfigField.S_TENANT_ID : null},
                new Object[] {id, myThreadLocal.getUser().getAppId()},
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});


        return flag;
    }

    @Override
    public void deleteByAppId(String id) {
        appUserServiceImpl.deleteByAppId(id);
        appUnitDaoImpl.updateOneByProp(
                "appId", id,
                new String[] { ConfigField.D_UPDATE_TIME, ConfigField.I_DELETE_FLAG},
                new Object[] { new Date(), ConfigValue.DELETE});
    }

    @Override
    public boolean sort(String thisId, String nextId) throws ByteException {

        boolean flag = false;

        int sort = ConfigValue.SORT_STEP_LENGTH;

        //  先查询出自己的信息
        AppUnit entity = (AppUnit)appUnitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                new Object[] {thisId, ConfigValue.NOT_DELETE});

        if (entity == null) {
            throw new ByteException(1012);
        }

        //  判断是否 不是排在最后
        if (EmptyUtil.isNotEmpty(nextId)) {

            //  获取后面一个元素信息
            AppUnit nextEntity = (AppUnit)appUnitDaoImpl.uniqueByProps(
                    new String[] {ConfigField.S_ID, ConfigField.I_DELETE_FLAG},
                    new Object[] {nextId, ConfigValue.NOT_DELETE});

            if (nextEntity != null) {

                //计算出当前元素的sortNum
                sort = nextEntity.getSortNum() - 1;

                //如果当前元素的sortNum正好是步长的倍数，则证明需要重新排序
                if (sort % ConfigValue.SORT_STEP_LENGTH == 0) {

                    List<AppUnit> list = appUnitDaoImpl.findByProp(
                            ConfigField.S_PID, nextEntity.getPid(),ConfigField.I_SORT_NUM);

                    if (EmptyUtil.isEmpty(list)) {
                        throw new ByteException(1001);
                    }

                    sort = ConfigValue.SORT_STEP_LENGTH;

                    AppUnit temp = null;
                    int tempSort = 0;

                    for (AppUnit unitEntity : list) {

                        if (unitEntity.getId().equals(thisId)) {
                            temp = unitEntity;
                            continue;
                        }
                        if (unitEntity.getId().equals(nextId)) {
                            tempSort = sort;
                            sort += ConfigValue.SORT_STEP_LENGTH;
                        }

                        appUnitDaoImpl.updateOneByProp(ConfigField.S_ID, unitEntity.getId(),
                                ConfigField.I_SORT_NUM, sort);

                        sort += ConfigValue.SORT_STEP_LENGTH;
                    }

                    appUnitDaoImpl.updateOneByProp(ConfigField.S_ID, temp.getId(),
                            ConfigField.I_SORT_NUM, tempSort);

                    return true;
                }
                flag = true;
            }
        }

        //  如果是排在最后 获取sortNum最大值+上步长即可
        if (!flag) {

            AppUnit lastEntity = (AppUnit)appUnitDaoImpl.findMax(ConfigField.I_SORT_NUM);

            sort = lastEntity.getSortNum();

            sort += ConfigValue.SORT_STEP_LENGTH - sort % ConfigValue.SORT_STEP_LENGTH;
        }

        return  appUnitDaoImpl.updateOneByProp(ConfigField.S_ID, entity.getId(),
                ConfigField.I_SORT_NUM, sort);
    }

    @Override
    public List<UnitOptDto> search(String appId, String name) {

        List<AppUnit> unitDtos = appUnitDaoImpl.findLikeAndProps(
                new String[] {ConfigField.S_NAME}, new Object[] {name},
                new String[] {"appId", ConfigField.I_DELETE_FLAG},
                new Object[] {appId, ConfigValue.NOT_DELETE}, null);

        if (unitDtos == null) {
            unitDtos = new ArrayList<>();
        }

        return EntityUtil.entityListToDtoList(unitDtos, UnitOptDto.class);
    }

    @Override
    public boolean batch(List<AppUnit> unitEntities) throws ByteException {

        for (AppUnit unitEntity : unitEntities) {
            addUnit(unitEntity);
        }

        return true;
    }

    @Override
    public List children(String appId, String id, boolean isGetUser) {

        List unitDtos = appUnitDaoImpl.findByProps(
                new String[] {ConfigField.S_PID, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {id, appId, ConfigValue.NOT_DELETE}, ConfigField.S_PID+","+ConfigField.I_SORT_NUM);

        List<UnitOptDto> units = EntityUtil.entityListToDtoList(unitDtos, UnitOptDto.class);

        JSONArray jsonUnit = new JSONArray();

        for (UnitOptDto unit : units) {
            JSONObject obj = JSONObject.fromObject(unit);
            List<UserOptDto> allByUnitId = appUserServiceImpl.findAllByUnitId(appId, unit.getId());
            if (EmptyUtil.isNotEmpty(findByPid(unit.getId())) || EmptyUtil.isNotEmpty(allByUnitId)) {
                obj.put("isLeaf", false);
            } else {
                obj.put("isLeaf", true);
            }
            obj.put("type", 0);
            jsonUnit.add(obj);
        }

        if (isGetUser) {
            jsonUnit.addAll(appUserServiceImpl.findAllByUnitIdTree(appId, id));
        }

        return jsonUnit;

    }

    @Override
    public UnitDto parent(String id) throws ByteException {

        UserDto userDto = appUserServiceImpl.findById(id);
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

        UserDto userDto = appUserServiceImpl.findById(id);
        UnitDto unitDto = null;
        String appId = null;

        if (userDto == null) {
            unitDto = findById(id);
            if(unitDto == null) {
                throw new ByteException(1012);
            }
            appId = unitDto.getAppId();
        } else {
            appId = userDto.getAppId();
        }

        unitDto = topByAppId(appId);

        return unitDto;
    }

    @Override
    public UnitDto topByAppId(String appId) throws ByteException {

        AppUnit entity = (AppUnit)appUnitDaoImpl.uniqueByProps(
                new String[] {ConfigField.S_PID, "appId", ConfigField.I_DELETE_FLAG},
                new Object[] {ConfigValue.TOP_ID, appId, ConfigValue.NOT_DELETE});

        return (UnitDto) EntityUtil.entityToDto(entity, UnitDto.class);
    }

    @Override
    public List<String> getPids(String orgId) throws ByteException {

        List<String> ids = new ArrayList<>();

        UserDto userDto = appUserServiceImpl.findById(orgId);
        UnitDto unitDto = null;
        String pid = null;

        if (userDto == null) {
            unitDto = findById(orgId);
            if(unitDto == null) {
                return ids;
            }
            pid = unitDto.getPid();
        } else if (userDto.getType().equals(ConfigValue.END_USER)) {
           return ids;
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
