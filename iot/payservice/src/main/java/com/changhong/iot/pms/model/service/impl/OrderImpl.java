package com.changhong.iot.pms.model.service.impl;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.pms.model.bean.OrderBean;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.pms.model.repository.OrderRepository;
import com.changhong.iot.pms.model.service.OrderService;
import com.changhong.iot.pms.model.service.ApplicationService;
import com.changhong.iot.pms.web.dto.ApplicationRpsDTO;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午6:22 18-1-18
 */
@Service
public class OrderImpl implements OrderService {

    @Autowired
    ApplicationService applicationService;

    @Autowired
    OrderRepository orderRepository;

    @Override
    public PageModel<OrderRptDTO> getOrderList(OrderRqtDTO orderDTO) {
        PageModel<OrderBean> pageModel = orderRepository.findByDTO(orderDTO);
        List<OrderRptDTO> list = new ArrayList<>();
        for (OrderBean o : pageModel.getList()) {
            HashMap hashMap = new HashMap();
            hashMap.put("order_sn", o.getOrderSn());
            hashMap.put("status", o.getStatus());
            hashMap.put("total_fee", o.getTotalFee());
            hashMap.put("trade_channel", o.getTradeChannel());
            hashMap.put("subject", o.getSubject());
            hashMap.put("app_name", o.getAppName());
            hashMap.put("create_time", o.getCdt());
            hashMap.put("_id", o.getId());
            list.add(new OrderRptDTO(hashMap));
        }

        PageModel<OrderRptDTO> page = new PageModel<>();
        page.setTotalCount(pageModel.getTotalCount());
        page.setList(list);

        return page;
    }

    @Override
    public OrderRptDTO getOrderBySn(String sn) {
        OrderBean bean = orderRepository.findByOrderSn(sn);
        if (null == bean) {
            return null;
        }

        OrderRptDTO queryDTO = new OrderRptDTO(bean);
        ApplicationRpsDTO applicationRpsDTO = applicationService.getApplicationByAppId(bean.getAppId());
        if (null != applicationRpsDTO) {
            queryDTO.setAppName(applicationRpsDTO.getName());
        }

        return queryDTO;
    }

    @Override
    public int orderQuery(String orderSn, String outTradeNo, String appId, String appsecret) throws ServiceException {
        String key = applicationService.getKeyByAppId(appId);
        if (StringUtils.isEmpty(key)) {
            return -3;
        }
        OrderBean orderBean;

        if (StringUtils.isNotEmpty(orderSn)) {
            orderBean = orderRepository.findByOrderSn(orderSn);
        } else {
            orderBean = orderRepository.findByOutTradeNo(outTradeNo);
        }
        if (null == orderBean) {
            throw new ServiceException(1, "未找到订单");
        }
        if (!appId.equals(orderBean.getAppId())) {
            throw new ServiceException(1, "appID错误");
        }
        if (!appsecret.equals(key)) {
            throw new ServiceException(1, "appsecret错误");
        }
        return orderBean.getStatus();
    }

    @Override
    public OrderBean getOutTradeNo(String outTradeNo) {
        return orderRepository.findByOutTradeNo(outTradeNo);
    }

    @Override
    public List count() {
        List<Map> list = orderRepository.countOrderSum();
        list.forEach((map) -> {
            String appUserId = (String) map.get(OrderBean.FILED_APP_USER_ID);
            long num = orderRepository.orderSum(appUserId);
            map.put("newOrderSum", num);
        });
        return list;
    }

    @Override
    public long orderSum() {
        return orderRepository.orderSum();
    }

    @Override
    public long newOrderSum() {
        return orderRepository.newOrderSum();
    }

}
