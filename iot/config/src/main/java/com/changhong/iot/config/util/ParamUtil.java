package com.changhong.iot.config.util;

import com.changhong.iot.config.base.exception.ByteException;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ParamUtil {

    /**
     * 检查对象的参数不为null或""，
     * 当参数为null或""，则抛出ByteException异常
     * 如果该对象没有该参数则会忽略它
     *
     * @param
     * @return
     */
    public static void checkParamNotNullAndNotEmpty(Object obj, String... params) throws ByteException {

        if (params != null && params.length > 0) {

            Class<?> clazz = obj.getClass();
            Class<?> superclass = clazz.getSuperclass();

            for (String str : params) {
                try {
                    Field field = null;
                    try {
                        field = clazz.getDeclaredField(str);
                    } catch (NoSuchFieldException e) {
                        try {
                            field = superclass.getDeclaredField(str);
                        } catch (NoSuchFieldException e1) {
                            continue;
                        }
                    }

                    field.setAccessible(true);

                    Object value = field.get(obj);
                    if (value == null || value.equals("")) {
                        throw new ByteException(1009, str);
                    }

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 检查对象的参数不为null，
     * 当参数为null，则抛出ByteException异常
     *
     * @param
     * @return
     */
    public static void checkParamNotNull(Object obj, String... params) throws ByteException {

        if (params != null && params.length > 0) {

            Class<?> clazz = obj.getClass();
            Class<?> superclass = clazz.getSuperclass();

            for (String str : params) {
                try {
                    Field field = null;
                    try {
                        field = clazz.getDeclaredField(str);
                    } catch (NoSuchFieldException e) {
                        try {
                            field = superclass.getDeclaredField(str);
                        } catch (NoSuchFieldException e1) {
                            continue;
                        }
                    }

                    field.setAccessible(true);

                    Object value = field.get(obj);
                    if (value == null) {
                        throw new ByteException(1009, str);
                    }

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 当对象的params参数全部为null，则抛出ByteException异常
     *
     * @param
     * @return
     */
    public static void checkOrParamNotNull(Object obj, String... params) throws ByteException {

        if (params != null && params.length > 0) {

            Class<?> clazz = obj.getClass();
            Class<?> superclass = clazz.getSuperclass();

            for (String str : params) {
                try {
                    Field field = null;
                    try {
                        field = clazz.getDeclaredField(str);
                    } catch (NoSuchFieldException e) {
                        try {
                            field = superclass.getDeclaredField(str);
                        } catch (NoSuchFieldException e1) {
                            continue;
                        }
                    }

                    field.setAccessible(true);

                    Object value = field.get(obj);
                    if (value != null) {
                        return;
                    }

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            throw new ByteException(1009, Arrays.asList(params));
        }
    }

    /**
     * 当对象的params参数全部为null或""，则抛出ByteException异常
     *
     * @param
     * @return
     */
    public static void checkOrParamNotNullAndNotEmpty(Object obj, String... params) throws ByteException {

        if (params != null && params.length > 0) {

            Class<?> clazz = obj.getClass();
            Class<?> superclass = clazz.getSuperclass();

            for (String str : params) {
                try {
                    Field field = null;
                    try {
                        field = clazz.getDeclaredField(str);
                    } catch (NoSuchFieldException e) {
                        try {
                            field = superclass.getDeclaredField(str);
                        } catch (NoSuchFieldException e1) {
                            continue;
                        }
                    }

                    field.setAccessible(true);

                    Object value = field.get(obj);
                    if (value != null && !value.equals("")) {
                        return;
                    }

                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            throw new ByteException(1009, Arrays.asList(params));
        }
    }

    /**
     * 将对象的params参数（除了基本数据类型）设置为null
     *
     * @param
     * @return
     */
    public static void setParamNull(Object obj, String... params) {

        if (params == null || params.length == 0) {
            return ;
        }

        Class<?> clazz = obj.getClass();
        Class<?> superclass = clazz.getSuperclass();

        for (String str : params) {
            Field field = null;
            try {
                field = clazz.getDeclaredField(str);
            } catch (NoSuchFieldException e) {
                try {
                    field = superclass.getDeclaredField(str);
                } catch (NoSuchFieldException e1) {
                    continue;
                }
            }

            field.setAccessible(true);
            try {
                field.set(obj, null);
            } catch (IllegalAccessException e) {
            } catch (IllegalArgumentException e) {
            }
        }
    }

    /**
     * 将对象的所有参数（除了ignoreParams和基本数据类型）设置为null
     *
     * @param
     * @return
     */
    public static void setParamNullIgnore(Object obj, String... ignoreParams) {

        List<String> ignores = null;
        if (ignoreParams == null || ignoreParams.length == 0) {
            ignores = new ArrayList<>();
        } else {
            ignores = Arrays.asList(ignoreParams);
        }

        Class<?> clazz = obj.getClass();
        Class<?> superclass = clazz.getSuperclass();

        Field[] fields1 = clazz.getDeclaredFields();
        Field[] fields2 = superclass.getDeclaredFields();

        List<Field> fields = new ArrayList<>();
        fields.addAll(Arrays.asList(fields1));
        fields.addAll(Arrays.asList(fields2));

        for (Field field : fields) {

            String fieldName = field.getName();
            if (ignores.contains(fieldName)) {
                continue;
            }
            field.setAccessible(true);
            try {
                field.set(obj, null);
            } catch (IllegalAccessException e) {
            } catch (IllegalArgumentException e) {
            }
        }
    }
}
