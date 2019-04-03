package com.changhong.iot.common.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description: 异常
 * @Date: Created in 上午11:27 18-1-4
 */
public class ServiceException extends Exception {
    Logger logger = LoggerFactory.getLogger(this.getMessage());

    private Integer status;

    @Override
    public String getMessage() {
        return super.getMessage();
    }

    public Integer getStatus() {
        super.fillInStackTrace();
        return status;
    }

    public ServiceException(Integer status, String msg) {
        super(msg);
        this.status = status;
        logger.error("error:{},status:{}",msg,status);
    }
}
