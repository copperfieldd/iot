package com.changhong.iot.config;

/**
 * 版权 @Copyright: 2018 www.bjbths.com Inc. All rights reserved.
 * 文件名称： ConfigValue
 * 包名：com.changhong.iot.config
 * 创建人：@author wangkn@bjbths.com
 * 创建时间：2018/05/20 16:42
 * 修改人：wangkn@bjbths.com
 * 修改时间：2018/05/20 16:42
 * 修改备注：
 */
public class ConfigValue {

    /** 已删除*/
    public static final int DELETE = 1;

    /** 未删除*/
    public static final int NOT_DELETE = 0;

    /** 排序步长*/
    public static final int SORT_STEP_LENGTH = 50;

    /** 用户的角色类型，缺省类型*/
    public static final int REFTYPE_DEFAULT = 0;

    /** 用户的角色类型，自定义类型*/
    public static final int REFTYPE_CUSTOM = 1;

    /** 表示是组织机构*/
    public static final int UNIT = 1;

    /** 表示是用户*/
    public static final int USER = 0;

    /** 顶级pid*/
    public static final String TOP_ID = "0";

    /** 公司*/
    public static final Integer CORP = 1;

    /** 公开接口*/
    public static final Integer PUBLIC_API = 0;

    /** 私有接口*/
    public static final Integer PRIVATE_API = 1;

    /** 平台管理员 */
    public static final Integer PLATFORM_MANAGER = 0;

    /** 租户管理员 */
    public static final Integer TENANT_MANAGER = 1;

    /** 企业用户 */
    public static final Integer BUSINESS_USER = 2;

    /** 应用管理员 */
    public static final Integer APPLICATION_MANAGER = 3;

    /** 应用用户 */
    public static final Integer APPLICATION_USER = 4;

    /** 终端用户 */
    public static final Integer END_USER = 5;

}
