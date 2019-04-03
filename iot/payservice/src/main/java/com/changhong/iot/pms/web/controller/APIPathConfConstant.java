package com.changhong.iot.pms.web.controller;

/**
 * @author jiangguiqi
 * @date 16-12-22
 */
public class APIPathConfConstant {

    // 回调接口 仅供支付渠道调用(支付)
    public static final String ROUTER_TRADE_NOTIFY = "/notify/pay";

    // 回调接口 仅供支付渠道调用(退款)
    public static final String ROUTER_TRADE_NOTIFY_REFUND = "/notify/refund";

    // 统一下单
    public static final String ROUTER_API_ORDER_MAKE = "/pay/makeorder";

    // 统一提交订单接口
    public static final String ROUTER_API_ORDER_UNIFIED = "/pay/submitorder";

    // 在支付渠道APP中的浏览器中调用 如：微信公众号,属于直接支付的一种无需预下单
    public static final String ROUTER_INDEX_WECHAT_ORDER = "/h5/wechatorder";

    // 关闭订单
    public static final String ROUTER_API_CLOSE_ORDER = "/pay/closeorder";

    // 申请退款
    public static final String ROUTER_API_REFUND = "/pay/refund";

    // 查询退款进度
    public static final String ROUTER_API_REFUND_QUERY = "/pay/refundquery";

    // 查询订单
    public static final String ROUTER_API_ORDER_ITEM = "/pay/order/item";

    // 查询订单列表
    public static final String ROUTER_API_ORDER_LIST = "/pay/order/list";

    // 获取单个应用
    public static final String ROUTER_API_APPLICATION_ITEM = "/application/item";

    // 获取应用列表
    public static final String ROUTER_API_APPLICATION_LIST = "/application/list";

    // 修改应用信息
    public static final String ROUTER_API_APPLICATION_UPDATE = "/application/upd";

    // 增加应用
    public static final String ROUTER_API_APPLICATION_ADD = "/application/add";

    // 生成密匙
    public static final String ROUTER_API_APPLICATION_MAKE_KEY = "/application/makekey";

    // 修改应用状态
    public static final String ROUTER_API_APPLICATION_UPDATE_STATUS = "/application/updstatus";

    // 下载订单对账单
    public static final String ROUTER_API_ORDER_DOWN_LOAD_BILL = "/pay/order/downloadbill";
    /*
     * 微信支付调起网页支付 这个地址需要在微信商户平台中注册 内部调用，地址可以按照商户平台中注册的路径随意更改
     */
    public static final String ROUTER_INDEX_WECHAT_HTML_PAY = "/pay/h5_wechat";

}
