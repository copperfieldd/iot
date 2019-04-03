package com.changhong.iot.stats.util;

import com.changhong.iot.stats.web.dto.ParameterDto;

import java.util.*;

import static com.changhong.iot.stats.config.ModelConstants.*;

public class TrendUtil {

    public static List<HashMap> checkTrendData(ParameterDto parameterDto, List<HashMap> data) {
        data = new ArrayList(data);
        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        Calendar.getInstance();
        start.setTime(new Date(parameterDto.getStarttime() * 1000));
        end.setTime(new Date(parameterDto.getEndtime() * 1000));
        System.out.println(StringUtil.getTime(new Date(parameterDto.getStarttime() * 1000)));
        System.out.println(StringUtil.getTime(new Date(parameterDto.getEndtime() * 1000)));

        LinkedList<HashMap> list = new LinkedList<>();
        final String group = parameterDto.getGroup();
        switch (group) {
            case YEAR:
                for (int year = start.get(Calendar.YEAR); year <= end.get(Calendar.YEAR); year++) {
                    if (data.size() > 0) {
                        HashMap map = data.get(0);
                        int num = (int) map.get(YEAR);
                        if (num == year) {
                            list.add(map);
                            data.remove(0);
                        } else {
                            HashMap item = new HashMap<>();
                            item.put(YEAR, year);
                            item.put(COUNT, 0);
                            list.add(item);
                        }
                    } else {
                        HashMap item = new HashMap<>();
                        item.put(YEAR, year);
                        item.put(COUNT, 0);
                        list.add(item);
                    }
                }
                break;
            case MONTH:
                while (start.getTime().getTime() <= end.getTime().getTime()) {
                    int year = start.get(Calendar.YEAR);
                    int month = start.get(Calendar.MONTH) + 1;
                    if (data.size() > 0) {
                        HashMap map = data.get(0);
                        if (year == (int) map.get(YEAR) && month == (int) map.get(MONTH)) {
                            list.add(map);
                            data.remove(0);
                        } else {
                            HashMap item = new HashMap<>();
                            item.put(YEAR, year);
                            item.put(MONTH, month);
                            item.put(COUNT, 0);
                            list.add(item);
                        }
                    } else {
                        HashMap item = new HashMap<>();
                        item.put(YEAR, year);
                        item.put(MONTH, month);
                        item.put(COUNT, 0);
                        list.add(item);
                    }
                    start.add(Calendar.MONTH, 1);
                }
                break;
            case DAY:
                while (start.getTime().getTime() < end.getTime().getTime()) {
                    int year = start.get(Calendar.YEAR);
                    int month = start.get(Calendar.MONTH) + 1;
                    int day = start.get(Calendar.DAY_OF_MONTH);

                    if (data.size() > 0) {
                        HashMap map = data.get(0);
                        if (year == (int) map.get(YEAR) && month == (int) map.get(MONTH) && day == (int) map.get(DAY)) {
                            list.add(map);
                            data.remove(0);
                        } else {
                            HashMap item = new HashMap<>();
                            item.put(YEAR, year);
                            item.put(MONTH, month);
                            item.put(DAY, day);
                            item.put(COUNT, 0);
                            list.add(item);
                        }
                    } else {
                        HashMap item = new HashMap<>();
                        item.put(YEAR, year);
                        item.put(MONTH, month);
                        item.put(DAY, day);
                        item.put(COUNT, 0);
                        list.add(item);
                    }
                    start.add(Calendar.DAY_OF_MONTH, 1);
                }
                break;
            default:
                break;
        }
        return list;
    }
}
