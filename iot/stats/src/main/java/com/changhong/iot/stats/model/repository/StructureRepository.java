package com.changhong.iot.stats.model.repository;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.StructureBase;
import com.changhong.iot.stats.web.dto.StructureRqtDTO;

import java.util.HashMap;

/**
 * Created by guiqijiang on 11/7/18.
 */
public interface StructureRepository extends BaseMongoRepository<StructureBase> {

    /**
     * 高级查询
     *
     * @param dto
     * @return
     */
    PageModel<HashMap> pageAll(StructureRqtDTO dto);

    /**
     * 统计appId
     *
     * @param appId
     * @return
     */
    long findByAppIdCount(String appId);

    /**
     * 根据结构ID获取结构列表
     * @param collectionId
     * @return
     */
    StructureBase findByCollectionId(String collectionId);
}
