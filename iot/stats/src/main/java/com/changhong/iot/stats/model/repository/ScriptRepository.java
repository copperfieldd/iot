package com.changhong.iot.stats.model.repository;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.ScriptBase;
import com.changhong.iot.stats.web.dto.ScriptRqtDTO;

import java.util.HashMap;

/**
 * Created by guiqijiang on 11/8/18.
 */
public interface ScriptRepository extends BaseMongoRepository<ScriptBase> {

    /**
     * 高级查询
     *
     * @param dto
     * @return
     */
    PageModel<HashMap> findScript(ScriptRqtDTO dto);

    /**
     * 根据tag查询，状态不等于删除的tag只能有一个
     *
     * @param tag
     * @return
     */
    ScriptBase findByTag(String tag, String appId);
}
