package com.changhong.iot.pms.config.pay;

/**
 * Created by guiqijiang on 2018/10/18.
 */
public class OrderConfig {

    public enum TradeChannel {
        WEIXIN, ALIBABA, ERROR;
    }

    public static TradeChannel getChannel(int i) {
        if (i >= TradeChannel.values().length || i < 0)
            return TradeChannel.ERROR;
        return TradeChannel.values()[i];
    }

    // 二维码支付
    public static final String TRADE_FORM_CODE = "CODE";

    // APP支付
    public static final String TRADE_FORM_APP = "APP";

    // H5支付
    public static final String TRADE_FORM_H5 = "H5";

    // 订单状态-待支付
    public static final int ORDER_STATUS_UNPAID = 0;

    // 订单状态-已支付
    public static final int ORDER_STATUS_PAYMENT = 1;

    // 订单状态-超时
    public static final int ORDER_STATUS_OVERTIME = 2;

    // 订单状态-失败
    public static final int ORDER_STATUS_FAIL = 3;

    // 订单状态-退款
    public static final int ORDER_STATUS_REFUND = 4;

    // 订单状态-正在退款
    public static final int ORDER_STATUS_INREFUND = 5;

    // 订单状态-关闭
    public static final int ORDER_STATUS_CLOSE = 6;

}