package com.changhong.iot.pms.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import static com.changhong.iot.pms.model.bean.OrderBean.DOCUMENT;

@Getter
@Setter
@Document(collection = DOCUMENT)
public class OrderBean extends AbstractBase {

    public static final String DOCUMENT = "t_order";

    //支付系统单号
    public static final String FILED_ORDER_SN = "order_sn";
    @Field(FILED_ORDER_SN)
    private String orderSn;

    //商户系统的订单号 弃用
    public static final String FILED_OUT_TRADE_NO = "out_trade_no";
    @Field(FILED_OUT_TRADE_NO)
    @Deprecated
    private String outTradeNo;

    //第三方支付订单号（微信，支付宝）
    public static final String FILED_TRADE_NO = "trade_no";
    @Field(FILED_TRADE_NO)
    private String tradeNo;

    //订单状态
    public static final String FILED_STATUS = "status";
    @Field(FILED_STATUS)
    private Integer status;

    //订单总金额（分为单位)
    public static final String FILED_TOTAL_FEE = "total_fee";
    @Field(FILED_TOTAL_FEE)
    private Integer totalFee;

    /**
     * 支付类型
     *
     * @see com.changhong.iot.pms.config.pay.OrderConfig
     */
    public static final String FILED_TRADE_CHANNEL = "trade_channel";
    @Field(FILED_TRADE_CHANNEL)
    private Integer tradeChannel;

    //标题
    public static final String FILED_SUBJECT = "subject";
    @Field(FILED_SUBJECT)
    private String subject;

    //商品详情信息
    public static final String FILED_GOODS_DETAIL = "goods_detail";
    @Field(FILED_GOODS_DETAIL)
    private String goodsDetail;

    //支付时间
    public static final String FILED_PAY_TIME = "pay_time";
    @Field(FILED_PAY_TIME)
    private String payTime;

    //订单有效待支付时间(超时) yi
    private Integer timeOut = 60 * 60;

    //第三方支付对本商品的描述
    public static final String FILED_BODY = "body";
    @Field(FILED_BODY)
    private String body;

    //支付日志
    public static final String FILED_PAY_LOG = "pay_log";
    @Field(FILED_PAY_LOG)
    private String payLog;

    //合作商户appid
    public static final String FILED_APP_ID = "app_id";
    @Field(FILED_APP_ID)
    private String appId;

    //合作商户appName
    public static final String FILED_APP_NAME = "app_name";
    @Field(FILED_APP_NAME)
    private String appName;

    //用户支付完成后的通知地址
    public static final String FILED_NOTIFY_URL = "notify_url";
    @Field(FILED_NOTIFY_URL)
    private String notifyUrl;

    //附加信息
    public static final String FILED_ATTACH = "attach";
    @Field(FILED_ATTACH)
    private String attach;

    //租户UserID
    public static final String FILED_LESSEE_ID = "lessee_id";
    @Field(FILED_LESSEE_ID)
    private String lesseeUserId;

    //应用用户ID
    public static final String FILED_APP_USER_ID = "app_user_id";
    @Field(FILED_APP_USER_ID)
    private String appUserId;

    //应用用户名称
    public static final String FILED_APP_USER_NAME = "app_user_name";
    @Field(FILED_APP_USER_NAME)
    private String appUserName;

    //商家对本商品信息描述
    public static final String FILED_DESCRIBE = "describe";
    @Field(FILED_DESCRIBE)
    private String describe;
}
