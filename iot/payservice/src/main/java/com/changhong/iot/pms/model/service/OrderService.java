package com.changhong.iot.pms.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;

import java.util.List;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午6:22 18-1-18
 */
public interface OrderService {


    /**
     * 获取订单
     *
     * @param orderDTO
     * @return
     */
    PageModel<OrderRptDTO> getOrderList(OrderRqtDTO orderDTO);

    /**
     * 获取订单
     *
     * @param sn 系统订单号码
     * @return
     */
    OrderRptDTO getOrderBySn(String sn);

    /**
     * 查询订单支付状态
     * 如果orderSn 不为空则按照本订单查询数据,忽略outTradeNo
     *
     * @param orderSn    订单号
     * @param outTradeNo 商户系统订单号
     * @param appId      合作商ID
     * @param appsecret  合作码
     * @return 支付状态
     */
    int orderQuery(String orderSn, String outTradeNo, String appId, String appsecret) throws ServiceException;

    /**
     * 根据商户订单号查找订单
     *
     * @param outTradeNo 订单号
     * @return
     */
    OrderBean getOutTradeNo(String outTradeNo);

    /**
     * 统计
     *
     * @return item ->
     * tenantName 租户名称 忽略
     * tenantId 租户ID
     * appName 应用名称 忽略
     * appId 应用ID
     * orderSum 订单总数
     * newOrderSum 当日订单总数
     */
    List count();

    /**
     * 统计订单总数
     * @return
     */
    long orderSum();

    /**
     * 新增订单总数
     * @return
     */
    long newOrderSum();
}
