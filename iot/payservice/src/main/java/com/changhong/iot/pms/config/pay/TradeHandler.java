package com.changhong.iot.pms.config.pay;

import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.changhong.iot.pms.model.service.tradechannel.TradeChannelService;
import com.github.wxpay.sdk.WXPay;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午12:38 18-1-22
 * @Autowired private RestTemplateBuilder builder;
 * @Bean public RestTemplate restTemplate() { return builder.build(); }
 */
@Component
public class TradeHandler implements BeanPostProcessor {

    private static final HashMap<OrderConfig.TradeChannel, TradeChannelService> PAY_SERVICES = new HashMap<>();

    public static Map<OrderConfig.TradeChannel, TradeChannelService> GET_PAY_SERVICES() {
        return (Map<OrderConfig.TradeChannel, TradeChannelService>) PAY_SERVICES.clone();
    }

    /**
     * 微信统一支付
     *
     * @param wxPayConfig
     * @return
     */
    @Bean
    public WXPay getWXPay(@Qualifier("getWXPayConfig") WXPayConfigImpl wxPayConfig) {
        return new WXPay(wxPayConfig, wxPayConfig.getSignType(), wxPayConfig.isUseSandbox());
    }

    @Bean
    @ConfigurationProperties(prefix = "web.config.pay.WX")
    public WXPayConfigImpl getWXPayConfig() {
        return new WXPayConfigImpl();
    }

    /**
     * 当面付2.0
     *
     * @param alipayConfig
     * @return
     */
    @Bean
    public AlipayClient getAlipay(@Qualifier("getAlipayConfig") AlipayConfig alipayConfig) {
        AlipayClient alipayClient = new DefaultAlipayClient(alipayConfig.getOpenApiDomain(), alipayConfig.getAppId(),
                alipayConfig.getPrivateKey(), "json", "UTF-8", alipayConfig.getAlipayPublicKey(),
                alipayConfig.getSignType());
        return alipayClient;
    }

    @Bean
    @ConfigurationProperties(prefix = "web.config.pay.alipay")
    public AlipayConfig getAlipayConfig() {
        return new AlipayConfig();
    }

    @Override
    public Object postProcessBeforeInitialization(Object o, String s) throws BeansException {
        Trade trade = o.getClass().getAnnotation(Trade.class);
        if (null != trade) {
            if (!(o instanceof TradeChannelService)) {
                throw new ApplicationContextException("被Pay注解的类必须实现PayService接口," + o.getClass());
            }
            OrderConfig.TradeChannel tradeChannel = trade.value();
            PAY_SERVICES.put(tradeChannel, (TradeChannelService) o);
        }
        return o;
    }

    @Override
    public Object postProcessAfterInitialization(Object o, String s) throws BeansException {
        return o;
    }
}
