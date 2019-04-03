package com.changhong.iot.pms.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by guiqijiang on 10/24/18.
 */
@Getter
@Setter
@Document(collection = TradeLogBean.DOCUMENT)
public class TradeLogBean extends AbstractBase {

    public static final String DOCUMENT = "t_trade_log";


    public static final String FILED_APP_ID = "app_id";
    @Field(FILED_APP_ID)
    private String appId;

    //订单
    public static final String FILED_ORDER_SN = "order_sn";
    @Field(FILED_ORDER_SN)
    private String orderSn;

    //动作
    public static final String FILED_ACTION = "action";
    @Field(FILED_ACTION)
    private String action;

    //订单价格
    public static final String FILED_ORDER_FEE = "order_fee";
    @Field(FILED_ORDER_FEE)
    private String fee;

    //租户UserID
    public static final String FILED_LESSEE_ID = "lessee_id";
    @Field(FILED_LESSEE_ID)
    private String lessee;

    //应用用户ID
    public static final String FILED_APP_USER_ID = "app_user_id";
    @Field(FILED_APP_USER_ID)
    private String appUserId;

    //应用用户名称
    public static final String FILED_APP_USER_NAME = "app_user_name";
    @Field(FILED_APP_USER_NAME)
    private String appUserName;

    //备注
    public static final String FILED_REMARKS = "remarks";
    @Field(FILED_REMARKS)
    private String remarks;
}
