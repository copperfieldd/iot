package com.changhong.iot.pms.model.service.tradechannel;

import com.alibaba.fastjson.JSON;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.web.controller.APIPathConfConstant;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.config.pay.PaymentBean;
import com.changhong.iot.pms.config.pay.Trade;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.common.exception.ServiceException;
import com.github.wxpay.sdk.WXPay;
import com.github.wxpay.sdk.WXPayUtil;
import com.changhong.iot.pms.config.pay.WXPayConfigImpl;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * @Auspring boot bannerthor: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午9:54 18-1-18
 */
@Trade(value = OrderConfig.TradeChannel.WEIXIN)
@Slf4j
public class WXTradeChannelImpl implements TradeChannelService {

    @Autowired
    WXPay wxPay;

    @Autowired
    WXPayConfigImpl wxPayConfig;

    @Value("${server.domain}")
    private String domain;

    @Override
    public Map<String, String> submitOrder(String form, OrderBean orderBean) throws ServiceException {
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

    private String makeQrCoderUrl(OrderBean orderBean) throws ServiceException {
        HashMap<String, String> data = new HashMap();
        String orderSn = orderBean.getOrderSn();
        data.put("body", "" + orderBean.getSubject());
        data.put("out_trade_no", orderSn);
        //设备号
        data.put("device_info", "");
        data.put("fee_type", "CNY");
        data.put("total_fee", "" + orderBean.getTotalFee());
        data.put("notify_url", domain + "/" + APIPathConfConstant.ROUTER_TRADE_NOTIFY + "/" + OrderConfig.TradeChannel.WEIXIN.ordinal());
        data.put("trade_type", "NATIVE");
        //商户ID
        data.put("product_id", "");
        String qrCodeUrl;
        try {
            Map<String, String> resultData = wxPay.unifiedOrder(data);
            qrCodeUrl = resultData.get("code_url");
            if (StringUtils.isEmpty(qrCodeUrl)) {
                log.error("微信二维码生成失败：{}", resultData);
                throw new ServiceException(ErrCode.ORDER_ERROR, "订单异常:" + orderSn + "   微信二维码生成失败");
            }
        } catch (Exception e) {
            throw new ServiceException(ErrCode.ORDER_ERROR, "订单异常:" + orderSn + "信息: " + e.getMessage());
        }

        return qrCodeUrl;
    }

    @Override
    public boolean refund(OrderBean orderBean) {
        HashMap<String, String> data = new HashMap<>();
        data.put("out_trade_no", orderBean.getTradeNo());
        data.put("total_fee", "" + orderBean.getTotalFee());
        data.put("refund_fee", "" + orderBean.getTotalFee());
        data.put("notify_url", domain + "/" + APIPathConfConstant.ROUTER_TRADE_NOTIFY_REFUND + "/" + OrderConfig.TradeChannel.WEIXIN.ordinal());
        try {
            Map map = wxPay.refund(data);
            if ("SUCCESS".equals(map.get("return_code"))) {
                return true;
            }
        } catch (Exception e) {
            log.error("订单退款失败:{}, errorMessage:", orderBean.getOrderSn(), e.getMessage());
        }
        return false;
    }

    @Override
    public boolean closeOrder(OrderBean orderBean) {

        try {
            Map<String, String> reqData = new HashMap<>();
            reqData.put("appid", wxPayConfig.getAppID());
            reqData.put("mch_id", wxPayConfig.getMchID());
            reqData.put("out_trade_no", orderBean.getOrderSn());
            reqData.put("nonce_str", WXPayUtil.generateNonceStr());
            reqData.put("sign_type", wxPayConfig.getSignType().toString());
            reqData.put("sign", WXPayUtil.generateSignature(reqData, wxPayConfig.getKey(), wxPayConfig.getSignType()));
            Map map = wxPay.closeOrder(reqData);
            String code = (String) map.get("return_code");
            if ("SUCCESS".equals(code)) {
                return true;
            }
            log.error("订单关闭失败:{},  返回信息:{}", orderBean.getOrderSn(), JSON.toJSONString(map));

            return false;
        } catch (Exception e) {
            log.error("订单关闭失败:{}", orderBean.getOrderSn());
        }
        return false;
    }

    @Override
    public String payNotify(Map<String, String> map, Function<PaymentBean, Boolean> fun) {

        try {
            if (!"SUCCESS".equals(map.get("return_code"))) {
                log.error("微信-->失败:{},交易号:{},订单号:{},原因:{}"
                        , map.get("transaction_id")
                        , map.get("out_trade_no"),
                        map.get("return_msg"));
                return "<xml>" +
                        "<return_code><![CDATA[FAIL]]></return_code>" +
                        "<return_msg><![CDATA[nosuccess]]></return_msg>" +
                        "</xml>";
            }
            boolean checkSign = WXPayUtil.isSignatureValid(map, wxPayConfig.getKey());
            if (!checkSign) {
                log.error("微信-->支付通知时验签失败:{},交易号:{},订单号:{}", map.get("transaction_id"), map.get("out_trade_no"));
                return "<xml>" +
                        "<return_code><![CDATA[FAIL]]></return_code>" +
                        "<return_msg><![CDATA[签名失败]]></return_msg>" +
                        "</xml>";
            }

            PaymentBean paymentBean = new PaymentBean();
            paymentBean.setTradeSN(map.get("transaction_id"));
            paymentBean.setOutTradeSn(map.get("out_trade_no"));
            paymentBean.setPayTime(map.get("time_end"));
            paymentBean.setTradeChannel(OrderConfig.TradeChannel.WEIXIN);
            paymentBean.setBody(JSON.toJSONString(map));
            fun.apply(paymentBean);

            log.info("交易号:{},订单号:{},商品购买成功 ---->微信支付<----", map.get("transaction_id"), map.get("out_trade_no"));
            return "<xml>" +
                    "<return_code><![CDATA[SUCCESS]]></return_code>" +
                    "<return_msg><![CDATA[OK]]></return_msg>" +
                    "</xml>";
        } catch (Exception e) {
            return "<xml>" +
                    "<return_code><![CDATA[FAIL]]></return_code>" +
                    "<return_msg><![CDATA[nosuccess]]></return_msg>" +
                    "</xml>";
        }

    }

    @Override
    public String refundNotify(Map<String, String> map) {
        return null;
    }
}

