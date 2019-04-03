package com.changhong.iot.pms.web.controller;

import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.bean.UserBean;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午4:56 18-1-17
 */
@RestControllerAdvice(annotations = RestController.class)
public class CustomControllerAdvice {

    private static ThreadLocal<ResultData> local = ThreadLocal.withInitial(() -> new ResultData());

    @ModelAttribute
    public ResultData getResultData() {
        ResultData resultData = local.get();
        resultData.setValue(ErrCode.SUCCESS);
        resultData.setMessage("ok");
        return resultData;
    }

    @ModelAttribute
    public UserBean getUser(HttpServletRequest request) {
        UserBean userBean = (UserBean) request.getAttribute("userBean");
        return userBean;
    }
}
