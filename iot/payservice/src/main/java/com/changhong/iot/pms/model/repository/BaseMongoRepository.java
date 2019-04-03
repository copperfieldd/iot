package com.changhong.iot.pms.model.repository;

import com.changhong.iot.common.response.PageModel;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

/**
 * 通用基本操作方法接口
 * <p>
 * ClassName: BaseMongoRepository
 * </p>
 * <p>
 * Description:本类中的所有带条件查询的方法不具有完全的通用性，只能用作一般等值条件的比较<br>
 * 当有一些特殊需求时，比如大于、小于、大于等于、小于等于、like查询、 or查询等等，此时，这些<br>
 * 方法将不再满足需求，需要通过在子类dao中自定义方法实现
 * </p>
 *
 * @date 2018年3月12日
 */
public interface BaseMongoRepository<T> {
    /**
     * 保存实体<br>
     * 备注：执行完成本方法后，所引用实体的主键id会自动赋上值
     *
     * @param entity
     */
    void save(T entity);

    /**
     * 修改实体
     *
     * @param entity
     */
    void update(T entity);

    /**
     * 删除实体[数组]
     *
     * @param ids 实体ID或数组
     */
    void delete(Serializable... ids);


    /**
     * @param ids 实体ID或数组
     * @author Rita
     * @date 2018年5月11日 下午4:58:15
     * @MethodsName: delFake
     * @Description: 软删除
     */
    void delFake(Serializable... ids);


    /**
     * 根据ID查询
     *
     * @param id 实体的主键ID
     */
    T find(Serializable id);


    /**
     * 查询所有记录<br>
     * [不分页]
     *
     * @return 结果集合
     */
    List<T> findAll();

    /**
     * 查询所有记录并排序<br>
     * [不分页]<br>
     *
     * @param order 排序字段，例如：id或id asc、或id asc,name desc<br>
     *              为空则不排序，不指定排序方式则默认升序排序
     * @return 结果集合
     */
    List<T> findAll(String order);

    /**
     * 根据单一参数查询记录<br>
     * [不分页]
     *
     * @param propName  属性名称，对应实体类字段名称
     * @param propValue 属性值
     * @return 结果列表 或 null
     */
    List<T> findByProp(String propName, Object propValue);

    /**
     * 根据单一参数查询记录并排序<br>
     * [不分页]
     *
     * @param propName  属性名称，对应实体类字段名
     * @param propValue 属性值
     * @param order     排序字段，例如：id或id asc、或id asc,name desc<br>
     *                  为空则不排序，不指定排序方式则默认升序排序
     * @return 结果集合 或 null
     */
    List<T> findByProp(String propName, Object propValue, String order);

    /**
     * 根据多个参数查询记录<br>
     * [不分页]
     *
     * @param propName  参数数组
     * @param propValue 参数值数组
     * @return 结果集合 或 null
     */
    List<T> findByProps(String[] propName, Object[] propValue);

    /**
     * 根据多个参数查询记录 并排序<br>
     * [不分页]
     *
     * @param propName  参数数组
     * @param propValue 参数值数组
     * @param order     排序字段，例如：id或id asc、或id asc,name desc<br>
     *                  为空则不排序，不指定排序方式则默认升序排序
     * @return 结果集合 或 null
     */
    List<T> findByProps(String[] propName, Object[] propValue, String order);

    /**
     * 根据单一参数查询唯一结果<br>
     * [HQL]
     *
     * @param propName  属性名称，对应实体类字段名
     * @param propValue 属性值
     * @return 唯一结果 或 null
     */
    T uniqueByProp(String propName, Object propValue);

    /**
     * 根据多个参数查询唯一结果<br>
     * [HQL]
     *
     * @param propName  参数数组
     * @param propValue 参数值数组
     * @return 唯一结果 或 null
     */
    T uniqueByProps(String[] propName, Object[] propValue);

    /**
     * 分页查询所有结果集合<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageAll(int pageNo, int pageSize);

    /**
     * 分页查询所有结果集合 并排序<br>
     * [分页]
     *
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageAll(Query query);

    /**
     * 分页查询所有结果集合 并排序<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param order    排序字段，例如：id或id asc、或id asc,name desc<br>
     *                 为空则不排序，不指定排序方式则默认升序排序
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageAll(int pageNo, int pageSize, String order);

    /**
     * 根据参数分页查询结果集合<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param param    参数
     * @param value    参数值
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageByProp(int pageNo, int pageSize, String param, Object value);

    /**
     * 根据参数分页查询结果集合并排序<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param param    参数
     * @param value    参数值
     * @param order    排序字段，例如：id或id asc、或id asc,name desc<br>
     *                 为空则不排序，不指定排序方式则默认升序排序
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageByProp(int pageNo, int pageSize, String param, Object value, String order);

    /**
     * 根据参数分页查询结果集合<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param params   参数数组
     * @param values   参数值数组
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageByProps(int pageNo, int pageSize, String[] params, Object[] values);

    /**
     * 根据条件查询总记录数[模糊查询]
     *
     * @param params 参数数组
     * @param values 参数值数组
     * @return 总记录数
     */
    int countLikeCondition(String[] params, String[] values);

    /**
     * 根据参数分页查询结果集合 并排序<br>
     * [分页]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param params   参数数组
     * @param values   参数值数组
     * @param order    排序字段，例如：id或id asc、或id asc,name desc<br>
     *                 为空则不排序，不指定排序方式则默认升序排序
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageByProps(int pageNo, int pageSize, String[] params, Object[] values, String order);

    /**
     * 根据条件查询总记录数
     *
     * @param params 参数数组
     * @param values 参数值数组
     * @return 总记录数
     */
    int countByCondition(String[] params, Object[] values);


    /**
     * 根据参数分页查询结果集合<br>
     * [分页][模糊查询]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param param    参数
     * @param value    参数值
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageLikeProp(int pageNo, int pageSize, String param, String value);

    PageModel<T> pageLikeProp(int pageNo, int pageSize, String param, String value, String order);

    /**
     * 根据参数分页查询结果集合 并排序<br>
     * [分页][模糊查询]
     *
     * @param pageNo   当前页码
     * @param pageSize 页容量
     * @param params   参数数组
     * @param values   参数值数组
     * @param order    排序字段，例如：id或id asc、或id asc,name desc<br>
     *                 为空则不排序，不指定排序方式则默认升序排序
     * @return 分页模型对象（不会为null）
     */
    PageModel<T> pageLikeProps(int pageNo, int pageSize, String[] params, String[] values, String order);

    PageModel<T> pageLikeProps(int pageNo, int pageSize, String[] params, String[] values);

    /**
     * 根据实体类字段为条件获取数据
     *
     * @param lookupOperations AggregationOperation https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/
     * @param pageNo           页号
     * @param pageSize         返回条数
     * @return
     */
    PageModel<HashMap> aggregate(List<AggregationOperation> lookupOperations, int pageNo, int pageSize);


    PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, Class<?> cls, int pageNo, int pageSize);


    PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, int pageNo, int pageSize, boolean globalCount);

    /**
     * 根据实体类字段为条件获取数据
     *
     * @param aggregationOperations
     * @param cls
     * @param pageNo
     * @param pageSize
     * @param globalCount           是否返回实体类的总条数
     * @return
     */
    PageModel<HashMap> aggregate(List<AggregationOperation> aggregationOperations, Class<?> cls, int pageNo, int pageSize, boolean globalCount);

    List<T> findLikeProp(String propName, Object propValue);

    List<T> findLikeProp(String propName, Object propValue, String order);

    List<T> findLikeProps(String[] propName, Object[] propValue);

    List<T> findLikeProps(String[] propName, Object[] propValue, String order);


}
