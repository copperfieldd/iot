package com.changhong.iot.pms.model.service.impl;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.common.utils.SignTools;
import com.changhong.iot.common.utils.UUID;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.config.pay.PaymentBean;
import com.changhong.iot.pms.config.pay.TradeHandler;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.pms.model.repository.OrderRepository;
import com.changhong.iot.pms.model.service.ApplicationService;
import com.changhong.iot.pms.model.service.tradechannel.TradeChannelService;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.model.service.TradeService;
import com.changhong.iot.pms.web.dto.ApplicationRpsDTO;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Created by guiqijiang on 10/22/18.
 */
@Service
@Slf4j
public class TradeImpl implements TradeService {

    @Autowired
    WebHTTPService webHTTPService;

    @Autowired
    ApplicationService applicationService;

    @Autowired
    OrderRepository orderRepository;


    public String makeOrderSn(OrderRqtDTO orderDTO) throws ServiceException {
        String appId = orderDTO.getAppId();
        ApplicationRpsDTO applicationBean = applicationService.getApplicationByAppId(appId);
        if (null == applicationBean || applicationBean.getStatus() != 0) {
            throw new ServiceException(ErrCode.APPSECRET_ERROR, "订单生成失败,商户不存在或者被禁用");
        }
        Random random = new Random();
        OrderBean bean = new OrderBean();
        bean.setId(UUID.randomUUID().toString());
        bean.setAppId(orderDTO.getAppId());
        bean.setAppName(applicationBean.getName());
        bean.setCdt(DateUtil.getTime());
        bean.setGoodsDetail(orderDTO.getGoodsDetail());
        bean.setSubject(orderDTO.getSubject());
        boolean isNum = StringUtils.isNumeric(orderDTO.getTotalFee());
        if (isNum)
            bean.setTotalFee(Integer.parseInt(orderDTO.getTotalFee()));
        else {
            throw new ServiceException(ErrCode.ORDER_ERROR, "金额错误");
        }
        bean.setOutTradeNo(orderDTO.getOutTradeNo());
        bean.setGoodsDetail(orderDTO.getDetail());
        isNum = StringUtils.isNumeric(orderDTO.getTimeOut());
        if (isNum)
            bean.setTimeOut(Integer.parseInt(orderDTO.getTimeOut()));
        else
            bean.setTimeOut(360000);
        UserBean userBean = orderDTO.getUserBean();
        bean.setAppUserId(userBean.getAppUserId());
        bean.setLesseeUserId(userBean.getLesseeId());
        bean.setAttach(orderDTO.getAttach());
        String sn = DateUtil.format("yyyyMMddHHmmss")
                + (random.nextInt(99999) % (99999 - 10000 + 1) + 99999);
        bean.setOrderSn(sn);
        bean.setStatus(OrderConfig.ORDER_STATUS_UNPAID);
        bean.setNotifyUrl(orderDTO.getNotifyUrl());
        bean.setStatus(0);
        orderRepository.save(bean);
        log.info("下单接口,下单完成,商户订单号:{},订单号:{}", orderDTO.getOutTradeNo(), sn);
        return sn;
    }

    private boolean pay(PaymentBean paymentBean) {
        OrderBean orderBean = orderRepository.findByOrderSn(paymentBean.getOutTradeSn());
        if (null == orderBean) {
            log.error("支付订单时 ----->{}<------ 此订单未找到,交易号为：{}", paymentBean.getOutTradeSn(), paymentBean.getTradeSN());
            return false;
        }

        if (orderBean.getStatus() == OrderConfig.ORDER_STATUS_PAYMENT) {
            log.error("支付订单时 ----->{}<------ 此订单已经被支付,交易号为：{}", paymentBean.getOutTradeSn(), paymentBean.getTradeSN());
            return false;
        }

        orderBean.setTradeChannel(paymentBean.getTradeChannel().ordinal());
        orderBean.setPayTime(paymentBean.getPayTime());
        orderBean.setBody(paymentBean.getBody());
        orderBean.setStatus(OrderConfig.ORDER_STATUS_PAYMENT);
        orderBean.setTradeNo(paymentBean.getTradeSN());
        orderRepository.save(orderBean);

        String key = applicationService.getKeyByAppId(orderBean.getAppId());
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("orderSn", orderBean.getOrderSn());
        hashMap.put("outTradeNo", orderBean.getOutTradeNo());
        hashMap.put("body", orderBean.getBody());
        hashMap.put("payTime", orderBean.getPayTime());
        hashMap.put("subject", orderBean.getSubject());
        hashMap.put("tradeChannel", "" + orderBean.getTradeChannel());
        hashMap.put("totalFee", "" + orderBean.getTotalFee());
        hashMap.put("status", String.valueOf(orderBean.getStatus()));
        String sign = SignTools.makeSign(key, hashMap);
        hashMap.put("sign", sign);

        //支付完成通知商家
        if (StringUtils.isNotEmpty(orderBean.getNotifyUrl())) {
            webHTTPService.payNotify(orderBean.getNotifyUrl(), hashMap);
        }
        return true;
    }

    @Override
    public boolean closeOrder(OrderRqtDTO params) {
        OrderBean orderBean = orderRepository.findByOrderSn(params.getOrderSn());
        if (null == orderBean) {
            return false;
        }
        if (!params.getAppId().equalsIgnoreCase(orderBean.getAppId())) {
            return false;
        }
        if (orderBean.getStatus() == OrderConfig.ORDER_STATUS_UNPAID) {
            orderBean.setStatus(OrderConfig.ORDER_STATUS_CLOSE);
            return true;
        }
        return false;
    }


    @Override
    public Map submitOrder(OrderRqtDTO orderDTO) throws ServiceException {
        boolean isNum = StringUtils.isNumeric(orderDTO.getTradeChannel());
        int tradeChannel;
        if (isNum)
            tradeChannel = Integer.parseInt(orderDTO.getTradeChannel());
        else {
            throw new ServiceException(ErrCode.ORDER_PAY, "渠道错误");
        }
        OrderBean orderBean = orderRepository.findByOrderSn(orderDTO.getOrderSn());
        if (null == orderBean) {
            throw new ServiceException(ErrCode.ORDER_PAY, "订单未找到");
        }
        if (!orderBean.getAppId().equals(orderDTO.getAppId())) {
            throw new ServiceException(ErrCode.ORDER_PAY, "此订单非当前应用");
        }
        if (orderBean.getStatus() != OrderConfig.ORDER_STATUS_UNPAID) {
            throw new ServiceException(ErrCode.ORDER_PAY, "订单不属于待支付状态:" + orderBean.getOrderSn());
        }
        Long timeOut = orderBean.getCdt() + 60 * 60 * 12;
        Long toDay = DateUtil.getTime();
        if (toDay > timeOut || toDay > (orderBean.getCdt() + orderBean.getTimeOut())) {
            throw new ServiceException(ErrCode.ORDER_TIME_OUT, "订单超时");
        }
        OrderConfig.TradeChannel channel = OrderConfig.getChannel(tradeChannel);
        if (null == channel) {
            throw new ServiceException(ErrCode.ORDER_PAY, "支付渠道错误");
        }
        TradeChannelService tradeChannelService = TradeHandler.GET_PAY_SERVICES().get(channel);
        Map map = tradeChannelService.submitOrder(orderDTO.getForm(), orderBean);
        if (null == map) {
            throw new ServiceException(ErrCode.ORDER_PAY, "支付类型错误");
        }
        orderBean.setNotifyUrl(orderDTO.getNotifyUrl());
        orderRepository.save(orderBean);
        return map;
    }

    @Override
    public void refund(OrderRqtDTO rqtParams) throws ServiceException {
        OrderBean orderBean = orderRepository.findByOrderSn(rqtParams.getOrderSn());
        if (null == orderBean) {
            throw new ServiceException(ErrCode.ORDER_ERROR, "未找到订单");
        }
        if (!rqtParams.getAppId().equalsIgnoreCase(orderBean.getAppId())) {
            throw new ServiceException(ErrCode.ORDER_ERROR, "订单信息错误");
        }
        if (orderBean.getStatus() != OrderConfig.ORDER_STATUS_PAYMENT && orderBean.getStatus() != OrderConfig.ORDER_STATUS_INREFUND) {
            throw new ServiceException(ErrCode.ORDER_REFUND, "当前订单无法退款");
        }
        orderBean.setStatus(OrderConfig.ORDER_STATUS_INREFUND);
        orderRepository.save(orderBean);
        OrderConfig.TradeChannel channel = OrderConfig.getChannel(orderBean.getTradeChannel());
        TradeChannelService tradeChannelService = TradeHandler.GET_PAY_SERVICES().get(channel);
        boolean result = tradeChannelService.refund(orderBean);
        if (!result) {
            throw new ServiceException(ErrCode.ORDER_REFUND, "退款失败,请联系管理员");
        }
    }

    @Override
    public OrderRptDTO refundQuery(OrderRqtDTO orderDTO) throws ServiceException {
        OrderBean bean = orderRepository.findByOrderSn(orderDTO.getOrderSn());
        if (null == bean) {
            throw new ServiceException(ErrCode.ORDER_ERROR, "未找到订单");
        }
        if (!orderDTO.getAppId().equalsIgnoreCase(bean.getAppId())) {
            throw new ServiceException(ErrCode.ORDER_ERROR, "订单信息错误");
        }
        return new OrderRptDTO(bean);
    }

    @Override
    public String notify(Map<String, String> map, OrderConfig.TradeChannel tradeChannel) {
        TradeChannelService tradeChannelService = TradeHandler.GET_PAY_SERVICES().get(tradeChannel);
        return tradeChannelService.payNotify(map, this::pay);
    }


}
