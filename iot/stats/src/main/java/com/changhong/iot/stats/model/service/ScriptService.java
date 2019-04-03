package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.web.dto.ScriptRptDTO;
import com.changhong.iot.stats.web.dto.ScriptRqtDTO;

/**
 * Created by guiqijiang on 11/8/18.
 */
public interface ScriptService {

    /**
     * 添加脚本
     *
     * @param dto
     * @return
     */
    ScriptRptDTO add(ScriptRqtDTO dto) throws ServiceException;

    /**
     * 修改脚本
     *
     * @param dto
     * @return
     */
    void update(ScriptRqtDTO dto) throws ServiceException;

    /**
     * 修改脚本状态
     *
     * @param id
     * @param state
     */
    void updateState(String id, BaseBean.State state) throws ServiceException;

    /**
     * 查询脚本
     *
     * @param id
     * @return
     */
    ScriptRptDTO getItem(String id);

    /**
     * 高级查询
     *
     * @param dto
     * @return
     */
    PageModel<ScriptRptDTO> getScriptList(ScriptRqtDTO dto);
}
