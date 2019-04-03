package com.changhong.iot.pms.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.common.utils.SignTools;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by guiqijiang on 12/19/18.
 */
@Controller
public class TestTradeController {

    @Autowired
    RestTemplate restTemplate;

    @Value("${server.domain}")
    String host;

    //预下单
    static final String MAKE_ORDER = "/pay/makeorder";

    //提交订单
    static final String SUBMIT_ORDER = "/pay/submitorder";

    static String secret = "";

    static String appId = "";

    static String token = "";

    private static final Map<String, OrderRqtDTO> ORDERS = new HashMap<>();


    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Getter
    @Setter
    static class OrderRqtDTO {
        String subject;
        String goodsDetail;
        String detail;
        String attach;
        String totalFee;
        boolean isOK = false;
    }

    @Getter
    @Setter
    static class Trade {
        String orderSn;
        String tradeChannel;
        String form;
    }

    @RequestMapping("/test/login")
    @ResponseBody
    public String login(String userName, String password, String type) {
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        requestHeaders.set("Authorization", token);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username", userName);
        jsonObject.put("password", password);
        jsonObject.put("userType", type);
        HttpEntity<JSONObject> requestEntity = new HttpEntity<>(jsonObject, requestHeaders);
        String h = host.substring(0, host.lastIndexOf("/"));

        String response = restTemplate.postForObject(h + "/userservice/api/login", requestEntity, String.class);
        JSONObject jsonObject1 = JSONObject.parseObject(response);
        Integer i = jsonObject1.getInteger("status");
        if (0 == i) {
            JSONObject j = jsonObject1.getJSONObject("value");
            token = j.getString("token");
        }
        return response;
    }

    @GetMapping("/test/appid")
    @ResponseBody
    public String setAppId(@RequestParam("appid") String appId) {
        this.appId = appId;
        return "appID设置完成";
    }


    @GetMapping("/test/secret")
    @ResponseBody
    public String setSecret(@RequestParam("secret") String secret) {
        this.secret = secret;
        return "密匙设置完成";
    }


    @GetMapping("/test/pms")
    public String getHtml() {
        return "test/order";
    }

    @GetMapping("/test/submit")
    @ResponseBody
    public String submit(String orderSn, String tradeChannel, String form) {
        String url = this.host + SUBMIT_ORDER;
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("appId", appId);
        hashMap.put("orderSn", orderSn);
        hashMap.put("tradeChannel", tradeChannel);
        hashMap.put("form", form);
        hashMap.put("notifyUrl", host + "/test/notify");
        hashMap.put("sign", SignTools.makeSign(secret, hashMap));

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.set("Authorization", token);
        requestHeaders.setContentType(MediaType.APPLICATION_JSON_UTF8);
        HttpEntity<HashMap> requestEntity = new HttpEntity<>(hashMap, requestHeaders);

        String response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class).getBody();
        JSONObject jsonObject = JSONObject.parseObject(response);
        return jsonObject.getString("value");
    }

    @GetMapping("/test/order")
    @ResponseBody
    public String order(String subject, String goodsDetail, String detail, String attach, String totalFee) {
        OrderRqtDTO orderRqtDTO1 = new OrderRqtDTO();
        orderRqtDTO1.setSubject(subject);
        orderRqtDTO1.setGoodsDetail(goodsDetail);
        orderRqtDTO1.setDetail(detail);
        orderRqtDTO1.setAttach(attach);
        orderRqtDTO1.setTotalFee(totalFee);
        return makeOrder(orderRqtDTO1);
    }

    @RequestMapping("/test/zfzt")
    public String zfzt(String orderSn) {
        OrderRqtDTO orderRqtDTO = ORDERS.get(orderSn);
        if (orderRqtDTO != null) {
            return orderRqtDTO.isOK ? "已经支付" : "未支付";
        }
        return "ok";
    }

    @RequestMapping("/test/paystats")
    @ResponseBody
    public String ppp(String orderSn) {
        OrderRqtDTO orderRqtDTO = ORDERS.get(orderSn);
        if (null != orderRqtDTO) {
            return orderRqtDTO.isOK ? "支付成功" : "等待支付";
        }

        return "------";
    }

    @RequestMapping("/test/notify")
    @ResponseBody
    public String notify(HttpServletRequest request, @RequestBody HashMap hashMap) {
        String orderSn = (String) hashMap.get("orderSn");
        OrderRqtDTO orderRqtDTO = ORDERS.get(orderSn);
        orderRqtDTO.isOK = true;
        ORDERS.put(orderSn, orderRqtDTO);
        return "success";
    }

    private String makeOrder(OrderRqtDTO orderRqtDTO) {
        HashMap<String, String> hashMap = new HashMap<>();
        hashMap.put("appId", appId);
        hashMap.put("subject", orderRqtDTO.getSubject());
        hashMap.put("goodsDetail", orderRqtDTO.getGoodsDetail());
        hashMap.put("detail", orderRqtDTO.getDetail());
        hashMap.put("attach", orderRqtDTO.getAttach());
        hashMap.put("totalFee", orderRqtDTO.getTotalFee());
        hashMap.put("sign", SignTools.makeSign(secret, hashMap));

        String url = this.host + MAKE_ORDER;
        String response = "";
        try {
            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.setContentType(MediaType.APPLICATION_JSON);
            requestHeaders.set("Authorization", token);
            HttpEntity<HashMap> requestEntity = new HttpEntity<>(hashMap, requestHeaders);
            response = restTemplate.postForObject(url, requestEntity, String.class);
        } catch (HttpClientErrorException e) {
            return "message:" + e.getMessage();
        }
        JSONObject jsonObject = JSONObject.parseObject(response);
        String orderSn = jsonObject.getString("value");
        orderRqtDTO.isOK = false;
        this.ORDERS.put(orderSn, orderRqtDTO);
        return orderSn == null ? response : orderSn;
    }


    @Configuration
    @EnableWebSocketMessageBroker
    static class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

        @Override
        public void configureMessageBroker(MessageBrokerRegistry config) {
            config.enableSimpleBroker("/topic");
            config.setApplicationDestinationPrefixes("/msg");
        }

        @Override
        public void registerStompEndpoints(StompEndpointRegistry registry) {
            registry.addEndpoint("/my-websocket").withSockJS();
        }

    }
}
