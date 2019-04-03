package com.changhong.iot;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.changhong.iot.common.response.ResultData;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.stats.web.controller.APIPathConfConstant;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.nio.charset.Charset;
import java.util.*;

@SpringBootTest
public class IotStatisticsApplicationTests {


    //启动类型 0：打包模式，1：使用本机接口，2：使用公司内部服务器接口
    final static Integer START_TYPE = 0;

    //服务地址
    final String HOST;

    {
        if (START_TIME == 1) {
            HOST = "http://127.0.0.1:8029/";
        } else {
            HOST = "http://192.168.3.8:8029/";
        }
    }

    //用户令牌
    final static String TOKEN = "bcbc4a3549ed4c43bcf1deef453f6f37";

    //数据初始化时间 开始时间
    final static Long START_TIME = DateUtil.strToDateLong("2017/1/1 00:00:00").getTime() / 1000;

    //模拟几天的数据,单位：天
    final static int END_TIME = 1000;

    //租户列表
    final List<String> tenants = new ArrayList<>();

    //应用列表 基于第一个租户
    final List<String> apps = new ArrayList<>();

    //接口
    final List<Map> interfaces = new ArrayList<>();

    final RestTemplate restTemplate;

    final List<Map<String, Map>> servce = new ArrayList<>();

    @Bean
    RestTemplate restTemplate() {

        RestTemplate restTemplate = new RestTemplate();

        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);

        converter.setSupportedMediaTypes(supportedMediaTypes);
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);

        restTemplate.getMessageConverters()
                .add(0, new StringHttpMessageConverter(Charset.forName("UTF-8")));
        return restTemplate;
    }

    {
        restTemplate = restTemplate();
    }

    {
        try {

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Authorization", this.TOKEN);
            HttpEntity requestEntity = new HttpEntity(null, httpHeaders);
            ResultData resultData = restTemplate.exchange("http://192.168.3.8:8020/userservice/api/tenant/list?start=0&count=10", HttpMethod.GET, requestEntity, ResultData.class).getBody();
            Object obj = resultData.getValue();
            Map map = (Map) obj;
            List<Map> list = (List<Map>) map.get("list");
            for (Map m : list) {
                this.tenants.add((String) m.get("id"));
            }

            resultData = restTemplate.exchange("http://192.168.3.8:8020/userservice/api/app/opt?tenantId=" + this.tenants.get(0), HttpMethod.GET, requestEntity, ResultData.class).getBody();
            list = (List<Map>) resultData.getValue();
            for (Map m : list) {
                this.apps.add((String) m.get("id"));
            }

            resultData = restTemplate.exchange("http://192.168.3.8:8020/permissionservice/api/interface/listByTenant?id=87ff24d8-c037-4a56-942a-ee5c28ccfe7a", HttpMethod.GET, requestEntity, ResultData.class).getBody();
            List<Map> l = (List) resultData.getValue();
            for (Map m : l) {
                interfaces.add(m);
            }
        }catch (Exception e){}
    }

    public <T> T getData(String fileName, Class<T> cls) {
        try {
            return JSONObject.parseObject(IOUtils.toByteArray(this.getClass().getResourceAsStream(fileName)), cls);
        } catch (IOException e) {
            return null;
        }
    }

    public ResultData post(String url, Object object) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", this.TOKEN);
        HttpEntity requestEntity = new HttpEntity(object, httpHeaders);
        return restTemplate.exchange(url, HttpMethod.POST, requestEntity, ResultData.class).getBody();
    }


    @Test
    public void initData() throws Exception {
        if (START_TYPE == 0) return;
        JSONArray jsonArray = getData("/service.json", JSONArray.class);
        for (Object object : jsonArray) {
            JSONObject jsonObject = (JSONObject) object;
            //创建服务
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_APPLICATION_ADD, object);
            String serviceId = (String) ((Map) resultData.getValue()).get("id");
            servce.add(new HashMap() {{
                put(jsonObject.getString("domain"), resultData.getValue());
            }});
            //创建结构
            JSONObject structure = jsonObject.getJSONObject("structure");

            String domain = jsonObject.getString("domain");
            structure.put("serviceId", serviceId);
            post(HOST + APIPathConfConstant.ROUTER_API_DATA_STRUCTURE_ADD, structure);
            //创建脚本

            JSONArray script = jsonObject.getJSONArray("script");
            if (null == script) continue;
            for (Object o : script) {
                JSONObject obj = (JSONObject) o;
                obj.put("serviceId", serviceId);
                ResultData s = restTemplate.postForEntity(HOST + APIPathConfConstant.ROUTER_API_ANALYTIC_SCRIPT_ADD, obj, ResultData.class).getBody();
                int status = s.getStatus();
                if (status != 0) {
                    throw new Exception("message:" + s.getMessage());
                }

            }
        }

        if (HOST.indexOf("3.8") != -1) return;

        addUserData();
        addPermissionData();
        addDeviceData();
        addPayData();
        addWaringData();
        addPosition();
    }


    //添加用户测试数据
    public void addUserData() {
        int tenantSum = 0;
        HashMap<String, Integer> cache = new HashMap<>();
        Long time = this.START_TIME;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();
            int newTenantSum = new Double(Math.random() * (1 - 10) + 10).intValue();
            body.put("newTenantSum", newTenantSum);
            body.put("tenantSum", tenantSum += newTenantSum);
            JSONArray tenantAppSum = new JSONArray();
            for (int j = 0; j < 5; j++) {
                JSONObject appSumItem = new JSONObject();
                String tenantId = tenants.get(j);
                String cacheName = tenantId + "appsum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                appSumItem.put("tenantId", tenantId);
                int newAppSum = new Double(Math.random() * (1 - 10) + 10).intValue();
                appSumItem.put("newAppSum", newAppSum);
                appSumItem.put("appSum", sum += newAppSum);
                cache.put(cacheName, sum);
                tenantAppSum.add(appSumItem);
            }
            body.put("tenantAppSum", tenantAppSum);
            JSONArray clientUserSum = new JSONArray();
            for (int j = 0; j < this.apps.size(); j++) {
                JSONObject clientSumItem = new JSONObject();
                String tenantId = tenants.get(j);
                String appId = this.apps.get(j);
                String cacheName = tenantId + appId + "clientsum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                clientSumItem.put("tenantId", tenantId);
                clientSumItem.put("appId", appId);
                int newClientSum = new Double(Math.random() * (1 - 10) + 10).intValue();
                clientSumItem.put("newClientSum", newClientSum);
                clientSumItem.put("clientSum", sum += newClientSum);
                cache.put(cacheName, sum);
                clientUserSum.add(clientSumItem);
            }
            body.put("clientUserSum", clientUserSum);
            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "user");
            data.put("collection", "user");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }
    }

    //添加权限数据
    public void addPermissionData() {
        Long time = this.START_TIME;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();
            body.put("interfaceSum", i);
            List useSum = new ArrayList();
            for (int j = 0; j < 4; j++) {
                JSONObject item = new JSONObject();
                item.put("tenantId", this.tenants.get(j));
                item.put("appId", this.apps.get(j));
                List _interface = new ArrayList<>();
                for (Map m : this.interfaces) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("name", m.get("name"));
                    jsonObject.put("url", m.get("dataUrl"));
                    jsonObject.put("id", m.get("id"));
                    jsonObject.put("sum", new Double(Math.random() * -10 + 10).intValue());
                    _interface.add(jsonObject);
                }
                item.put("interface", _interface);
                useSum.add(item);
            }
            body.put("useSum", useSum);
            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "permission");
            data.put("collection", "permission");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }

    }

    //添加设备数据
    public void addDeviceData() {
        HashMap<String, Integer> cache = new HashMap<>();
        Long time = this.START_TIME;
        int tenantSum = 0;
        int deviceTypeSum = 0;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();
            int newTenantSum = new Double(Math.random() * -10 + 10).intValue();
            body.put("newTenantSum", newTenantSum);
            body.put("tenantSum", tenantSum += newTenantSum);

            int dsum = new Double(Math.random() * -10 + 10).intValue();
            body.put("newDeviceTypeSum", dsum);
            body.put("deviceTypeSum", deviceTypeSum += dsum);

            List tenantAppSum = new ArrayList();
            for (int j = 0; j < 5; j++) {
                String tenantId = tenants.get(j);
                String cacheName = tenantId + "appsum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                JSONObject item = new JSONObject();
                item.put("tenantId", this.tenants.get(j));
                Integer newAppSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newAppSum", newAppSum);
                item.put("appSum", sum += newAppSum);
                cache.put(cacheName, sum);
                tenantAppSum.add(item);
            }
            body.put("tenantAppSum", tenantAppSum);

            List deviceType = new ArrayList();
            for (int j = 0; j < 10; j++) {
                JSONObject item = new JSONObject();
                String typeId = "userType" + j;
                String cacheName = typeId + "clientSum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                item.put("typeId", typeId);
                int newDeviceSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newDeviceSum", newDeviceSum);
                item.put("deviceSum", sum += newDeviceSum);
                cache.put(cacheName, sum);
                deviceType.add(item);
            }
            body.put("deviceType", deviceType);

            List appDevice = new ArrayList();
            for (int j = 0; j < this.apps.size(); j++) {
                JSONObject item = new JSONObject();
                String tenantId = tenants.get(j);
                item.put("tenantId", tenantId);
                item.put("appId", this.apps.get(j));
                String cacheName = "appsum" + tenantId;
                Integer sum = cache.getOrDefault(cacheName, 0);
                int newDeviceSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newDeviceSum", newDeviceSum);
                item.put("deviceSum", sum += newDeviceSum);
                cache.put(cacheName, sum);
                appDevice.add(item);
            }
            body.put("appDevice", appDevice);
            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "device");
            data.put("collection", "device");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }
    }

    //添加支付数据
    public void addPayData() {
        HashMap<String, Integer> cache = new HashMap<>();
        Long time = this.START_TIME;
        int tenantSum = 0;
        int orderSum = 0;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();
            int newTenantSum = new Double(Math.random() * -10 + 10).intValue();
            body.put("newTenantSum", newTenantSum);
            body.put("tenantSum", tenantSum += newTenantSum);

            int dsum = new Double(Math.random() * -10 + 10).intValue();
            body.put("newOrderSum", dsum);
            body.put("orderSum", orderSum += dsum);

            List tenantAppSum = new ArrayList();
            for (int j = 0; j < 5; j++) {
                String tenantId = tenants.get(j);
                String cacheName = tenantId + "appsum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                JSONObject item = new JSONObject();
                item.put("tenantId", this.tenants.get(j));
                Integer newAppSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newAppSum", newAppSum);
                item.put("appSum", sum += newAppSum);
                cache.put(cacheName, sum);
                tenantAppSum.add(item);
            }
            body.put("tenantAppSum", tenantAppSum);

            List appOrderSum = new ArrayList();
            for (int j = 0; j < this.apps.size(); j++) {
                JSONObject item = new JSONObject();
                String tenantId = tenants.get(j);
                item.put("tenantId", tenantId);
                item.put("appId", this.apps.get(j));
                String cacheName = "appsum" + tenantId;
                Integer sum = cache.getOrDefault(cacheName, 0);
                int newOrderSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newOrderSum", newOrderSum);
                item.put("orderSum", sum += newOrderSum);
                cache.put(cacheName, sum);
                appOrderSum.add(item);
            }
            body.put("appOrderSum", appOrderSum);

            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "pay");
            data.put("collection", "pay");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }
    }

    //添加告警数据
    public void addWaringData() {
        HashMap<String, Integer> cache = new HashMap<>();
        Long time = this.START_TIME;
        int warningSum = 0;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();

            List warningSMS = new ArrayList();
            for (int j = 0; j < this.apps.size(); j++) {
                JSONObject item = new JSONObject();
                String tenantId = tenants.get(j);
                item.put("serviceName", tenantId);
                String cacheName = "aaa" + tenantId;
                Integer sum = cache.getOrDefault(cacheName, 0);
                int newSum = new Double(Math.random() * -10 + 20).intValue();
                item.put("newSum", newSum);
                item.put("sum", sum += newSum);
                warningSum += newSum;
                cache.put(cacheName, sum);
                warningSMS.add(item);
            }
            body.put("warningSMS", warningSMS);

            List warningEmail = new ArrayList();
            for (int j = 0; j < this.apps.size(); j++) {
                JSONObject item = new JSONObject();
                String tenantId = tenants.get(j);
                item.put("serviceName", tenantId);
                String cacheName = "bbb" + tenantId;
                Integer sum = cache.getOrDefault(cacheName, 0);
                int newSum = new Double(Math.random() * -10 + 10).intValue();
                item.put("newSum", newSum);
                item.put("sum", sum += newSum);
                cache.put(cacheName, sum);
                warningSum += newSum;
                warningEmail.add(item);
            }
            body.put("warningSum", warningSum);

            body.put("warningEmail", warningEmail);

            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "alarm");
            data.put("collection", "alarm");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }
    }

    //添加告警数据
    public void addPosition() {
        HashMap<String, Integer> cache = new HashMap<>();
        Long time = this.START_TIME;
        int tenantSum = 0;
        for (int i = 0; i < END_TIME; i++) {
            time = DateUtil.arithmetic(time, 0, 0, 1, '+');
            JSONObject body = new JSONObject();
            int newTenantSum = new Double(Math.random() * (1 - 10) + 10).intValue();
            body.put("newTenantSum", newTenantSum);
            body.put("tenantSum", tenantSum += newTenantSum);
            JSONArray tenantAppSum = new JSONArray();
            for (int j = 0; j < 5; j++) {
                JSONObject appSumItem = new JSONObject();
                String tenantId = tenants.get(j);
                String cacheName = tenantId + "appsum";
                Integer sum = cache.getOrDefault(cacheName, 0);
                appSumItem.put("tenantId", tenantId);
                int newAppSum = new Double(Math.random() * (1 - 10) + 10).intValue();
                appSumItem.put("newAppSum", newAppSum);
                appSumItem.put("appSum", sum += newAppSum);
                cache.put(cacheName, sum);
                tenantAppSum.add(appSumItem);
            }
            body.put("tenantAppSum", tenantAppSum);

            JSONObject data = new JSONObject();
            data.put("data", body);
            data.put("reportTime", time);
            data.put("domain", "position");
            data.put("collection", "position");
            ResultData resultData = post(HOST + APIPathConfConstant.ROUTER_API_DATA_REPORT, data);
            System.out.println(JSONObject.toJSONString(resultData));
        }
    }


    @Test
    public void 无用() {
    }
}
