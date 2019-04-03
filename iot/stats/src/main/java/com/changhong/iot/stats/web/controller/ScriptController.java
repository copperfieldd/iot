package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.service.ScriptService;
import com.changhong.iot.stats.web.dto.ScriptRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Created by guiqijiang on 11/8/18.
 */
@RestController
public class ScriptController {

    @Autowired
    ScriptService scriptService;

    @PostMapping(APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_ADD)
    public ResultData addScript(@Validated @RequestBody ScriptRqtDTO dto, ResultData resultData) throws ServiceException {
//        resultData.setMessage("添加成功");
        resultData.setStatus(ErrorCode.SUCCESS);
        resultData.setValue(scriptService.add(dto));
        return resultData;
    }

    @PostMapping({APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_UPDATE})
    public ResultData updateScript(@Validated @RequestBody ScriptRqtDTO dto, ResultData resultData) throws ServiceException {
        scriptService.update(dto);
//        resultData.setMessage("修改成功");
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_DELETE)
    public ResultData delScript(@RequestParam String id, ResultData resultData) throws ServiceException {
        scriptService.updateState(id, BaseBean.State.DELETE);
//        resultData.setMessage("删除成功");
        resultData.setStatus(ErrorCode.SUCCESS);
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_ITEM)
    public ResultData getScriptItem(ScriptRqtDTO dto, ResultData resultData) {
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        resultData.setValue(scriptService.getItem(dto.getId()));
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_LIST)
    public ResultData getScripts(ScriptRqtDTO dto, ResultData resultData) {
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        resultData.setValue(scriptService.getScriptList(dto));
        return resultData;
    }
}
