package com.changhong.iot.pms.config.pay;

import lombok.Getter;
import lombok.Setter;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午1:14 18-1-23
 */
@Setter
@Getter
public class AlipayConfig {
    /*
     * 支付宝网关名、partnerId和appId
     */
    private String openApiDomain;

    private String mcloudApiDomain;

    /*
     * url签名密钥
     */
    private String aliapyAES;

    /*
     * 开发者ID
     */
    private String appId;

    /*
     * RSA私钥
     */
    private String privateKey;

    /*
     * 支付宝公钥
     */
    private String alipayPublicKey;

    /*
     * 签名类型: RSA->SHA1withRsa,RSA2->SHA256withRsa
     */
    private String signType = "RSA2";

    /*
     * 当面付最大查询次数
     */
    private int maxQueryRetry = 5;

    /*
     * 当面付查询间隔（毫秒）
     */
    private int queryDuration = 5000;

    /*
     * 当面付最大撤销次数
     */
    private int maxCancelRetry = 3;

    /*
     * 当面付撤销间隔（毫秒）
     */
    private int cancelDuration = 2000;

    /*
     * 交易保障线程第一次调度延迟
     */
    private int heartbeatDelay = 5;

    /*
     * 调度间隔（秒）
     */
    private int heartbeatDuration = 900;

}
