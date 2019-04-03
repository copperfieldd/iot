package com.changhong.iot.base.dao;

import com.changhong.iot.base.dto.PageModel;
import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.searchdto.DateSearch;
import com.changhong.iot.searchdto.IntSearch;
import com.changhong.iot.util.DateUtil;
import com.changhong.iot.util.EmptyUtil;
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
			Set<Map.Entry<String, Object>> entrySet = map.entrySet();
			for (Map.Entry<String, Object> entry : entrySet) {
				String key = entry.getKey();
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
	public T uniqueByProps(String[] propName, Object[] propValue, String order) {
		Query query = createQuery(propName, propValue, order);
		return mgt.findOne(query, getEntityClass());
	}

	@Override
	public PageModel<T> pageAll(int start, int size) {
		return pageAll(start, size, null);
	}

	@Override
	public PageModel<T> pageAll(int start, int size, String order) {
		return pageByProp(start, size, null, null, order);
	}

	@Override
	public PageModel<T> pageByProp(int start, int size, String param, Object value) {
		return pageByProp(start, size, param, value, null);
	}

	@Override
	public PageModel<T> pageLikeProp(int start, int size, String param, Object value) {
		return pageLikeProp(start, size, param, value, null);
	}

	@Override
	public PageModel<T> pageByProp(int start, int size, String param, Object value, String order) {
		String[] params = null;
		Object[] values = null;
		if (EmptyUtil.isNotEmpty(param)) {
			params = new String[] { param };
			values = new Object[] { value };
		}
		return pageByProps(start, size, params, values, order);
	}

	@Override
	public PageModel<T> pageLikeProp(int start, int size, String param, Object value,String order) {
		String[] params = null;
		Object[] values = null;
		if (EmptyUtil.isNotEmpty(param)) {
			params = new String[] { param };
			values = new Object[] { value };
		}
		return pageLikeProps(start, size, params, values, order);
	}

	@Override
	public PageModel<T> pageByProps(int start, int size, String[] params, Object[] values) {
		return pageByProps(start, size, params, values, null);
	}



	@Override
	public PageModel<T> pageByProps(int start, int size, String[] params, Object[] values, String order) {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>();

		// 查询总记录数
		int count = countByCondition(params, values);
		page.setTotalCount(count);

		// 查询数据列表
		Query query = createQuery(params, values, order);

		// 设置分页信息
		query.skip(start);
		query.limit(size);

		// 封装结果数据
		page.setList(mgt.find(query, getEntityClass()));

		return page;
	}


	@Override
	public PageModel<T> pageLikeProps(int start, int size, String[] params, Object[] values) {
		return pageLikeProps( start,  size,  params,  values,null);
	}

	@Override
	public PageModel<T> pageLikeProps(int start, int size, String[] params, Object[] values, String order) {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>();

		// 查询总记录数
		int count = countLikeCondition(params, values);
		page.setTotalCount(count);

		// 查询数据列表
		Query query = createLikeQuery(params, values, order);

		// 设置分页信息
		query.skip(start);
		query.limit(size);

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
	public List<Order> parseOrder(String order) {
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
		Field[] superFields = t.getClass().getSuperclass().getDeclaredFields();
		Field[] declaredFields = t.getClass().getDeclaredFields();

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
		Map<String, Object> map = null;
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
		if (EmptyUtil.isNotEmpty(map)) {
			Set<Map.Entry<String, Object>> entrySet = map.entrySet();
			for (Map.Entry<String, Object> entry : entrySet) {
				String key = entry.getKey();
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
		Field[] superFields = t.getClass().getSuperclass().getDeclaredFields();
		Field[] declaredFields = t.getClass().getDeclaredFields();

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

	@Override
	public List<T> findAllByPropIn(String key, List inValue, String[] keys, Object[] values) {

		return findAllByPropIn(key, inValue, keys, values, null);
	}

	@Override
	public List<T> findAllByPropIn(String key, List inValue, String[] keys, Object[] values, String order) {

		Query query = createQuery(keys, values, order);

		query.addCriteria(Criteria.where(key).in(inValue));

		return this.mgt.find(query, getEntityClass());
	}

	@Override
	public List<T> findAllByPropIns(String[] key, List[] inValue, String[] keys, Object[] values) {

		return findAllByPropIns(key, inValue, keys, values, null);
	}

	@Override
	public List<T> findAllByPropIns(String[] key, List[] inValue, String[] keys, Object[] values, String order) {

		Query query = createQuery(keys, values, order);

		for (int i = 0; i < key.length; i++) {
			query.addCriteria(Criteria.where(key[i]).in(inValue[i]));
		}

		return this.mgt.find(query, getEntityClass());
	}

	@Override
	public List<T> findAllByPropNin(String key, List inValue, String[] keys, Object[] values) {
		return findAllByPropNin(key, inValue, keys, values, null);
	}

	@Override
	public List<T> findAllByPropNin(String key, List inValue, String[] keys, Object[] values, String order) {

		Query query = createQuery(keys, values, order);

		query.addCriteria(Criteria.where(key).nin(inValue));

		return this.mgt.find(query, getEntityClass());
	}

	@Override
	public List<T> findAllByPropInAndNin(String inKey, List inValue, String ninKey, List ninValue, String[] keys, Object[] values) {

		Query query = createQuery(keys, values, null);

		query.addCriteria(Criteria.where(inKey).in(inValue));
		query.addCriteria(Criteria.where(ninKey).nin(ninValue));

		return this.mgt.find(query, getEntityClass());
	}
	@Override
	public List<T> findLikeAndProps(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String order) {

		// 查询数据列表
		Query query = createLikeAndQuery(likeKeys, likeValues, keys, values, order);

		return mgt.find(query, getEntityClass());
	}

	@Override
	public boolean saveAll(List<T> entitys) {
		mgt.insertAll(entitys);
		return true;
	}

	@Override
	public T findMax(String key) {

		Query query = new Query();

		query.with(new Sort(new Order(Direction.DESC, key)));

		return mgt.findOne(query, getEntityClass());
	}

	@Override
	public boolean deleteByProps(String[] keys, Object[] values) {

		Query query = createQuery(keys, values, null);

		WriteResult result = this.mgt.remove(query, getEntityClass());

		return result != null ? result.wasAcknowledged() : false;
	}

	@Override
	public PageModel<T> pageFilterAndPropsAndIn(int start, int size, String[] keys, Object[] values, String[] inKeys, Object[] inValues, Object filter, String[] ignoreFilter, com.changhong.iot.searchdto.Sort sort) throws ByteException {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>();
		Map<String, Object> map = analysisFilter(filter, ignoreFilter);
		List<String> ks = (List<String>) map.get("keys");
		List<Object> vals = (List<Object>) map.get("values");
		List<String> likeKeys = (List<String>) map.get("likeKeys");
		List<Object> likeValues = (List<Object>) map.get("likeValues");
		Map<String, Map<String, Object>> range = (Map<String, Map<String, Object>>) map.get("range");

		if (EmptyUtil.isNotEmpty(keys) && EmptyUtil.isNotEmpty(values)) {
			ks.addAll(Arrays.asList(keys));
			vals.addAll(Arrays.asList(values));
		}

		Query query = createLikeAndQueryAndRange(likeKeys.toArray(new String[0]), likeValues.toArray(), ks.toArray(new String[0]), vals.toArray(), inKeys, inValues, range, analysisSort(sort));

		// 查询总记录数
		Long count = mgt.count(query, getEntityClass());
		page.setTotalCount(count.intValue());

		// 设置分页信息
		query.skip(start);
		query.limit(size);

		// 封装结果数据
		page.setList(mgt.find(query, getEntityClass()));

		return page;
	}

	private Map<String, Object> analysisFilter(Object filter, String[] ignoreFilter) throws ByteException {

		Map<String, Object> map = new HashMap<>();
		List<String> ignore = null;
		if (ignoreFilter != null) {
			ignore = Arrays.asList(ignoreFilter);
		}

		List<String> keys = new ArrayList<>();
		List<Object> values = new ArrayList<>();
		List<String> likeKeys = new ArrayList<>();
		List<Object> likeValues = new ArrayList<>();
		Map<String, Map<String, Object>> range = new HashMap<>();

		if (filter != null) {

			Class<?> aClass = filter.getClass();
			Field[] fields = aClass.getDeclaredFields();
			for (Field field : fields) {
				field.setAccessible(true);
				try {
					Object o = field.get(filter);
					if (o != null) {
						org.springframework.data.mongodb.core.mapping.Field annotation = field.getAnnotation(org.springframework.data.mongodb.core.mapping.Field.class);
						String key = null;

						if (annotation != null) {
							key = annotation.value();
						} else {
							key = field.getName();
						}

						if (ignore != null && ignore.contains(field.getName())) {
							continue;
						}

						pack(o, key, keys, values, likeKeys, likeValues, range);
					}
				} catch (IllegalAccessException e) {}
			}

		}

		map.put("keys", keys);
		map.put("values", values);
		map.put("likeKeys", likeKeys);
		map.put("likeValues", likeValues);
		map.put("range", range);
		return map;
	}

	private void pack(Object o, String key, List<String> keys, List<Object> values, List<String> likeKeys, List<Object> likeValues, Map<String, Map<String, Object>> range) throws ByteException {

		if (o instanceof String) {
			likeKeys.add(key);
			likeValues.add(o);
		} else if (o instanceof Integer) {
			keys.add(key);
			values.add(o);
		} else if (o instanceof DateSearch) {
			DateSearch dateSearch = (DateSearch) o;
			String startTime = dateSearch.getStartTime();
			String endTime = dateSearch.getEndTime();

			Date startDate = analysisDate(startTime);
			Date endDate = analysisDate(endTime);

			if (startDate != null || endDate != null) {
				Map<String, Object> map = new HashMap<>();
				map.put("start", startDate);
				map.put("end", endDate);
				range.put(key, map);
			}
		} else if (o instanceof IntSearch) {
			IntSearch intSearch = (IntSearch) o;
			Integer max = intSearch.getMax();
			Integer min = intSearch.getMin();

			if (max != null || min != null) {
				Map<String, Object> map = new HashMap<>();
				map.put("start", min);
				map.put("end", max);
				range.put(key, map);
			}
		}
	}

	private Date analysisDate(String strDate) throws ByteException {

		Date date = null;

		if (EmptyUtil.isNotEmpty(strDate)) {
			if (DateUtil.isValidDate(strDate) || DateUtil.isValidDateTime(strDate)) {

				if (strDate.length() == 10) {
					date = DateUtil.strToDateShort(strDate);
					if (date == null) {
						date = DateUtil.strToDateShort1(strDate);
					}
					if (date == null) {
						throw new ByteException(1004);
					}
				} else {
					date = DateUtil.strToDateLong(strDate);
					if (date == null) {
						date = DateUtil.strToDateLong1(strDate);
					}
					if (date == null) {
						throw new ByteException(1004);
					}
				}
			} else {
				throw new ByteException(1004);
			}
		}
		return date;
	}

	public String analysisSort(com.changhong.iot.searchdto.Sort sort) {

		if (sort == null || EmptyUtil.isEmpty(sort.getName())) {
			return null;
		}
		String order = "";
		String o = sort.getOrder();
		if (EmptyUtil.isNotEmpty(o)) {
			o = o.toLowerCase();
			if ("asc".equals(o) || "desc".equals(o)) {
				order = " " + o;
			}
		}
		return sort.getName() +  order;
	}

	@Override
	public PageModel<T> pageLikeAndProps(int start, int size, String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String order) {
		// 创建分页模型对象
		PageModel<T> page = new PageModel<>();

		// 查询总记录数
		int count = countLikeAndCondition(likeKeys, likeValues, keys, values);
		page.setTotalCount(count);

		// 查询数据列表
		Query query = createLikeAndQuery(likeKeys, likeValues, keys, values, order);

		// 设置分页信息
		query.skip(start);
		query.limit(size);

		// 封装结果数据
		page.setList(mgt.find(query, getEntityClass()));

		return page;
	}

	@Override
	public List<T> findLikeAndPropsAndIn(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String[] inKeys, List[] inVals, String order) {
		// 查询数据列表
		Query query = createLikeAndQueryAndIn(likeKeys, likeValues, keys, values, inKeys, inVals, order);

		return mgt.find(query, getEntityClass());
	}

	public Query createLikeAndQueryAndIn(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String[] inKeys, List[] inVals, String order) {

		Query query = new Query();

		// where 条件like
		if (EmptyUtil.isNotEmpty(likeKeys) && EmptyUtil.isNotEmpty(likeValues)) {
			for (int i = 0; i < likeKeys.length; i++) {
				Pattern pattern = Pattern.compile("^.*" + likeValues[i] + ".*$", Pattern.CASE_INSENSITIVE);
				query.addCriteria(Criteria.where(likeKeys[i]).regex(pattern));
			}
		}

		if (EmptyUtil.isNotEmpty(keys) && EmptyUtil.isNotEmpty(values)) {
			for (int i = 0; i < keys.length; i++) {
				query.addCriteria(Criteria.where(keys[i]).is(values[i]));
			}
		}

		if (EmptyUtil.isNotEmpty(inKeys)) {
			for (int i = 0; i < inKeys.length; i++) {
				query.addCriteria(Criteria.where(inKeys[i]).in(inVals[i]));
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
	public int countLikeAndCondition(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values) {

		Query query = createLikeAndQuery(likeKeys, likeValues, keys, values, null);

		Long count = mgt.count(query, getEntityClass());
		return count.intValue();
	}

	protected Query createLikeAndQuery(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String order) {
		Query query = new Query();

		// where 条件like
		if (EmptyUtil.isNotEmpty(likeKeys) && EmptyUtil.isNotEmpty(likeValues)) {
			for (int i = 0; i < likeKeys.length; i++) {
				Pattern pattern = Pattern.compile("^.*" + likeValues[i] + ".*$", Pattern.CASE_INSENSITIVE);
				query.addCriteria(Criteria.where(likeKeys[i]).regex(pattern));
			}
		}

		if (EmptyUtil.isNotEmpty(keys) && EmptyUtil.isNotEmpty(values)) {
			for (int i = 0; i < keys.length; i++) {
				query.addCriteria(Criteria.where(keys[i]).is(values[i]));
			}
		}

		// 排序
		List<Order> orderList = parseOrder(order);
		if (EmptyUtil.isNotEmpty(orderList)) {
			query.with(new Sort(orderList));
		}

		return query;
	}

	protected Query createLikeAndQueryAndRange(String[] likeKeys, Object[] likeValues, String[] keys, Object[] values, String[] inKeys, Object[] inValues, Map<String, Map<String, Object>> range, String order) {

		Query query = new Query();

		// where 条件like
		if (EmptyUtil.isNotEmpty(likeKeys) && EmptyUtil.isNotEmpty(likeValues)) {
			for (int i = 0; i < likeKeys.length; i++) {
				Pattern pattern = Pattern.compile("^.*" + likeValues[i] + ".*$", Pattern.CASE_INSENSITIVE);
				query.addCriteria(Criteria.where(likeKeys[i]).regex(pattern));
			}
		}

		if (EmptyUtil.isNotEmpty(keys) && EmptyUtil.isNotEmpty(values)) {
			for (int i = 0; i < keys.length; i++) {
				query.addCriteria(Criteria.where(keys[i]).is(values[i]));
			}
		}

		if (EmptyUtil.isNotEmpty(inKeys) && EmptyUtil.isNotEmpty(inValues)){
			for (int i = 0; i < inKeys.length; i++) {
				query.addCriteria(Criteria.where(inKeys[i]).in((Collection)inValues[i]));
			}
		}

		//范围
		if(EmptyUtil.isNotEmpty(range)) {
			Set<Map.Entry<String, Map<String, Object>>> entries = range.entrySet();
			for (Map.Entry<String, Map<String, Object>> entry : entries) {
				Map<String, Object> map = entry.getValue();
				Object start = map.get("start");
				Object end = map.get("end");

				Criteria where = Criteria.where(entry.getKey());
				if (start != null) {
					where = where.gte(start);
				}
				if (end != null) {
					where = where.lte(end);
				}
				query.addCriteria(where);
			}
		}

		// 排序
		List<Order> orderList = parseOrder(order);
		if (EmptyUtil.isNotEmpty(orderList)) {
			query.with(new Sort(orderList));
		}

		return query;
	}
}

