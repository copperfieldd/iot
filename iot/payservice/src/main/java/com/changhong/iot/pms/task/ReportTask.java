package com.changhong.iot.pms.task;

import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.pms.model.service.OrderService;
import com.changhong.iot.pms.model.service.StatsService;
import com.changhong.iot.pms.model.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by guiqijiang on 11/23/18.
 */
@Component
@Slf4j
public class ReportTask {

    @Autowired
    StatsService statsService;

    @Autowired
    OrderService orderService;

    @Value("${stats.domain}")
    private String domain;

    @Value("${stats.collectionId}")
    private String collection;

    @Scheduled(cron = "${stats.cron}")
    public void reportData() {
        Map data = new HashMap();
        // 总租户 TODO 支付里租户的概念没理解到位
        data.put("tenantSum", 0);
        data.put("newTenantSum", 0);
        // 租户下的应用总数 TODO
        List list = new ArrayList();
        Map tenantAppSum = new HashMap();
        tenantAppSum.put("tenantId", "");
        tenantAppSum.put("tenantName", "");
        tenantAppSum.put("appSum", 0);
        tenantAppSum.put("newAppSum", 0);
        list.add(tenantAppSum);

        // 租户
        data.put("tenantAppSum", list);

        // 订单总数
        data.put("orderSum", orderService.orderSum());

        // 新增订单总数
        data.put("newOrderSum", orderService.newOrderSum());

        List orders = orderService.count();
        data.put("appOrderSum", orders);

        Map stats = new HashMap();
        stats.put("domain", domain);
        stats.put("collection", collection);
        stats.put("data", data);
        stats.put("reportTime", DateUtil.getTime() / 1000);
        String result = statsService.reportData(stats);
        log.info(result);
    }
}
