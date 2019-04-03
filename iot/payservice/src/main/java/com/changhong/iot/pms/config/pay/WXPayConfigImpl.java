package com.changhong.iot.pms.config.pay;

import com.github.wxpay.sdk.WXPayConfig;
import com.github.wxpay.sdk.WXPayConstants;
import lombok.Getter;
import lombok.Setter;

import java.io.InputStream;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午9:48 18-1-22
 */
@Setter
@Getter
public class WXPayConfigImpl implements WXPayConfig {

    /*
     * 是否使用沙箱环境
     */
    private boolean useSandbox = false;

    /*
     * 公众账号ID
     */
    private String appID = "";

    /*
     * 商户号
     */
    private String mchID = "";

    /*
     * API密钥
     */
    private String key = "";

    /*
     * HTTP(S) 连接超时时间，单位毫秒
     */
    private int HttpConnectTimeoutMs = 0;

    /*
     * HTTP(S) 读数据超时时间，单位毫秒
     */
    private int HttpReadTimeoutMs;

    /*
     * 进行健康上报的线程的数量
     */
    private int reportWorkerNum;

    /*
     * 健康上报缓存消息的最大数量。会有线程去独立上报 粗略计算：加入一条消息200B，10000消息占用空间 2000 KB，约为2MB，可以接受
     */
    private int reportBatchSize;

    /*
     * 签名方式
     */
    private String signType;

    public WXPayConstants.SignType getSignType() {
        if (WXPayConstants.MD5.equals(signType)) {
            return WXPayConstants.SignType.MD5;
        } else {
            return WXPayConstants.SignType.HMACSHA256;
        }
    }

    @Override
    public InputStream getCertStream() {
        return null;
    }
}
