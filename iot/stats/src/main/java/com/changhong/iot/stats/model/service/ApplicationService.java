package com.changhong.iot.stats.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.web.dto.ApplicationRptDTO;
import com.changhong.iot.stats.web.dto.ApplicationRqtDTO;

/**
 * Created by guiqijiang on 11/7/18.
 */
public interface ApplicationService {

    /**
     * 验证请求是否合法
     *
     * @param accessKey   账号
     * @param serviceCode 密码
     * @return
     */
    boolean checked(String accessKey, String serviceCode);

    /**
     * 新增一条应用
     *
     * @param dto
     */
    ApplicationRptDTO add(ApplicationRqtDTO dto) throws ServiceException;

    /**
     * 修改应用
     *
     * @param dto
     */
    void update(ApplicationRqtDTO dto) throws ServiceException;

    /**
     * 修改状态
     *
     * @param id
     * @param state
     */
    void updateState(String id, BaseBean.State state) throws ServiceException;

    /**
     * 获取应用
     *
     * @param dto
     * @return
     */
    ApplicationRptDTO getAppItem(ApplicationRqtDTO dto);


    /**
     * 获取应用列表
     *
     * @param dto
     * @return
     */
    PageModel<ApplicationRptDTO> getAppList(ApplicationRqtDTO dto);
}
