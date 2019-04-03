package com.changhong.iot.pms.web.dto;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.HashMap;

/**
 * Created by guiqijiang on 10/29/18.
 */
@Setter
@Getter
public class OrderRptDTO {

    //订单号码
    private String orderSn;

    //渠道订单编号
    private String tradeNo;

    private String Id;

    //应用ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String appId;

    //应用ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String appName;

    //订单状态
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String status;

    //订单价格
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal totalFee;

    //支付渠道
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String tradeChannel;

    //商品名称
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String subject;

    //商品详情
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String goodsDetail;

    //创建时间
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createTime;

    //支付时间
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String payTime;

    //附加属性
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attach;

    //应用用户ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String appUserId;

    //租户ID
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String tenantId;

    //商品备注
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String describe;

    public void setCreateTime(Long time) {
        this.createTime = DateUtil.format(time, "yyyy/MM/dd HH:ss:mm");
    }

    public void setTradeChannel(Integer channel) {
        if (null == channel) {
            return;
        }

        OrderConfig.TradeChannel tradeChannel = OrderConfig.getChannel(channel);
        switch (tradeChannel) {
            case WEIXIN:
                this.tradeChannel = "微信";
                break;
            case ALIBABA:
                this.tradeChannel = "支付宝";
                break;
            default:
                this.tradeChannel = "未知的支付方式";
                break;
        }
    }

    public void setTotalFee(int fee) {
        this.totalFee = new BigDecimal(fee / 100d, MathContext.UNLIMITED);
    }

    public void setStatus(Integer status) {
        if (null == status) {
            return;
        }
        switch (status) {
            case OrderConfig.ORDER_STATUS_PAYMENT:
                this.status = "已支付";
                break;
            case OrderConfig.ORDER_STATUS_UNPAID:
                this.status = "待支付";
                break;
            case OrderConfig.ORDER_STATUS_OVERTIME:
                this.status = "超时";
                break;
            case OrderConfig.ORDER_STATUS_FAIL:
                this.status = "支付失败";
                break;
            case OrderConfig.ORDER_STATUS_REFUND:
                this.status = "已退款";
                break;
            case OrderConfig.ORDER_STATUS_INREFUND:
                this.status = "正在退款";
                break;
            case OrderConfig.ORDER_STATUS_CLOSE:
                this.status = "关闭";
                break;
            default:
                this.status = "订单状态错误";
                break;
        }
    }


    public OrderRptDTO(HashMap bean) {
        this.setId((String) bean.get("_id"));
        this.setOrderSn((String) bean.get("order_sn"));
        this.setAppId((String) bean.get("app_id"));
        this.setAppUserId((String) bean.get("app_user_id"));
        this.setTenantId((String) bean.get(OrderBean.FILED_LESSEE_ID));
        this.setPayTime((String) bean.get("pay_time"));
        this.setCreateTime(Long.parseLong(String.valueOf(bean.get("create_time"))));
        this.setAttach((String) bean.get("attach"));
        this.setGoodsDetail((String) bean.get("goods_detail"));
        this.setStatus(objToInt(bean.get("status")));
        this.setSubject((String) bean.get("subject"));
        this.setTotalFee(objToInt(bean.get("total_fee")));
        this.setTradeChannel(objToInt(bean.get("trade_channel")));
        this.setDescribe((String) bean.get("describe"));
        this.setAppName((String) bean.get("app_name"));
    }

    public OrderRptDTO(OrderBean bean) {
        this.setOrderSn(bean.getOrderSn());
        this.setTradeNo(bean.getTradeNo());
        this.setTotalFee(bean.getTotalFee());
        this.setAppId(bean.getAppId());
        this.setAppUserId(bean.getAppUserId());
        this.setTenantId(bean.getLesseeUserId());
        this.setPayTime(bean.getPayTime());
        this.setCreateTime(bean.getCdt());
        this.setDescribe(bean.getDescribe());
        this.setAttach(bean.getAttach());
        this.setGoodsDetail(bean.getGoodsDetail());
        this.setStatus(bean.getStatus());
        this.setSubject(bean.getSubject());
        this.setTotalFee(bean.getTotalFee());
        this.setTradeChannel(bean.getTradeChannel());
    }


    private int objToInt(Object o) {
        if (null == o) return -1;
        if (o instanceof Integer) {
            return (int) o;
        }
        String val = String.valueOf(o);
        try {
            return Integer.parseInt(val);
        } catch (Exception e) {
            return -1;
        }
    }

    private OrderRptDTO() {
    }
}
