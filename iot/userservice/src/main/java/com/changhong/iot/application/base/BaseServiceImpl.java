package com.changhong.iot.application.base;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.io.Serializable;

/**
 * 创建人：@author wangkn@bjbths.com
 */
public abstract class BaseServiceImpl<T> implements BaseService<T> {

    public abstract MongoRepository<T, Serializable> getRepository();

    @Override
    public T find(Serializable id) {
        return getRepository().findOne(id);
    }

    @Override
    public void update(T entity) {
        getRepository().save(entity);
    }

    @Override
    public void delete(Serializable id) {
        getRepository().delete(id);
    }

    @Override
    public void add(T entity) {
        getRepository().save(entity);
    }

    /*public com.changhong.iot.base.dto.Page page(int start, int count, Map<String, Sort.Direction> sortMap, String[] keys, Object[] vals) {

        PageRequest pageRequest = new PageRequest((start/count)+1, count, getSort(sortMap));


        if (keys != null && keys.length > 0) {

            ExampleMatcher matcher = ExampleMatcher.matching()
                    .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING) //改变默认字符串匹配方式：模糊查询
                    .withIgnoreCase(true); //改变默认大小写忽略方式：忽略大小写

            for (int i = 0; i < keys.length; i++) {
                matcher.withMatcher(keys[i], ExampleMatcher.GenericPropertyMatchers.contains()); //采用“包含匹配”的方式查询

            }

            Example<T> example = Example.of(t, matcher);
            Page<T> all = getRepository().findAll(example, pageRequest);
        }




        return null;
    }


    private Sort getSort(Map<String, Sort.Direction> sortMap) {
        Sort sort = null;
        if (sortMap != null) {
            List<Sort.Order> orders = new ArrayList<>();
            Set<String> keySet = sortMap.keySet();
            for (String key : keySet) {
                orders.add(new Sort.Order(sortMap.get(key), key));
            }
            if (orders.size() > 0) {
                sort = new Sort(orders);
            }
        }
        return sort;
    }*/

}
