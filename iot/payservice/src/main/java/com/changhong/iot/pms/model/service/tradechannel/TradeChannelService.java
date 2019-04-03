package com.changhong.iot.pms.model.service.tradechannel;

import com.changhong.iot.pms.config.pay.PaymentBean;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.common.exception.ServiceException;

import java.util.Map;
import java.util.function.Function;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description: 在支付中涉及到回调API，先由第三方支付服务回调到本服务，
 * 然后再由本服务回调到PayParams类中notifyUrl指定的地址
 * @Date: Created in 上午9:50 18-1-18
 */
public interface TradeChannelService {

    /**
     * 统一提交订单
     *
     * @param form      支付类型
     * @param orderBean 订单实体
     * @return
     * @throws ServiceException
     */
    Map<String, String> submitOrder(String form, OrderBean orderBean) throws ServiceException;


    /**
     * 全额退款
     *
     * @param orderBean
     * @return
     */
    boolean refund(OrderBean orderBean);

    /**
     * 关闭订单 - 暂时只关闭本服务的订单
     *
     * @param orderBean
     * @return
     */
    @Deprecated
    boolean closeOrder(OrderBean orderBean);

    /**
     * 处理支付通知
     *
     * @param map
     * @return
     */
    String payNotify(Map<String, String> map, Function<PaymentBean, Boolean> fun);

    /**
     * 处理退款通知
     *
     * @param map
     * @return
     */
    String refundNotify(Map<String, String> map);
}
