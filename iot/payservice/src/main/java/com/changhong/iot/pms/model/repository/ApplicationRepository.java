package com.changhong.iot.pms.model.repository;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.pms.model.bean.ApplicationBean;
import com.changhong.iot.pms.web.dto.ApplicationRqtDTO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 上午10:10 18-1-18
 */

public interface ApplicationRepository extends BaseMongoRepository<ApplicationBean> {

    /**
     * 根据APPID获取商户
     *
     * @param appId
     * @return
     */
    ApplicationBean findByAppId(String appId);

    /**
     * 高级查找
     *
     * @param reqDTO
     * @return
     */
    PageModel<ApplicationBean> findsByDTO(ApplicationRqtDTO reqDTO);

}
