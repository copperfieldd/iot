package com.changhong.iot.stats.model.repository;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.web.dto.ApplicationRqtDTO;

/**
 * Created by guiqijiang on 11/7/18.
 */
public interface ApplicationRepository extends BaseMongoRepository<ApplicationBase> {

    /**
     * 根据ID查找应用信息
     *
     * @param appId
     * @return
     */
    ApplicationBase findAppByAppId(String appId);

    /**
     * 获取应用列表
     *
     * @param base
     * @return
     */
    PageModel<ApplicationBase> findApps(ApplicationRqtDTO base);

    /**
     * 根据domain获取应用
     *
     * @param domain
     * @return
     */
    ApplicationBase findAppByDomain(String domain);
}
