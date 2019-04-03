package com.changhong.iot.pms.model.service.tradechannel;

import com.alibaba.fastjson.JSON;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.domain.AlipayTradeCloseModel;
import com.alipay.api.domain.AlipayTradePrecreateModel;
import com.alipay.api.domain.AlipayTradeRefundModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradeCloseRequest;
import com.alipay.api.request.AlipayTradePrecreateRequest;
import com.alipay.api.request.AlipayTradeRefundRequest;
import com.alipay.api.response.AlipayTradeCloseResponse;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.web.controller.APIPathConfConstant;
import com.changhong.iot.pms.config.pay.AlipayConfig;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.config.pay.PaymentBean;
import com.changhong.iot.pms.config.pay.Trade;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.model.service.impl.WebHTTPService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午1:31 18-1-23
 */
@Trade(OrderConfig.TradeChannel.ALIBABA)
@Slf4j
public class AliTradeChannelImpl implements TradeChannelService {

    @Value("${server.domain}")
    private String domain;

    @Autowired
    private AlipayClient alipayClient;

    @Autowired
    AlipayConfig alipayConfig;

    @Autowired
    WebHTTPService webHTTPService;


    @Override
    public Map<String, String> submitOrder(String form, OrderBean orderBean) {
        switch (form) {
            case OrderConfig.TRADE_FORM_CODE:
                HashMap<String, String> map = new HashMap<>();
                map.put("code", this.makeQrCoderUrl(orderBean));
                return map;
            case OrderConfig.TRADE_FORM_APP:
                return null;
            default:
                return null;
        }
    }

    private String makeQrCoderUrl(OrderBean orderBean) {
        String orderSn = orderBean.getOrderSn();
        //支付宝金额的单位为：元，参数中传入的金额单位为分，所以需要 1分/100 = 0.01 元
        AlipayTradePrecreateModel payModel = new AlipayTradePrecreateModel();
        payModel.setOutTradeNo(orderSn);
        payModel.setBody(orderBean.getBody());
        payModel.setSubject(orderBean.getSubject());
        BigDecimal totalAmount = BigDecimal.valueOf(orderBean.getTotalFee() / 100d);
        payModel.setTotalAmount(String.valueOf(totalAmount));
        //必填随便写的,不影响
        payModel.setStoreId("DNS");
        payModel.setTimeoutExpress((30) + "m");

        AlipayTradePrecreateRequest request = new AlipayTradePrecreateRequest();
        request.setNotifyUrl(domain + APIPathConfConstant.ROUTER_TRADE_NOTIFY + "/" + OrderConfig.TradeChannel.ALIBABA.ordinal());
        request.setBizModel(payModel);
        try {
            AlipayTradePrecreateResponse appPayResponse = alipayClient.execute(request);
            if (appPayResponse.isSuccess()) {
                return appPayResponse.getQrCode();
            } else {
                log.error("支付宝预下单失败!!! 信息:{}", appPayResponse.getMsg());
            }
        } catch (AlipayApiException e) {
            log.error("支付宝预下单失败!!! 信息:{}", e.getErrMsg());
        }
        return null;
    }

    @Override
    public boolean refund(OrderBean orderBean) {
        AlipayTradeRefundModel refundModel = new AlipayTradeRefundModel();
        refundModel.setTradeNo(orderBean.getTradeNo());
        //支付宝金额的单位为：元，参数中传入的金额单位为分，所以需要 1分/100 = 0.01 元
        refundModel.setRefundAmount(String.valueOf(orderBean.getTotalFee() / 100));
        AlipayTradeRefundRequest refundRequest = new AlipayTradeRefundRequest();
        refundRequest.setBizModel(refundModel);
        try {
            AlipayTradeRefundResponse refundResponse = alipayClient.execute(refundRequest);
            if (refundResponse.isSuccess()) {
                HashMap<String, Object> hashMap = new HashMap<>();
                hashMap.put("orderSn", orderBean.getOrderSn());
                hashMap.put("outTradeNo", orderBean.getOutTradeNo());
                hashMap.put("totalFee", BigDecimal.valueOf(orderBean.getTotalFee()));
                hashMap.put("subject", orderBean.getSubject());
                hashMap.put("goodsDetail", orderBean.getGoodsDetail());
                hashMap.put("createTime", DateUtil.intToDateStr(orderBean.getCdt()));
                hashMap.put("payTime", orderBean.getPayTime());
                hashMap.put("body", orderBean.getBody());
                webHTTPService.post(orderBean.getNotifyUrl(), hashMap);
                return true;
            }
            log.error("退款失败:{}", refundResponse.getMsg());
        } catch (AlipayApiException e) {
            log.error("退款失败:{}", e.getErrMsg());
        }
        return false;
    }

    @Override
    public boolean closeOrder(OrderBean orderBean) {
        AlipayTradeCloseModel closeModel = new AlipayTradeCloseModel();
        closeModel.setOutTradeNo(orderBean.getOrderSn());
        AlipayTradeCloseRequest request = new AlipayTradeCloseRequest();
        request.setNotifyUrl(domain + APIPathConfConstant.ROUTER_TRADE_NOTIFY + "/" + OrderConfig.TradeChannel.ALIBABA.ordinal());
        request.setBizModel(closeModel);
        try {
            AlipayTradeCloseResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                return true;
            }
            log.error("关闭订单失败:{}", response.getMsg());
            return false;
        } catch (AlipayApiException e) {
            log.error("关闭订单失败:{}", e.getErrMsg());
        }

        return false;
    }

    @Override
    public String payNotify(Map<String, String> map, Function<PaymentBean, Boolean> fun) {
        try {
            boolean signCheck = AlipaySignature.rsaCheckV1(map,
                    alipayConfig.getAlipayPublicKey(), map.get("charset"), alipayConfig.getSignType());
            if (!signCheck) {
                log.error("支付宝-->支付通知时验签失败:{},交易号:{},订单号:{}", map, map.get("trade_no"), map.get("out_trade_no"));
                return "fail";
            }
            log.info("交易号:{},订单号:{},商品购买成功 ---->阿里支付<----", map.get("trade_no"), map.get("out_trade_no"));

            PaymentBean paymentBean = new PaymentBean();
            paymentBean.setTradeSN(map.get("trade_no"));
            paymentBean.setOutTradeSn(map.get("out_trade_no"));
            paymentBean.setPayTime(map.get("gmt_payment"));
            paymentBean.setTradeChannel(OrderConfig.TradeChannel.ALIBABA);
            paymentBean.setBody(JSON.toJSONString(map));
            fun.apply(paymentBean);
            return "success";
        } catch (AlipayApiException e) {
            return "error";
        }

    }

    @Override
    public String refundNotify(Map<String, String> map) {
        return null;
    }
}
