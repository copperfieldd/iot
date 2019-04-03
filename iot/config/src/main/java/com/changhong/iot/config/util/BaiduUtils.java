package com.changhong.iot.config.util;

import com.changhong.iot.config.base.exception.ByteException;
import net.sf.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class BaiduUtils {

    private static final String KEY = "hBYGCk3CFE3QGM45RrGf1yGFzDNNAlv8";

    public static String getAddress(Double lng, Double lat) throws ByteException {
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
            JSONObject jsonObj = JSONObject.fromObject(str);

            if (jsonObj.getInt("status") != 0) {
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
        } catch (UnsupportedEncodingException e) {
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
            JSONObject jsonObj = JSONObject.fromObject(str);

            if (jsonObj.getInt("status") != 0) {
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
            JSONObject jsonObj = JSONObject.fromObject(str);

            if (jsonObj.getInt("status") != 0) {
                throw new ByteException(1001, jsonObj.getString("msg"));
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
