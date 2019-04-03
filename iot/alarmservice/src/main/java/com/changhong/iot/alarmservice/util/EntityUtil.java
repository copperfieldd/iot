package com.changhong.iot.alarmservice.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class EntityUtil {
    /**
     * entity转dto
     *
     * @param entity   字段多的实体
     * @param dtoClass 字段少的实体的class
     * @return
     * @throws IllegalAccessException
     * @author zhanlang
     */
    public static Object entityToDto(Object entity, Class dtoClass) throws IllegalAccessException, InstantiationException {

        if (entity == null || dtoClass == null) {
            return null;
        }

        Object dto = dtoClass.newInstance();
        Class<?> entityClass = entity.getClass();
        //暴力反射获取所有字段(包括私有)
        Field[] entityFields = entityClass.getDeclaredFields();
        Field[] entitySuperClassFields = entityClass.getSuperclass().getDeclaredFields();
        Field[] dtoFields = dtoClass.getDeclaredFields();
        Field[] dtoSuperClassFields = dtoClass.getSuperclass().getDeclaredFields();

        List<Field> entityClassFields = new ArrayList<>();
        List<Field> dtoClassFields = new ArrayList<>();

        entityClassFields.addAll(Arrays.asList(entityFields));
        entityClassFields.addAll(Arrays.asList(entitySuperClassFields));

        dtoClassFields.addAll(Arrays.asList(dtoFields));
        dtoClassFields.addAll(Arrays.asList(dtoSuperClassFields));

        //赋值
        for (Field dtoField : dtoClassFields) {
            String dtoFieldName = dtoField.getName();
            Class<?> dtoFieldType = dtoField.getType();
            if (dtoFieldName.equals("serialVersionUID")) {
                continue;
            }
            //类型和名称相同就进行赋值
            for (Field entityField : entityClassFields) {
                if (dtoFieldName.equals(entityField.getName()) && dtoFieldType == entityField.getType()) {
                    //暴力访问
                    dtoField.setAccessible(true);
                    entityField.setAccessible(true);
                    dtoField.set(dto, entityField.get(entity));
                }
            }
        }
        return dto;
    }


    /**
     * List<entity> 转成List<dto>
     *
     * @param entityList
     * @param dtoClass
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @author zhanlang
     */
    public static List entityListToDtoList(List entityList, Class dtoClass) throws IllegalAccessException, InstantiationException {
        List dtoList = new ArrayList();
        for (Object entity : entityList) {
            Object dto = entityToDto(entity, dtoClass);
            dtoList.add(dto);
        }
        return dtoList;
    }


    /**
     * 数据库映射map转entity （下划线转驼峰）
     * @param map
     * @param entityClass
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @author zhanlang
     */
//    public static Object mapToEntity(Map map, Class entityClass) throws IllegalAccessException, InstantiationException {
//        Object entity = entityClass.newInstance();
//        Field[] fields = entityClass.getDeclaredFields();
//        Field[] superFields = entityClass.getSuperclass().getDeclaredFields();
//
//        List<Field> list = new ArrayList<>();
//        list.addAll(Arrays.asList(fields));
//        list.addAll(Arrays.asList(superFields));
//
//        for (Object key : map.keySet()) {
//            if (key instanceof String) {
//                String k = (String) key;
//
//                //转驼峰
//                String name = camelName(k);
//                Object value = map.get(key);
//                //类型和名称相同就进行赋值
//                for (Field entityField : list) {
//                    if (name.equals(entityField.getName())) {
//                        if ( value.getClass() == entityField.getType()
//                                || (value.getClass() == Integer.class&& entityField.getType() ==int.class )
//                                || (value.getClass() == Integer[].class&& entityField.getType() ==int[].class )
//                                || (value.getClass() == Float.class&& entityField.getType() ==float.class )
//                                || (value.getClass() == Float[].class&& entityField.getType() ==float[].class )
//                                || (value.getClass() == Double.class&& entityField.getType() ==double.class )
//                                || (value.getClass() == Double[].class&& entityField.getType() ==double[].class )
//                                || (value.getClass() == Long.class&& entityField.getType() ==long.class )
//                                || (value.getClass() == Long[].class&& entityField.getType() ==long[].class ))
//                        //暴力访问
//                        entityField.setAccessible(true);
//                        entityField.set(entity, value);
//                    }
//                }
//            }
//        }
//        return entity;
//    }
    /**
     * 将下划线命名的字符串转换为驼峰式
     *
     * @param name 转换前的下划线大写方式命名的字符串
     * @return 转换后的驼峰式命名的字符串
     * @author zhanlang
     * 例如：i_asset_id -----  assetId
     */
    public static String camelName(String name) {
        StringBuilder result = new StringBuilder();

        if (name.indexOf(0) =='-'){
            name = name.substring(1);
        }
        // 快速检查
        if (name == null || name.isEmpty()) {
            // 没必要转换
            return "";
        } else if (!name.contains("_")) {
            // 不含下划线，仅将首字母小写
            return name.substring(0, 1).toLowerCase() + name.substring(1);
        }
        // 用下划线将原始字符串分割
        String[] camels = name.split("_");
        for (int i = 1; i < camels.length; i++) {
            String camel = camels[i];
            // 跳过原始字符串中开头、结尾的下换线或双重下划线
            if (camel.isEmpty()) {
                continue;
            }
            // 处理真正的驼峰片段
            if (result.length() == 0) {
                // 第一个驼峰片段，全部字母都小写
                result.append(camel.toLowerCase());
            } else {
                // 其他的驼峰片段，首字母大写
                result.append(camel.substring(0, 1).toUpperCase());
                result.append(camel.substring(1).toLowerCase());
            }
        }
        return result.toString();
    }

    /**
     * List<Map<String,Object>> 转实体集合
     *
     * @param list        mongodb映射数据集合
     * @param entityClass 实体Class
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @author zhanlang
     */
//    public static List mapToEntityToList(List<HashMap> list, Class entityClass) throws IllegalAccessException, InstantiationException {
//        List entityList = new ArrayList();
//        for (Map<String, Object> map : list) {
//            Object value = mapToEntity(map, entityClass);
//            if (null != value)
//                entityList.add(value);
//        }
//        return entityList;
//    }
}
