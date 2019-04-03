package com.changhong.iot.pms.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;

import java.util.Map;

/**
 * Created by guiqijiang on 10/22/18.
 */
public interface TradeService {

    /**
     * 生成服务订单
     *
     * @param orderDTO 订单内容
     * @return null or 订单号
     */
    String makeOrderSn(OrderRqtDTO orderDTO) throws ServiceException;

    /**
     * 关闭订单
     * 以下情况需要调用关单接口：商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，
     * 避免重复支付；系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
     *
     * @param params 订单号码
     * @return
     */
    boolean closeOrder(OrderRqtDTO params);

    /**
     * 统一支付
     *
     * @param orderDTO
     * @return
     * @throws ServiceException
     */
    Map submitOrder(OrderRqtDTO orderDTO) throws ServiceException;

    /**
     * 统一全额退款
     *
     * @param orderRqtParams
     * @return
     */
    void refund(OrderRqtDTO orderRqtParams) throws ServiceException;


    /**
     * 退款查询
     *
     * @param orderDTO
     * @return
     */
    OrderRptDTO refundQuery(OrderRqtDTO orderDTO) throws ServiceException;

    /**
     * 统一回调
     *
     * @param map          参数
     * @param tradeChannel 类型
     * @return
     */
    String notify(Map<String, String> map, OrderConfig.TradeChannel tradeChannel);
}
