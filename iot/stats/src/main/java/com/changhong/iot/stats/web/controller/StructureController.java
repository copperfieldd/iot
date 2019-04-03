package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.service.StructureService;
import com.changhong.iot.stats.model.service.UserService;
import com.changhong.iot.stats.web.dto.StructureRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by guiqijiang on 11/7/18.
 */
@RestController
public class StructureController {

    @Autowired
    StructureService structureService;

    @Autowired
    UserService userService;

    @PostMapping(APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_ADD)
    public ResultData addStructure(@Validated @RequestBody StructureRqtDTO rqtDTO,
                                   ResultData resultData, HttpServletRequest request) throws ServiceException {
        Map map = userService.getUser(request);
        rqtDTO.setFounderId((String) map.get("id"));
        rqtDTO.setFounderName((String) map.get("userName"));
        resultData.setValue(structureService.addStructure(rqtDTO));
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("添加成功");
        return resultData;
    }

    @PostMapping({APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_UPDATE})
    public ResultData updateStructure(@Validated @RequestBody StructureRqtDTO rqtDTO, ResultData resultData) throws ServiceException {
        structureService.updateStructure(rqtDTO);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("修改成功");
        return resultData;
    }

    @GetMapping({APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_DELETE})
    public ResultData delStructure(String id, ResultData resultData) throws ServiceException {
        structureService.updateStructureState(id, BaseBean.State.DELETE);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("删除成功");
        return resultData;
    }


    @GetMapping(APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_ITEM)
    public ResultData getStructure(StructureRqtDTO rqtDTO, ResultData resultData) {
        resultData.setValue(structureService.getStructureItem(rqtDTO.getId()));
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_LIST)
    public ResultData getStructures(StructureRqtDTO rqtDTO, ResultData resultData) {
        resultData.setValue(structureService.getStructureList(rqtDTO));
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        return resultData;
    }

}
