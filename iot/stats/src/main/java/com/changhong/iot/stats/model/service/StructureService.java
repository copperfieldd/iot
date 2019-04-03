package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.web.dto.DataReportRqtDTO;
import com.changhong.iot.stats.web.dto.StructureRptDTO;
import com.changhong.iot.stats.web.dto.StructureRqtDTO;

/**
 * Created by guiqijiang on 11/8/18.
 */
public interface StructureService {

    /**
     * 创建构造
     *
     * @param structureRqtDTO
     */
    StructureRptDTO addStructure(StructureRqtDTO structureRqtDTO) throws ServiceException;

    /**
     * 修改结构
     *
     * @param rqtDTO
     */
    void updateStructure(StructureRqtDTO rqtDTO) throws ServiceException;


    /**
     * 修改结构状态
     *
     * @param id        结构ID
     * @param state 状态
     */
    void updateStructureState(String id, BaseBean.State state) throws ServiceException;

    /**
     * 根据ID查找结构
     *
     * @param id
     * @return
     */
    StructureRptDTO getStructureItem(String id);

    /**
     * 高级查询结构
     *
     * @param dto
     * @return
     */
    PageModel<StructureRptDTO> getStructureList(StructureRqtDTO dto);

    /**
     * 检查数据结构
     *
     * @param reportRqtDTO
     */
    void checkedDataStructure(DataReportRqtDTO reportRqtDTO) throws ServiceException;
}
