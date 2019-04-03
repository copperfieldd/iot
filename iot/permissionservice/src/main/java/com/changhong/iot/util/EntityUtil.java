package com.changhong.iot.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class EntityUtil {
    /**
     * entity转dto
     * @param entity 字段多的实体
     * @param dtoClass 字段少的实体的class
     * @author zhanlang
     * @return
     * @throws IllegalAccessException
     */
    public static Object entityToDto(Object entity, Class dtoClass) {
        if (entity == null || dtoClass == null) {
            return null;
        }
        Object dto = null;
        try {
            dto = dtoClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
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
            if(dtoFieldName.equals("serialVersionUID")){
                continue;
            }
            //类型和名称相同就进行赋值
            for (Field entityField : entityClassFields) {
                if (dtoFieldName.equals(entityField.getName()) && dtoFieldType == entityField.getType()) {
                    //暴力访问
                    dtoField.setAccessible(true);
                    entityField.setAccessible(true);
                    try {
                        dtoField.set(dto, entityField.get(entity));
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return dto;
    }



    /**
     * List<entity> 转成List<dto>
     * @param entityList
     * @param dtoClass
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    public static List entityListToDtoList(List entityList,Class dtoClass) {
        List dtoList = new ArrayList();
        for (Object entity : entityList){
            Object dto = entityToDto(entity, dtoClass);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
