package com.changhong.iot.stats.model.repository;

import java.util.HashMap;

/**
 * Created by guiqijiang on 11/9/18.
 */
public interface StatisticsRepository extends BaseMongoRepository<HashMap> {

    /**
     * 执行脚本
     *
     * @param script
     * @return
     */
    Object runScript(String script);
}
