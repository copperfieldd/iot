package com.changhong.iot.pms.config.pay;

import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Created by guiqijiang on 10/23/18.
 */

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Trade {
    OrderConfig.TradeChannel value();
}
