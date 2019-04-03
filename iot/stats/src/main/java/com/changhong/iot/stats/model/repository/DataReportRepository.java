package com.changhong.iot.stats.model.repository;

import java.util.Map;

/**
 * Created by guiqijiang on 11/12/18.
 */
public interface DataReportRepository {

    /**
     * 保存上报的数据
     *
     * @param collectionId
     * @param map
     */
    void insert(String collectionId, Map map);

}
