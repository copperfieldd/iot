package com.changhong.iot.pms.web.controller;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.model.service.OrderService;
import com.changhong.iot.pms.web.dto.BeanRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by guiqijiang on 2018/10/19.
 */
@RestController
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping(APIPathConfConstant.ROUTER_API_ORDER_LIST)
    public ResultData orderList(OrderRqtDTO params,
                                HttpServletRequest request,
                                ResultData resultData) {

        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setMessage("ok");
        params.setUserBean(BeanRqtDTO.getUser(request));
        resultData.setValue(orderService.getOrderList(params));

        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_ORDER_ITEM)
    public ResultData orderItem(OrderRqtDTO params,
                                HttpServletRequest request,
                                ResultData resultData) throws ServiceException {
        params.setUserBean(BeanRqtDTO.getUser(request));
        OrderRptDTO queryDTO = orderService.getOrderBySn(params.getOrderSn());
        resultData.setValue(queryDTO);
        resultData.setMessage("ok");
        resultData.setStatus(ErrCode.SUCCESS);
        return resultData;
    }
}
