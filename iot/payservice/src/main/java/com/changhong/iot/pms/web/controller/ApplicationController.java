package com.changhong.iot.pms.web.controller;

import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.service.ApplicationService;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.web.dto.ApplicationRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by guiqijiang on 10/30/18.
 */
@RestController
public class ApplicationController {

    @Autowired
    ApplicationService applicationService;

    @GetMapping(APIPathConfConstant.ROUTER_API_APPLICATION_LIST)
    public ResultData getApplications(ApplicationRqtDTO params, ResultData resultData) {
        resultData.setValue(applicationService.getApplications(params));
        resultData.setStatus(ErrCode.SUCCESS);

        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_APPLICATION_ITEM)
    public ResultData getApplication(ApplicationRqtDTO params, ResultData resultData) {
        resultData.setValue(applicationService.getApplicationByAppId(params.getAppId()));
        resultData.setStatus(ErrCode.SUCCESS);

        return resultData;
    }

    @PostMapping(APIPathConfConstant.ROUTER_API_APPLICATION_UPDATE)
    public ResultData updateApplication(@RequestBody ApplicationRqtDTO params, ResultData resultData)
            throws ServiceException {

        applicationService.save(params);
        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setMessage("修改成功");

        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_APPLICATION_MAKE_KEY)
    public ResultData makeKey(ResultData resultData) {
        resultData.setValue(UUID.randomUUID().toString());
        resultData.setStatus(ErrCode.SUCCESS);
        return resultData;
    }

    @PostMapping(APIPathConfConstant.ROUTER_API_APPLICATION_ADD)
    public ResultData addApplication(@RequestBody ApplicationRqtDTO params, ResultData resultData)
            throws ServiceException {
        resultData.setValue(applicationService.insert(params));
        resultData.setMessage("添加成功");
        resultData.setStatus(ErrCode.SUCCESS);
        return resultData;
    }

    @PostMapping(APIPathConfConstant.ROUTER_API_APPLICATION_UPDATE_STATUS)
    public ResultData updStatusApplication(@RequestBody ApplicationRqtDTO params, ResultData resultData)
            throws ServiceException {
        applicationService.updateStatus(params.getStatus(), params.getAppId());
        resultData.setMessage("更改完成");
        resultData.setStatus(ErrCode.SUCCESS);
        return resultData;
    }
}
