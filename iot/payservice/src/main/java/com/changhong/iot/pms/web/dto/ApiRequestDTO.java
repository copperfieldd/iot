package com.changhong.iot.pms.web.dto;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

public class ApiRequestDTO {

    private HashMap<String, String> mParams;

    public ApiRequestDTO() {
        mParams = new HashMap<>();
    }

    public ApiRequestDTO(Map map) {
        HashMap hashMap = new HashMap();
        hashMap.putAll(map);
        mParams = hashMap;
    }


    public void add(String key, String value) {
        mParams.put(key, value);
    }

    public boolean containsKey(String key) {
        return mParams.containsKey(key);
    }

    public HashMap<String, String> getParams() {
        return mParams;
    }

    public void setmParams(HashMap mParams) {
        this.mParams = mParams;
    }

    public String toParamsString() {
        StringBuilder string = new StringBuilder("?");
        List<Map.Entry<String, String>> params = new ArrayList<>(mParams.entrySet());
        params.sort(Comparator.comparing(Map.Entry::getKey));
        String var;
        for (Map.Entry<String, String> entry : params) {
            try {
                var = URLEncoder.encode(String.valueOf(entry.getValue()), "utf8");
            } catch (UnsupportedEncodingException e) {
                var = entry.getValue();
            }
            string.append(entry.getKey()).append("=").append(var).append("&");
        }
        return string.substring(0, string.length() - 1);
    }

    @Override
    public String toString() {
        StringBuilder string = new StringBuilder("?");
        List<Map.Entry<String, String>> params = new ArrayList<>(mParams.entrySet());
        params.sort(Comparator.comparing(Map.Entry::getKey));
        for (Map.Entry<String, String> entry : params) {
            string.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        return string.substring(0, string.length() - 1);
    }
}
