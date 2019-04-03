package com.changhong.iot.util;

import com.changhong.iot.base.exception.ByteException;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class BaiduUtils {

    private static String KEY = "";

    @Value("${baidu.ak:hBYGCk3CFE3QGM45RrGf1yGFzDNNAlv8}")
    private String baiduAk = "";

    @PostConstruct
    public void init() {
        KEY = baiduAk;
    }

    public static String getAddress(Double lng, Double lat) {
        String res;
        String address = "";
        try {
            String url = "http://api.map.baidu.com/geocoder/v2/?location=" + lat + "," + lng + "&output=json&ak=" + KEY;
            URL resjson = new URL(url);

            BufferedReader in = new BufferedReader(new InputStreamReader(
                    resjson.openStream(), "utf-8"));
            StringBuilder sb = new StringBuilder("");
            while ((res = in.readLine()) != null) {
                sb.append(res.trim());
            }
            in.close();
            String str = sb.toString();
            JSONObject jsonObj = JSONObject.parseObject(str);

            if (jsonObj.getInteger("status") != 0) {
                throw new ByteException(1001, jsonObj.getString("msg"));
            }

            JSONObject jsonObject = jsonObj.getJSONObject("result").getJSONObject("addressComponent");

            address += jsonObject.getString("country");
            address += jsonObject.getString("province");
            address += jsonObject.getString("city");
            address += jsonObject.getString("district");

            sb = new StringBuilder();
            sb.append(jsonObject.getString("town"));
            sb.append(jsonObject.getString("street"));
            sb.append(jsonObject.getString("street_number"));
            address += sb.toString();

            return address;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (ByteException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Map<String, Double> getLocation(String address) throws ByteException {

        String res;
        try {
            String url = "http://api.map.baidu.com/geocoder/v2/?address=" + address + "&output=json&ak=" + KEY;
            URL resjson = new URL(url);

            BufferedReader in = new BufferedReader(new InputStreamReader(
                    resjson.openStream(), "utf-8"));
            StringBuilder sb = new StringBuilder("");
            while ((res = in.readLine()) != null) {
                sb.append(res.trim());
            }
            in.close();
            String str = sb.toString();
            JSONObject jsonObj = JSONObject.parseObject(str);

            if (jsonObj.getInteger("status") != 0) {
                throw new ByteException(1001, jsonObj.getString("msg"));
            }

            JSONObject jsonObject = jsonObj.getJSONObject("result").getJSONObject("location");

            Map<String, Double> map = new HashMap<>();

            map.put("lng", jsonObject.getDouble("lng"));
            map.put("lat", jsonObject.getDouble("lat"));

            return map;

        } catch (IOException e) {
                e.printStackTrace();
        }
        return null;
    }

    public static Map<String, Object> ipDecode(String ip) throws ByteException {

        String res;
        try {
            String url = "http://api.map.baidu.com/location/ip?ip=" + ip + "&ak=" + KEY;
            URL resjson = new URL(url);

            BufferedReader in = new BufferedReader(new InputStreamReader(
                    resjson.openStream(), "utf-8"));
            StringBuilder sb = new StringBuilder("");
            while ((res = in.readLine()) != null) {
                sb.append(res.trim());
            }
            in.close();
            String str = sb.toString();
            JSONObject jsonObj = JSONObject.parseObject(str);

            if (jsonObj.getInteger("status") != 0) {
                throw new ByteException(1001, jsonObj.getString("message"));
            }

            JSONObject content = jsonObj.getJSONObject("content");
            JSONObject address_detail = content.getJSONObject("address_detail");
            JSONObject point = content.getJSONObject("point");

            Map<String, Object> map = new HashMap<>();

            map.put("province", address_detail.getString("province"));
            map.put("city", address_detail.getString("city"));
            map.put("x", point.getString("x"));
            map.put("y", point.getString("y"));

            return map;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
