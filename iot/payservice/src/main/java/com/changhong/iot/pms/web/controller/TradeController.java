package com.changhong.iot.pms.web.controller;

import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.common.utils.SignTools;
import com.changhong.iot.pms.config.ErrCode;
import com.changhong.iot.pms.config.pay.OrderConfig;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.pms.model.service.TradeService;
import com.changhong.iot.common.utils.XmlTools;
import com.changhong.iot.pms.web.dto.BeanRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRqtDTO;
import com.changhong.iot.pms.web.dto.OrderRptDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description: 凡是交易都要具备两个条件
 * 1.必须是租户或者应用才可以进行交易
 * 2.必须有sign签名才能保证数据没有被篡改进而交易
 * @Date: Created in 下午2:56 17-1-17
 */
@RestController
public class TradeController {

    @Autowired
    TradeService tradeService;

    @RequestMapping(path = APIPathConfConstant.ROUTER_API_ORDER_MAKE)
    public ResultData makeOrder(HttpServletRequest request,
                                ResultData resultData) throws Exception {
        OrderRqtDTO orderRqtParams = factory(request, OrderRqtDTO.class);
        resultData.setMessage("ok");
        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setValue(tradeService.makeOrderSn(orderRqtParams));
        return resultData;
    }

    @PostMapping(path = APIPathConfConstant.ROUTER_API_ORDER_UNIFIED)
    public ResultData submitOrder(HttpServletRequest request,
                                  ResultData resultData) throws Exception {
        OrderRqtDTO orderRqtParams = factory(request, OrderRqtDTO.class);
        resultData.setMessage("ok");
        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setValue(tradeService.submitOrder(orderRqtParams));
        return resultData;
    }


    @GetMapping(path = APIPathConfConstant.ROUTER_API_CLOSE_ORDER)
    public ResultData closeOrder(OrderRqtDTO params,
                                 ResultData resultData) {
        if (tradeService.closeOrder(params)) {
            resultData.setStatus(ErrCode.SUCCESS);
            resultData.setMessage("Ok");
            return resultData;
        }
        resultData.setMessage("关闭失败");
        resultData.setStatus(ErrCode.ORDER_ERROR);
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_REFUND)
    public ResultData refund(OrderRqtDTO orderRqtParams,
                             ResultData resultData) throws ServiceException {
        tradeService.refund(orderRqtParams);
        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setMessage("退款申请已提交");
        return resultData;
    }

    @GetMapping(APIPathConfConstant.ROUTER_API_REFUND_QUERY)
    public ResultData refundQuery(OrderRqtDTO params, ResultData resultData) throws ServiceException {
        OrderRptDTO orderRptParams = tradeService.refundQuery(params);
        resultData.setValue(orderRptParams);
        resultData.setStatus(ErrCode.SUCCESS);
        resultData.setMessage("ok");
        return resultData;
    }


    @RequestMapping(APIPathConfConstant.ROUTER_TRADE_NOTIFY + "/{tradeChannel}")
    public String notify(@PathVariable("tradeChannel") int tradeChannel, HttpServletRequest request) throws Exception {
        String contentType = request.getContentType();
        if (contentType == null) {
            return "error";
        }
        Map<String, String> resultMap;
        if ("text/xml".equals(contentType)) {
            BufferedReader bufferedReader = request.getReader();
            StringBuffer stringBuffer = new StringBuffer();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuffer.append(line);
            }
            String code = stringBuffer.toString();
            if ("".equals(code)) {
                return code;
            }
            resultMap = XmlTools.xmlToMap(code);

        } else {
            resultMap = SignTools.getAllParameter(request);

        }
        return tradeService.notify(resultMap, OrderConfig.getChannel(tradeChannel));
    }

    /**
     * 获取参数
     * 通过这种方式获取参数的原因是：
     * 在校验参数时已经读取了HttpServletRequest中的流,
     * 所以在读取完成后把参数加入到了HttpServletRequest的属性中
     * (目前所知HttpServletRequest中的流只能读取一次，如果阁下知道怎么多次读取，请不吝赐教)
     *
     * @param request
     * @param cls
     * @param <T>
     * @return
     * @throws Exception
     */
    private <T> T factory(HttpServletRequest request, Class<? extends BeanRqtDTO> cls) throws Exception {
        HashMap<String, Object> hashMap = (HashMap<String, Object>) request.getAttribute("param");
        if (hashMap == null) return null;
        Object o = cls.newInstance();
        Field[] fields = cls.getDeclaredFields();
        for (Field f : fields) {
            String name = f.getName();
            StringBuffer sb = new StringBuffer();
            sb.append("set");
            sb.append(name.substring(0, 1).toUpperCase());
            sb.append(name.substring(1));
            Method method = cls.getMethod(sb.toString(), f.getType());
            Object val = hashMap.get(name);
            if (null == val) continue;
            method.invoke(o, val);
        }
        Method method = cls.getMethod("setUserBean", UserBean.class);
        UserBean userBean = (UserBean) request.getAttribute("userBean");
        method.invoke(o, userBean);
        return (T) o;
    }
}
