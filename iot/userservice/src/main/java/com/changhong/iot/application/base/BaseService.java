package com.changhong.iot.application.base;

import java.io.Serializable;

/**
 * 创建人：@author wangkn@bjbths.com
 */
public interface BaseService<T> {

    T find(Serializable id);

    void update(T entity);

    void delete(Serializable id);

    void add(T entity);

}
