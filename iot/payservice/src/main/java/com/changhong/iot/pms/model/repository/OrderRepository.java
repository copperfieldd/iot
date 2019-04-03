package com.changhong.iot.pms.model.repository;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;

import java.util.HashMap;
import java.util.List;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午12:37 18-1-5
 */
public interface OrderRepository extends BaseMongoRepository<OrderBean> {

    /**
     * 根据系统内部订单获取订单信息
     *
     * @param sn
     * @return
     */
    OrderBean findByOrderSn(String sn);

    /**
     * 根据系统内部订单获取订单信息
     *
     * @param reqDTO
     * @return
     */
    PageModel<OrderBean> findByDTO(OrderRqtDTO reqDTO);

    /**
     * 获取商户订单
     *
     * @param outTradeNo 商户订单
     * @return
     */
    OrderBean findByOutTradeNo(String outTradeNo);

    /**
     * 统计
     *
     * @return
     */
    List countOrderSum();

    /**
     * 统计
     *
     * @return
     */
    long orderSum(String appUserId);

    /**
     * 统计
     * @return
     */
    long orderSum();

    /**
     * 新增订单总数
     * @return
     */
    long newOrderSum();
}
