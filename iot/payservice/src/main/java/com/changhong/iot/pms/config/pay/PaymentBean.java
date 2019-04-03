package com.changhong.iot.pms.config.pay;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 10/31/18.
 */
@Setter
@Getter
public class PaymentBean {

    // 渠道订单号
    private String tradeSN;

    // 本系统订单
    private String outTradeSn;

    // 支付时间
    private String payTime;

    // 支付渠道
    private OrderConfig.TradeChannel tradeChannel;

    // 渠道备注信息
    private String body;
}
