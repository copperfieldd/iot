package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.service.ApplicationService;
import com.changhong.iot.stats.model.service.UserService;
import com.changhong.iot.stats.web.dto.ApplicationRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by guiqijiang on 11/6/18.
 */
@RestController
public class ApplicationController {

    @Autowired
    ApplicationService appService;

    @Autowired
    UserService userService;

    /**
     * 新建应用
     */
    @PostMapping(APIPathConfConstant.ROUTER_API_APPLICATION_ADD)
    public ResultData addApp(@Validated @RequestBody ApplicationRqtDTO rqtDTO,
                             ResultData resultData,
                             HttpServletRequest request) throws ServiceException {
        Map map = userService.getUser(request);
        rqtDTO.setUser(map);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("添加成功");
        resultData.setValue(appService.add(rqtDTO));
        return resultData;
    }

    /**
     * 修改应用
     * @throws ServiceException
     */
    @PostMapping({APIPathConfConstant.ROUTER_API_APPLICATION_UPDATE})
    public ResultData updateApp(@Validated @RequestBody ApplicationRqtDTO rqtDTO, ResultData resultData) throws ServiceException {
        appService.update(rqtDTO);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("修改成功");
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_APPLICATION_DELETE)
    public ResultData delApp(@RequestParam("id") String id, ResultData resultData) throws ServiceException {
        appService.updateState(id, BaseBean.State.DELETE);
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("删除成功");
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_APPLICATION_ITEM)
    public ResultData getAppItem(ApplicationRqtDTO rqtDTO, ResultData resultData) {
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        resultData.setValue(appService.getAppItem(rqtDTO));
        return resultData;
    }

    @GetMapping(value = APIPathConfConstant.ROUTER_API_APPLICATION_LIST)
    public ResultData getAppList(ApplicationRqtDTO rqtDTO, ResultData resultData) {
        resultData.setStatus(ErrorCode.SUCCESS);
//        resultData.setMessage("ok");
        resultData.setValue(appService.getAppList(rqtDTO));
        return resultData;
    }
}
