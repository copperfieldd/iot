package com.changhong.iot.audit.base.dao;

import com.changhong.iot.audit.base.dto.PageModel;
import com.changhong.iot.audit.util.EmptyUtil;
import com.changhong.iot.audit.base.dto.PageModel;
import com.changhong.iot.audit.util.EmptyUtil;
import com.mongodb.WriteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.*;
import java.util.regex.Pattern;


/**
 * 基本操作接口MongoDB数据库实现类
 * <p>
 * ClassName: BaseMongoDaoImpl
 * </p>
 * <p>
 * Description:本实现类适用于MongoDB数据库
 * </p>
 * 
 * @author don
 * @date 2018年3月12日
 */
public abstract class BaseMongoDaoImpl<T> implements BaseMongoDao<T> {

	protected abstract Class<T> getEntityClass();

	@Autowired
	protected MongoTemplate mgt;

	@Override
	public void save(T entity) {
		mgt.save(entity);
	}

	@Override
	public boolean update(T entity) {

		// 反向解析对象
		Map<String, Object> map = new HashMap<>();
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
		final Set<Map.Entry<String, Object>> entries = map.entrySet();
		if (EmptyUtil.isNotEmpty(map)) {
			for (Map.Entry<String, Object> entry :entries ) {
				final String key = entry.getKey();
				if (key.indexOf("{") != -1) {
					// 设置ID
					idName = key.substring(key.indexOf("{") + 1, key.indexOf("}"));
					idValue = entry.getValue();
				} else {
					update.set(key, entry.getValue());
				}
			}
		}

		WriteResult result = mgt.updateFirst(new Query().addCriteria(Criteria.where(idName).is(idValue)), update, getEntityClass());

		return result != null ? result.wasAcknowledged() : false;
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
	public List<T> findByProp(String propName, Object propValue) {
		return findByProp(propName, propValue, null);
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
	public List<T> findByProps(String[] propName, Object[] propValue) {
		return findByProps(propName, propValue, null);
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
	public PageModel<T> pageAll(int pageNo, int pageSize) {
		return pageAll(pageNo, pageSize, null);
	}

	@Override
	public PageModel<T> pageAll(int pageNo, int pageSize, String order) {
		return pageByProp(pageNo, pageSize, null, null, order);
	}

	@Override
	public PageModel<T> pageByProp(int pageNo, int pageSize, String param, Object value) {
		return pageByProp(pageNo, pageSize, param, value, null);
	}

	@Override
	public PageModel<T> pageLikeProp(int pageNo, int pageSize, String param, Object value) {
		return pageLikeProp(pageNo, pageSize, param, value, null);
	}

	@Override
	public PageModel<T> pageByProp(int pageNo, int pageSize, String param, Object value, String order) {
		String[] params = null;
		Object[] values = null;
		if (EmptyUtil.isNotEmpty(param)) {
			params = new String[] { param };
			values = new Object[] { value };
		}
		return pageByProps(pageNo, pageSize, params, values, order);
	}

	@Override
	public PageModel<T> pageLikeProp(int pageNo, int pageSize, String param, Object value,String order) {
		String[] params = null;
		Object[] values = null;
		if (EmptyUtil.isNotEmpty(param)) {
			params = new String[] { param };
			values = new Object[] { value };
		}
		return pageLikeProps(pageNo, pageSize, params, values, order);
	}

	@Override
	public PageModel<T> pageByProps(int pageNo, int pageSize, String[] params, Object[] values) {
		return pageByProps(pageNo, pageSize, params, values, null);
	}



	@Override
	public PageModel<T> pageByProps(int pageNo, int pageSize, String[] params, Object[] values, String order) {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>(pageNo, pageSize);

		// 查询总记录数
		int count = countByCondition(params, values);
		page.setTotalCount(count);

		// 查询数据列表
		Query query = createQuery(params, values, order);

		// 设置分页信息
		query.skip(page.getFirstResult());
		query.limit(page.getPageSize());

		// 封装结果数据
		page.setList(mgt.find(query, getEntityClass()));

		return page;
	}


	@Override
	public PageModel<T> pageLikeProps(int pageNo, int pageSize, String[] params, Object[] values) {
		return pageLikeProps( pageNo,  pageSize,  params,  values,null);
	}

	@Override
	public PageModel<T> pageLikeProps(int pageNo, int pageSize, String[] params, Object[] values, String order) {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>(pageNo, pageSize);

		// 查询总记录数
		int count = countLikeCondition(params, values);
		page.setTotalCount(count);

		// 查询数据列表
		Query query = createLikeQuery(params, values, order);

		// 设置分页信息
		query.skip(page.getFirstResult());
		query.limit(page.getPageSize());

		// 封装结果数据
		page.setList(mgt.find(query, getEntityClass()));

		return page;
	}



	@Override
	public int countLikeCondition(String[] params, Object[] values) {
		Query query = createLikeQuery(params, values, null);
		Long count = mgt.count(query, getEntityClass());
		return count.intValue();
	}



	/**
	 * 创建带有where条件（只支持等值）和排序的Query对象
	 *
	 * @param params
	 *            参数数组
	 * @param values
	 *            参数值数组
	 * @param order
	 *            排序
	 * @return Query对象
	 */
	protected Query createLikeQuery(String[] params, Object[] values, String order) {
		Query query = new Query();

		// where 条件
		if (EmptyUtil.isNotEmpty(params) && EmptyUtil.isNotEmpty(values)) {
			for (int i = 0; i < params.length; i++) {
				Pattern pattern = Pattern.compile("^.*" + values[i] + ".*$", Pattern.CASE_INSENSITIVE);
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
	public int countByCondition(String[] params, Object[] values) {
		Query query = createQuery(params, values, null);
		Long count = mgt.count(query, getEntityClass());
		return count.intValue();
	}


	/**
	 * 创建带有where条件（只支持等值）和排序的Query对象
	 *
	 * @param params
	 *            参数数组
	 * @param values
	 *            参数值数组
	 * @param order
	 *            排序
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
	 * @param order
	 *            排序参数，如[id]、[id asc]、[id asc,name desc]
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
	 * @param t
	 *            要修改的对象
	 * @return Map对象，注意：id字段的key封装为“{id字段名称}”，以供后续识别
	 * @throws Exception
	 */
	protected Map<String, Object> parseEntity(T t) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		/*
		 * 解析ID
		 */
		String idName = "";
		Field[] superFields = getEntityClass().getSuperclass().getDeclaredFields();
		Field[] declaredFields = getEntityClass().getDeclaredFields();

		List<Field> fields = new ArrayList();
		fields.addAll((Collection<Field>) Arrays.asList(superFields));
		fields.addAll((Collection<Field>) Arrays.asList(declaredFields));

		for (Field field : fields) {
			if (field.isAnnotationPresent(Id.class)) {
				org.springframework.data.mongodb.core.mapping.Field annotation = field.
						getAnnotation(org.springframework.data.mongodb.core.mapping.Field.class);
				String fileName = null;
				if (annotation != null) {
					String name = annotation.value();
					if (EmptyUtil.isNotEmpty(name)){
						fileName = name;
					} else {
						fileName = field.getName();
					}
				} else {
					fileName = field.getName();
				}

				field.setAccessible(true);
				map.put("{" + fileName + "}", field.get(t));
				idName = fileName;
				break;
			}
		}
		/*
		 * 解析其他属性
		 */
		for (Field field : fields) {
			if (!field.isAnnotationPresent(Id.class) && !field.isAnnotationPresent(Transient.class)) {

				org.springframework.data.mongodb.core.mapping.Field annotation = field.
						getAnnotation(org.springframework.data.mongodb.core.mapping.Field.class);
				String fileName = null;
				if (annotation != null) {
					String name = annotation.value();
					if (EmptyUtil.isNotEmpty(name)){
						fileName = name;
					} else {
						fileName = field.getName();
					}
				} else {
					fileName = field.getName();
				}

				field.setAccessible(true);
				map.put(fileName, field.get(t));
			}
		}

//		Method[] methods = getEntityClass().getDeclaredMethods();
//		if (EmptyUtil.isNotEmpty(methods)) {
//			for (Method method : methods) {
//				if (method.getName().startsWith("get") && method.getModifiers() == Modifier.PUBLIC) {
//					String fieldName = parse2FieldName(method.getName());
//					if (!fieldName.equals(idName)) {
//						map.put(fieldName, method.invoke(t));
//					}
//				}
//			}
//		}

		return map;
	}

	/**
	 * 将get方法名转换为对应的字段名称
	 *
	 * @param methodName
	 *            如：getName
	 * @return 如：name
	 */
	private String parse2FieldName(String methodName) {
		String name = methodName.replace("get", "");
		name = name.substring(0, 1).toLowerCase() + name.substring(1);
		return name;
	}

	@Override
	public boolean updateOneByProp(String byKey, Object byValue, String key, Object value) {
		return updateOneByProps(new String[] { byKey }, new Object[] { byValue }, new String[] { key }, new Object[] { value });
	}

	@Override
	public boolean updateOneByProp(String byKey, Object byValue, String[] keys, Object[] values) {
		return updateOneByProps(new String[] { byKey }, new Object[] { byValue }, keys, values);
	}

	@Override
	public boolean updateOneByProps(String[] byKeys, Object[] byValues, String key, Object value) {
		return updateOneByProps(byKeys, byValues, new String[] { key }, new Object[] { value });
	}

	@Override
	public boolean updateOneByProps(String[] byKeys, Object[] byValues, String[] keys, Object[] values) {

		Query query = this.createQuery(byKeys, byValues, null);

		Update update = this.createUpdate(keys, values);

		WriteResult result = this.mgt.updateFirst(query, update, getEntityClass());

		return result != null ? result.wasAcknowledged() : false;
	}

	@Override
	public boolean updateMaryByProp(String byKey, Object byValue, String key, Object value) {
		return updateMaryByProps(new String[] { byKey }, new Object[] { byValue }, new String[] { key }, new Object[] { value });
	}

	@Override
	public boolean updateMaryByProp(String byKey, Object byValue, String[] keys, Object[] values) {
		return updateMaryByProps(new String[] { byKey }, new Object[] { byValue }, keys, values);
	}

	@Override
	public boolean updateMaryByProps(String[] byKeys, Object[] byValues, String key, Object value) {
		return updateMaryByProps(byKeys, byValues, new String[] { key }, new Object[] { value });
	}

	@Override
	public boolean updateMaryByProps(String[] byKeys, Object[] byValues, String[] keys, Object[] values) {

		Query query = this.createQuery(byKeys, byValues, null);

		Update update = this.createUpdate(keys, values);

		WriteResult result = this.mgt.updateMulti(query, update, getEntityClass());

		return result != null ? result.wasAcknowledged() : false;
	}

	@Override
	public boolean updateByParamNotNull(T entity) {
		// 反向解析对象
		Map<String, Object> map = new HashMap<>();
		try {
			map = parseEntityByParamNotNull(entity);
		} catch (Exception e) {
			e.printStackTrace();
		}

		// ID字段
		String idName = null;
		Object idValue = null;

		// 生成参数
		Update update = new Update();
		final Set<Map.Entry<String, Object>> entries = map.entrySet();
		if (EmptyUtil.isNotEmpty(map)) {
			for (Map.Entry<String, Object> entry :entries ) {
				final String key = entry.getKey();
				if (key.indexOf("{") != -1) {
					// 设置ID
					idName = key.substring(key.indexOf("{") + 1, key.indexOf("}"));
					idValue = entry.getValue();
				} else {
					update.set(key, entry.getValue());
				}
			}
		}

		WriteResult result = mgt.updateFirst(new Query().addCriteria(Criteria.where(idName).is(idValue)), update, getEntityClass());

		return result != null ? result.wasAcknowledged() : false;
	}

	private Update createUpdate(String[] params, Object[] values){

		Update update = new Update();

		if (EmptyUtil.isNotEmpty(params) && EmptyUtil.isNotEmpty(values)){
			for (int i = 0; i < params.length; i++) {
				update.set(params[i], values[i]);
			}
		}
		return update;
	}

	private Map<String, Object> parseEntityByParamNotNull(T t) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		/*
		 * 解析ID
		 */
		String idName = "";
		Field[] superFields = getEntityClass().getSuperclass().getDeclaredFields();
		Field[] declaredFields = getEntityClass().getDeclaredFields();

		List<Field> fields = new ArrayList();
		fields.addAll((Collection<Field>) Arrays.asList(superFields));
		fields.addAll((Collection<Field>) Arrays.asList(declaredFields));

		for (Field field : fields) {
			if (field.isAnnotationPresent(Id.class)) {
				org.springframework.data.mongodb.core.mapping.Field annotation = field.
						getAnnotation(org.springframework.data.mongodb.core.mapping.Field.class);
				String fileName = null;
				if (annotation != null) {
					String name = annotation.value();
					if (EmptyUtil.isNotEmpty(name)) {
						fileName = name;
					} else {
						fileName = field.getName();
					}
				} else {
					fileName = field.getName();
				}

				field.setAccessible(true);
				map.put("{" + fileName + "}", field.get(t));
				idName = fileName;
				break;
			}
		}
		/*
		 * 解析其他属性
		 */
		for (Field field : fields) {
			field.setAccessible(true);
			Object val = field.get(t);
			if (val != null){
				if (!field.isAnnotationPresent(Id.class) && !field.isAnnotationPresent(Transient.class)) {

					org.springframework.data.mongodb.core.mapping.Field annotation = field.
							getAnnotation(org.springframework.data.mongodb.core.mapping.Field.class);
					String fileName = null;
					if (annotation != null) {
						String name = annotation.value();
						if (EmptyUtil.isNotEmpty(name)){
							fileName = name;
						} else {
							fileName = field.getName();
						}
					} else {
						fileName = field.getName();
					}

					map.put(fileName, val);
				}
			}
		}

		return map;
	}

}

