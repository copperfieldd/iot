package com.changhong.iot.controller;

import com.changhong.iot.base.dto.APIResult;
import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.ConstErrors;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApiOptDto;
import com.changhong.iot.dto.GradeDto;
import com.changhong.iot.dto.MenuOptDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.entity.GradeEntity;
import com.changhong.iot.rpc.ApiService;
import com.changhong.iot.rpc.MenuService;
import com.changhong.iot.searchdto.Gradefilter;
import com.changhong.iot.searchdto.Sort;
import com.changhong.iot.service.GradeService;
import com.changhong.iot.service.TenantService;
import com.changhong.iot.util.*;
import com.sun.org.apache.bcel.internal.generic.NEW;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/grade")
public class GradeController {

    @Resource
    private GradeService gradeServiceImpl;

    @Resource
    private MyThreadLocal myThreadLocal;

    @Resource
    private RedisTemplate redisTemplate;

    @Resource
    private ApiService apiService;

    @Resource
    private MenuService menuService;

    @GetMapping("/item")
    public APIResult findById(@RequestParam String id) {

        GradeDto gradeDto = gradeServiceImpl.findById(id);

        if (gradeDto == null) {
            return APIResult.success();
        }

        List<String> apiIds = gradeDto.getApiIds();
        List<String> menuIds = gradeDto.getMenuIds();

        List<ApiOptDto> apis = new ArrayList<>();
        List<MenuOptDto> menus = new ArrayList<>();

        if (EmptyUtil.isNotEmpty(apiIds)) {
            apis = apiService.findByApiIds(apiIds, MyThreadLocal.getToken());
        }
        if (EmptyUtil.isNotEmpty(menuIds)) {
            menus = menuService.listByIds(menuIds, MyThreadLocal.getToken());
        }

        JSONObject object = new JSONObject();
        object.put("id", gradeDto.getId());
        object.put("name", gradeDto.getName());
        object.put("remarks", gradeDto.getRemarks());
        object.put("apiIds", apiIds);
        object.put("menuIds", menuIds);
        object.put("apis", apis);
        object.put("menus", menus);

        return APIResult.success().setValue(object);
    }

    @PostMapping("/add")
    public APIResult addGrade(@RequestBody GradeEntity gradeEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(gradeEntity, "name");

        gradeServiceImpl.addGrade(gradeEntity);

        return APIResult.success().setMessage("保存成功！").setValue(gradeEntity);
    }

    @PostMapping("/upd")
    public APIResult updateGrade(@RequestBody GradeEntity gradeEntity) throws ByteException {

        ParamUtil.checkParamNotNullAndNotEmpty(gradeEntity, "id");
        ParamUtil.setParamNullIgnore(gradeEntity, "id", "name", "remarks", "apiIds", "menuIds");

        gradeServiceImpl.updateGrade(gradeEntity);

        return APIResult.success().setMessage("修改成功！");
    }

    @GetMapping("/del")
    public APIResult deleteGrade(@RequestParam String id) throws ByteException {

        gradeServiceImpl.delete(id);

        return APIResult.success().setMessage("删除成功！");
    }

    /*@GetMapping("/list")
    public APIResult listGrade(@RequestParam int start, @RequestParam int count, String name) throws ByteException {

        PageModel<GradeEntity> pageModel = gradeServiceImpl.listGrade(myThreadLocal.getTenantId(), start, count, name);

        List<GradeEntity> list = pageModel.getList();

        JSONArray array = new JSONArray();
        JSONObject obj = null;
        for (GradeEntity gradeEntity : list) {
            obj = new JSONObject();
            obj.put("id", gradeEntity.getId());
            obj.put("name", gradeEntity.getName());
            obj.put("remarks", gradeEntity.getRemarks());
            obj.put("creatorName", gradeEntity.getCreatorName());
            obj.put("createTime", StringUtil.dateToStrLong(gradeEntity.getCreateTime()));

            array.add(obj);
        }
        pageModel.setList(array);

        return APIResult.success().setValue(pageModel);
    }*/

    @GetMapping("/list")
    public APIResult listGrade(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

        Gradefilter gradefilter = JsonUtil.string2Obj(filter, Gradefilter.class);
        Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

        PageModel<GradeEntity> pageModel = gradeServiceImpl.listGrade(myThreadLocal.getTenantId(), start, count, gradefilter, sortEntity);

        List<GradeEntity> list = pageModel.getList();

        JSONArray array = new JSONArray();
        JSONObject obj = null;
        for (GradeEntity gradeEntity : list) {
            obj = new JSONObject();
            obj.put("id", gradeEntity.getId());
            obj.put("name", gradeEntity.getName());
            obj.put("remarks", gradeEntity.getRemarks());
            obj.put("creatorName", gradeEntity.getCreatorName());
            obj.put("createTime", StringUtil.dateToStrLong(gradeEntity.getCreateTime()));

            array.add(obj);
        }
        pageModel.setList(array);

        return APIResult.success().setValue(pageModel);
    }

    @GetMapping("/apiByTenant")
    public ServerResponse getApiByTenant(@RequestParam String id) {

        List<String> apiIds = gradeServiceImpl.getApiIdsByTenantId(id);

        return ServerResponse.createBySuccess(apiIds);
    }

    @GetMapping("/menuByTenant")
    public ServerResponse getMenuByTenant(@RequestParam String id) {

        List<String> menuIds = gradeServiceImpl.getMenuIdsByTenantId(id);

        return ServerResponse.createBySuccess(menuIds);
    }
}
