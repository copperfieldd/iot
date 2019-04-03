package com.changhong.iot.pms.model.service.impl;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午2:21 18-1-18
 */
@Service
public class CacheImpl {

    @Cacheable(value = "CommonCacheManager", key = "'token.touserid'+#token", cacheManager = "CommonCacheManager")
    public Integer getUserIdByToken(String token) {
        return 0;
    }
}
