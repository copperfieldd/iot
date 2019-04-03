package com.changhong.iot.pms.web.controller;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.model.service.TradeService;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午4:00 18-4-23
 */
@Controller
public class TradeH5Contoller {

    @Autowired
    TradeService tradeService;

    /**
     * 微信H5支付,在参数中涉及到两个回调
     * 第一个回调 payParams.notifyUrl 这是微信支付完成异步通知地址 包含订单的全部相关参数
     * 第二个回调 redirectUrl 支付完成后系统会重定向到本url，参数只包含成功与否
     * 别搞混了，兄弟
     *
     * @return
     */
    @RequestMapping(path = APIPathConfConstant.ROUTER_INDEX_WECHAT_ORDER)
    public String wechatOrder(OrderRqtDTO dto,
                              HttpServletRequest request,
                              RedirectAttributes attributes) {
        try {
            tradeService.makeOrderSn(dto);
        } catch (ServiceException e) {
            return "pay/error";
        }
        /*//在以下逻辑 payParams->orderSn 代表本系统自己的订单号,不再代表商户订单号
        //payParams.setTradeChannel("JSAPI");
        //payParams.setOpenId(WebTools.getWechatOpenId(request));
        //Map<String, Object> data = wxPayService.submitOrder(payParams);
        if (null != data) {
            HashMap<String, String> map = new HashMap<>();
            map.put("package", "prepay_id=" + data.getChannel("orderSn"));
            attributes.addFlashAttribute("data", wxPayService.fillRequestData(map));
            attributes.addFlashAttribute("redirectUrl",redirectUrl);
            return "redirect:" + APIPathConfConstant.ROUTER_INDEX_WECHAT_HTML_PAY;
        } else {
            return "pay/error";
        }*/
        return "";
    }

    /**
     * 为了路径与微信上注册的路径一样所以需要重定向到此接口，注意：必须要重定向过来
     * ps:如果微信上注册的支付地址是: xxx.pms.com/pay/ 但实际上地址是 xxx.pms.com//pay/ 这样是错误的
     * 所以务必由我们自己来重定向一下，预防以上错误
     * <p>
     * 通过 RedirectAttributes 这个类可以把参数携带到本接口中
     *
     * @return
     */
    @RequestMapping(path = APIPathConfConstant.ROUTER_INDEX_WECHAT_HTML_PAY)
    private String pay() {
        return "pay/wechatpay";
    }

    @RequestMapping(path = "/wechat/index")
    @ResponseBody
    public String test(HttpServletRequest request) {
        if (null != request.getParameter("echostr")) {
            return request.getParameter("echostr");
        }
        return "";
    }
}
