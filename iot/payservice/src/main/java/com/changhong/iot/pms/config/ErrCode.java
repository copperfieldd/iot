package com.changhong.iot.pms.config;

import com.changhong.iot.common.config.ErrorCode;

public class ErrCode extends ErrorCode {

    // 订单未知错误
    public static final int ORDER_ERROR = 10000;

    // 订单重复
    public static final int ORDER_REPEAT = 10001;

    // 订单支付错误
    public static final int ORDER_PAY = 10002;

    // 订单超时
    public static final int ORDER_TIME_OUT = 10003;

    // 订单退款失败
    public static final int ORDER_REFUND = 10004;

    // 商户密匙错误
    public static final int APPSECRET_ERROR = 20001;

}
