package com.changhong.iot.pms.model.repository.impl;

import com.changhong.iot.common.response.PageModel;
import com.changhong.iot.common.utils.EmptyUtil;
import com.changhong.iot.pms.model.repository.BaseMongoRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.util.*;
import java.util.regex.Pattern;

/**
 * 基本操作接口MongoDB数据库实现类
 * <p>
 * ClassName: BaseMongoRepositoryImpl
 * </p>
 * <p>
 * Description:本实现类适用于MongoDB数据库
 * </p>
 *
 * @author don
 * @date 2018年3月12日
 */
public abstract class BaseMongoRepositoryImpl<T> implements BaseMongoRepository<T> {

    public Class<T> getEntityClass() {
        ParameterizedType ptClass = (ParameterizedType) this.getClass().getGenericSuperclass();
        Class clazz = (Class) ptClass.getActualTypeArguments()[0];
        return clazz;
    }

    @Autowired
    protected MongoTemplate mgt;

    @Override
    public void save(T entity) {
        mgt.save(entity);
    }

    @Override
    public void update(T entity) {

        // 反向解析对象
        Map<String, Object> map = null;
        try {
            map = parseEntity(entity);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // ID字段
        String idName = null;
        Object idValue = null;

        // 生成参数
        Update update = new Update();
        if (EmptyUtil.isNotEmpty(map)) {
            Set<Map.Entry<String, Object>> entries = map.entrySet();
            for (Map.Entry<String, Object> e : entries) {
                String key = e.getKey();
                if (key.indexOf("{") != -1) {
                    // 设置ID
                    idName = key.substring(key.indexOf("{") + 1, key.indexOf("}"));
                    idValue = e.getValue();
                } else {
                    update.set(key, e.getValue());
                }
            }
        }

        mgt.updateFirst(new Query().addCriteria(Criteria.where(idName).is(idValue)), update, getEntityClass());
    }

    @Override
    public void delete(Serializable... ids) {
        if (EmptyUtil.isNotEmpty(ids)) {
            for (Serializable id : ids) {
                mgt.remove(mgt.findById(id, getEntityClass()));
            }
        }

    }

    @Override
    public void delFake(Serializable... ids) {
        if (EmptyUtil.isNotEmpty(ids)) {
            for (Serializable id : ids) {
                mgt.updateMulti(Query.query(Criteria.where("_id").is(id)),
                        Update.update("i_delete", 1), getEntityClass());
            }
        }

    }


    @Override
    public T find(Serializable id) {
        return mgt.findById(id, getEntityClass());
    }

    @Override
    public List<T> findAll() {
        return mgt.findAll(getEntityClass());
    }

    @Override
    public List<T> findAll(String order) {
        List<Order> orderList = parseOrder(order);
        if (EmptyUtil.isEmpty(orderList)) {
            return findAll();
        }
        return mgt.find(new Query().with(new Sort(orderList)), getEntityClass());
    }

    @Override
    public List<T> findLikeProp(String propName, Object propValue) {
        return findLikeProp(propName, propValue, null);
    }

    @Override
    public List<T> findByProp(String propName, Object propValue) {
        return findByProp(propName, propValue, null);
    }

    @Override
    public List<T> findLikeProp(String propName, Object propValue, String order) {
        return findLikeProps(new String[]{propName}, new Object[]{propValue}, order);
    }

    @Override
    public List<T> findByProp(String propName, Object propValue, String order) {
        Query query = new Query();
        // 参数
        query.addCriteria(Criteria.where(propName).is(propValue));
        // 排序
        List<Order> orderList = parseOrder(order);
        if (EmptyUtil.isNotEmpty(orderList)) {
            query.with(new Sort(orderList));
        }
        return mgt.find(query, getEntityClass());
    }

    @Override
    public List<T> findLikeProps(String[] propName, Object[] propValue) {
        return findLikeProps(propName, propValue, null);
    }

    @Override
    public List<T> findByProps(String[] propName, Object[] propValue) {
        return findByProps(propName, propValue, null);
    }

    @Override
    public List<T> findLikeProps(String[] propName, Object[] propValue, String order) {
        Query query = createLikeQuery(propName, propValue, order);
        return mgt.find(query, getEntityClass());
    }

    @Override
    public List<T> findByProps(String[] propName, Object[] propValue, String order) {
        Query query = createQuery(propName, propValue, order);
        return mgt.find(query, getEntityClass());
    }

    @Override
    public T uniqueByProp(String propName, Object propValue) {
        return mgt.findOne(new Query(Criteria.where(propName).is(propValue)), getEntityClass());
    }

    @Override
    public T uniqueByProps(String[] propName, Object[] propValue) {
        Query query = createQuery(propName, propValue, null);
        return mgt.findOne(query, getEntityClass());
    }

    @Override
    public PageModel<T> pageAll(Query query) {
        PageModel<T> pageModel = new PageModel<>();
        pageModel.setTotalCount(mgt.count(query, getEntityClass()));
        pageModel.setList(mgt.find(query, getEntityClass()));
        return pageModel;
    }

    @Override
    public PageModel<T> pageAll(int start, int count) {
        return pageAll(start, count, null);
    }

    @Override
    public PageModel<T> pageAll(int start, int count, String order) {
        return pageByProp(start, count, null, null, order);
    }

    @Override
    public PageModel<T> pageByProp(int start, int count, String param, Object value) {
        return pageByProp(start, count, param, value, null);
    }

    @Override
    public PageModel<T> pageByProp(int start, int count, String param, Object value, String order) {
        String[] params = null;
        Object[] values = null;
        if (EmptyUtil.isNotEmpty(param)) {
            params = new String[]{param};
            values = new Object[]{value};
        }
        return pageByProps(start, count, params, values, order);
    }

    @Override
    public PageModel<T> pageByProps(int start, int count, String[] params, Object[] values) {
        return pageByProps(start, count, params, values, null);
    }

    @Override
    public PageModel<T> pageByProps(int start, int count, String[] params, Object[] values, String order) {
        // 创建分页模型对象
        PageModel<T> page = new PageModel<>();
        // 查询总记录数
        page.setTotalCount(countByCondition(params, values));
        // 查询数据列表
        Query query = createQuery(params, values, order);
        // 封装结果数据
        page.setList(mgt.find(query, getEntityClass()));

        return page;
    }

    @Override
    public int countByCondition(String[] params, Object[] values) {
        Query query = createQuery(params, values, null);
        Long count = mgt.count(query, getEntityClass());
        return count.intValue();
    }

    @Override
    public PageModel<T> pageLikeProp(int start, int count, String param, String value) {
        return pageLikeProp(start, count, param, value, null);
    }

    @Override
    public PageModel<T> pageLikeProp(int start, int count, String param, String value, String order) {
        String[] params = null;
        String[] values = null;
        if (EmptyUtil.isNotEmpty(param)) {
            params = new String[]{param};
            values = new String[]{value};
        }
        return pageLikeProps(start, count, params, values, order);
    }

    @Override
    public PageModel<T> pageLikeProps(int start, int count, String[] params, String[] values) {
        return pageLikeProps(start, count, params, values, null);
    }

    @Override
    public PageModel<T> pageLikeProps(int start, int count, String[] params, String[] values, String order) {

        // 创建分页模型对象
        PageModel<T> page = new PageModel<>();

        // 查询总记录数
        page.setTotalCount(countLikeCondition(params, values));

        // 查询数据列表
        Query query = createLikeQuery(params, values, order);

        // 封装结果数据
        page.setList(mgt.find(query, getEntityClass()));

        return page;
    }


    @Override
    public PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, int start, int count) {
        return this.aggregate(aggregationOperations, getEntityClass(), start, count);
    }

    @Override
    public PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, int start, int count, boolean globalCount) {
        return this.aggregate(aggregationOperations, getEntityClass(), start, count, globalCount);
    }

    public PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, Class<?> cls, int start, int count) {
        return this.aggregate(aggregationOperations, cls, start, count, false);
    }

    @Override
    public PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, Class<?> cls, int start, int count, boolean globalCount) {
        Document document = cls.getAnnotation(Document.class);
        PageModel<HashMap> pageModel = new PageModel();
        //分页
        if (0 <= start && 0 < count) {
            GroupOperation groupOperation = Aggregation.group().count().as("count");
            aggregationOperations.add(groupOperation);
            Aggregation aggregation = Aggregation.newAggregation(cls, aggregationOperations);
            AggregationResults<HashMap> aggregate = mgt.aggregate(aggregation, document.collection(), HashMap.class);
            HashMap h = aggregate.getUniqueMappedResult();
            if (null != h) {
                pageModel.setTotalCount((int) h.get("count"));
            }
            aggregationOperations.remove(groupOperation);
            aggregationOperations.add(Aggregation.skip((long) start));
            aggregationOperations.add(Aggregation.limit(count));
        }
        Aggregation a = Aggregation.newAggregation(aggregationOperations);
        List<HashMap> list = mgt.aggregate(a, document.collection(), HashMap.class).getMappedResults();
        pageModel.setList(list);
        return pageModel;
    }

    public Criteria getCriteriaByEntity(T entity, String as, String... filter) {
        Criteria criteria = new Criteria();
        Class cls = entity.getClass();
        java.lang.reflect.Field[] fields = cls.getDeclaredFields();
        h:
        for (java.lang.reflect.Field f : fields) {
            Field mongoField = f.getAnnotation(Field.class);
            if (null == mongoField) continue;
            String annVal = mongoField.value();
            for (String field : filter) {
                if (annVal.equals(field)) continue h;
            }
            Object val = null;
            try {
                f.setAccessible(true);
                val = f.get(entity);
            } catch (IllegalAccessException e) {
                e.fillInStackTrace();
            }
            if (null == val) {
                continue;
            }
            if (null != as) {
                criteria.and(as + "." + annVal).is(val);
            } else {
                criteria.and(annVal).is(val);
            }
        }
        return criteria;
    }

    public Criteria getCriteriaByEntity(T entity) {
        return this.getCriteriaByEntity(entity, null);
    }

    /**
     * 创建带有where条件（只支持等值）和排序的Query对象
     *
     * @param params    参数数组
     * @param propValue 参数值数组
     * @param order     排序
     * @return Query对象
     */
    protected Query createLikeQuery(String[] params, Object[] propValue, String order) {
        Query query = new Query();

        // where 条件
        if (EmptyUtil.isNotEmpty(params) && EmptyUtil.isNotEmpty(propValue)) {
            for (int i = 0; i < params.length; i++) {
                Pattern pattern = Pattern.compile("^.*" + propValue[i] + ".*$", Pattern.CASE_INSENSITIVE);
                query.addCriteria(Criteria.where(params[i]).regex(pattern));
            }
        }

        // 排序
        List<Order> orderList = parseOrder(order);
        if (EmptyUtil.isNotEmpty(orderList)) {
            query.with(new Sort(orderList));
        }

        return query;
    }

    @Override
    public int countLikeCondition(String[] params, String[] values) {
        Query query = createLikeQuery(params, values, null);
        Long count = mgt.count(query, getEntityClass());
        return count.intValue();
    }

    /**
     * 创建带有where条件（只支持等值）和排序的Query对象
     *
     * @param params 参数数组
     * @param values 参数值数组
     * @param order  排序
     * @return Query对象
     */
    protected Query createQuery(String[] params, Object[] values, String order) {
        Query query = new Query();

        // where 条件
        if (EmptyUtil.isNotEmpty(params) && EmptyUtil.isNotEmpty(values)) {
            for (int i = 0; i < params.length; i++) {
                query.addCriteria(Criteria.where(params[i]).is(values[i]));
            }
        }

        // 排序
        List<Order> orderList = parseOrder(order);
        if (EmptyUtil.isNotEmpty(orderList)) {
            query.with(new Sort(orderList));
        }

        return query;
    }


    /**
     * 解析Order字符串为所需参数
     *
     * @param order 排序参数，如[id]、[id asc]、[id asc,name desc]
     * @return Order对象集合
     */
    protected List<Order> parseOrder(String order) {
        List<Order> list = null;
        if (EmptyUtil.isNotEmpty(order)) {
            list = new ArrayList<Order>();
            // 共有几组排序字段
            String[] fields = order.split(",");
            Order o = null;
            String[] item = null;
            for (int i = 0; i < fields.length; i++) {
                if (EmptyUtil.isEmpty(fields[i])) {
                    continue;
                }
                item = fields[i].split(" ");
                if (item.length == 1) {
                    o = new Order(Direction.ASC, item[0]);
                } else if (item.length == 2) {
                    o = new Order("desc".equalsIgnoreCase(item[1]) ? Direction.DESC : Direction.ASC, item[0]);
                } else {
                    throw new RuntimeException("排序字段参数解析出错");
                }
                list.add(o);
            }
        }
        return list;
    }

    /**
     * 将对象的字段及值反射解析为Map对象<br>
     * 这里使用Java反射机制手动解析，并且可以识别注解为主键的字段，以达到根据id进行更新实体的目的<br>
     * key：字段名称，value：字段对应的值
     *
     * @param t 要修改的对象
     * @return Map对象，注意：id字段的key封装为“{id字段名称}”，以供后续识别
     * @throws Exception
     */
    protected Map<String, Object> parseEntity(T t) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        /*
         * 解析ID
		 */
        String idName = "";
        java.lang.reflect.Field[] declaredFields = getEntityClass().getDeclaredFields();
        for (java.lang.reflect.Field field : declaredFields) {
            if (field.isAnnotationPresent(Id.class)) {
                field.setAccessible(true);
                map.put("{" + field.getName() + "}", field.get(t));
                idName = field.getName();
                break;
            }
        }
        /*
         * 解析其他属性
		 */
        Method[] methods = getEntityClass().getDeclaredMethods();
        if (EmptyUtil.isNotEmpty(methods)) {
            for (Method method : methods) {
                if (method.getName().startsWith("get") && method.getModifiers() == Modifier.PUBLIC) {
                    String fieldName = parse2FieldName(method.getName());
                    if (!fieldName.equals(idName)) {
                        map.put(fieldName, method.invoke(t));
                    }
                }
            }
        }

        return map;
    }

    /**
     * 将get方法名转换为对应的字段名称
     *
     * @param methodName 如：getName
     * @return 如：name
     */
    private String parse2FieldName(String methodName) {
        String name = methodName.replace("get", "");
        name = name.substring(0, 1).toLowerCase() + name.substring(1);
        return name;
    }

}

