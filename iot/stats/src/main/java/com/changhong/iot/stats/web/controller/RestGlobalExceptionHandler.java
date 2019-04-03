/**
 * 异常管理
 * 所以的Rest请求出现的异常均在本类中处理
 */
package com.changhong.iot.stats.web.controller;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

/**
 * Created by guiqijiang on 1/2/19.
 */
@RestControllerAdvice(annotations = {RestController.class})
public class RestGlobalExceptionHandler {
    private static ThreadLocal<ResultData> local = ThreadLocal.withInitial(() -> new ResultData());

    /**
     * 业务异常
     *
     * @param ex
     * @return
     */
    @ExceptionHandler(value = ServiceException.class)
    public ResultData serviceExceptionHandler(ServiceException ex) {
        ex.printStackTrace();
        ResultData resultData = local.get();
        resultData.setValue(new String[]{ex.getMessage()});
        resultData.setStatus(ex.getStatus());
        return resultData;
    }

    /**
     * 参数异常
     * 在controller类中加入@Validated注解的异常都会在这里进行捕获(有异常的情况下)
     *
     * @param ex
     * @return
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResultData methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException ex) {
        ex.printStackTrace();
        ResultData resultData = local.get();
        BindingResult bindingResult = ex.getBindingResult();
        FieldError fieldError = bindingResult.getFieldError();
        resultData.setValue(new String[]{ex.getMessage()});
        resultData.setStatus(ErrorCode.PARAMETER_ERROR);
        return resultData;
    }


    /**
     * 读写异常
     *
     * @return
     */
    @ExceptionHandler(value = IOException.class)
    public ResultData IOExceptionHandler() {
        ResultData resultData = local.get();
        resultData.setValue("读写异常");
        resultData.setStatus(ErrorCode.OPAQUE_ERROR);
        return resultData;
    }

    /**
     * 其它异常
     *
     * @return
     */
    @ExceptionHandler(value = Exception.class)
    public ResultData exceptionHandler(Exception ex) {
        ex.printStackTrace();
        ResultData resultData = local.get();
//        resultData.setValue();
        resultData.setStatus(ErrorCode.SERVER_EXCEPTION);
        ex.printStackTrace();
        return resultData;
    }


}
