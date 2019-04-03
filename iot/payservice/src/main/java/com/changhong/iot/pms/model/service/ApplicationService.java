package com.changhong.iot.pms.model.service;

import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import com.changhong.iot.pms.model.bean.UserBean;
import com.changhong.iot.pms.web.dto.ApplicationRpsDTO;
import com.changhong.iot.pms.web.dto.ApplicationRqtDTO;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午11:42 18-1-25
 */
public interface ApplicationService {
    /**
     * 根据AppID 查找对应的key
     *
     * @param appId
     * @return key 返回 null 时未找到
     */
    String getKeyByAppId(String appId);

    /**
     * 根据APPID 获取商户
     *
     * @param appId
     * @return
     */
    ApplicationRpsDTO getApplicationByAppId(String appId);


    /**
     * 高级查询
     *
     * @return
     */
    PageModel<ApplicationRpsDTO> getApplications(ApplicationRqtDTO request);


    /**
     * 插入应用
     *
     * @param params
     */
    ApplicationBean insert(ApplicationRqtDTO params) throws ServiceException;


    /**
     * 保存应用
     *
     * @param params
     */
    void save(ApplicationRqtDTO params) throws ServiceException;


    /**
     * 删除应用
     *
     * @param appId
     */
    void updateStatus(int status, String appId) throws ServiceException;


    /**
     * 获取应用列表
     *
     * @param start
     * @param count
     * @param userBean 用户
     * @return
     */
    ApplicationRpsDTO getApplications(int start, int count, UserBean userBean);

}
