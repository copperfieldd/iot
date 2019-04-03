package com.changhong.iot.pms.config.pay;

import java.lang.annotation.*;

/**
 * Created by guiqijiang on 10/24/18.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TradeLog {
    String value();
}
