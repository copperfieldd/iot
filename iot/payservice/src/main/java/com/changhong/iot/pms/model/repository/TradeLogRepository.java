package com.changhong.iot.pms.model.repository;

import com.changhong.iot.pms.model.bean.TradeLogBean;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午12:37 18-1-5
 */
@Repository
public interface TradeLogRepository extends MongoRepository<TradeLogBean, String> {

    /**
     * 根据系统内部订单获取订单信息
     *
     * @param orderSn
     * @return
     */
    TradeLogBean findByOrderSn(String orderSn);
}
