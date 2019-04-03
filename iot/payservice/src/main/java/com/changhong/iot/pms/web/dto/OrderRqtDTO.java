package com.changhong.iot.pms.web.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by guiqijiang on 2018/10/15.
 */
@Getter
@Setter
public class OrderRqtDTO extends BeanRqtDTO {

    //订单状态
    private Integer status = -1;

    //公共参数
    //订单号码
    private String orderSn;

    //商家APPID
    private String appId;

    //商品标题
    private String subject;

    //商品详情介绍
    private String goodsDetail;

    //商品详情说明
    private String detail;

    //附加数据
    private String attach;

    //商家订单号码
    private String outTradeNo;

    //商品价格，单位：分
    private String totalFee;

    //通知地址
    private String notifyUrl;

    //交易类型
    private String tradeChannel;

    //订单超时时间(秒)
    private String timeOut = "3600";

    //交易形式
    private String form;

    //数据签名
    private String sign;

    //用户TOKEN
    private String token;

    // 订单创建开始时间
    private String startTime;

    // 订单创建结束时间
    private String endTime;
}
