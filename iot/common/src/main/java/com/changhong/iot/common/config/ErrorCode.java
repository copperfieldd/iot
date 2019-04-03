package com.changhong.iot.common.config;

/**
 * Created by liangchen on 2017/8/2.
 */
public class ErrorCode {
    //请求ok
    public static final int SUCCESS = 0;



    //却少参数
    public static final int MISS_PARAM = 2;

    //OPAQUE计算错误
    public static final int OPAQUE_ERROR = 3;

    //写入数据失败
    public static final int WRITE_DATA_ERROR = 4;

    //登录失败
    public static final int LOGIN_FAILED = 5;

    //没有登录
    public static final int NOT_LOGIN = 6;



    //验证码不匹配
    public static final int PHONE_CODE_NOT_MATCH = 8;

    //没有查询到数据
    public static final int QUERY_EMPTY = 9;

    //需要验证码登录
    public static final int NEED_CODE = 10;

    //服务端发生异常
    public static final int SERVER_EXCEPTION = 1001;

    //参数错误
    public static final int PARAMETER_ERROR = 1004;

    //空数据异常
    public static final int NULL_ERROR = 1009;

    //参数被占用
    public static final int PARAM_ERROR = 1010;

    //数据未找到
    public static final int NULL_ERROR_DATA = 1012;

    //禁止删除
    public static final int REFERENECD = 1013;




}
