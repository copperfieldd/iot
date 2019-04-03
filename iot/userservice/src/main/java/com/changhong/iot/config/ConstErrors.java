package com.changhong.iot.config;

public class ConstErrors {

	public static final Integer C_EID_UNLOGIN = 10000;
	public static final String C_MSG_UNLOGIN = "请登录！";
	public static final String C_MSG_UNVALID = "身份失效，请重亲登录！";

	public static final Integer C_EID_UNPERMISS = 10001;
	public static final String C_MSG_UNPERMISS = "无相关权限！";

	public static final Integer C_EID_ERROR = 10500;
	public static final String C_MSG_ERROR = "数据异常，请联系管理员！";

	public static final Integer C_EID_UNMENUFIND = 10101;
	public static final String C_MSG_UNMENUFIND = "该菜单不存在！";

	public static final Integer C_EID_JSONERROR = 10102;
	public static final String C_MSG_JSONERROR = "JSON数据处理错误！";

	public static final Integer C_EID_CONTENT = 10103;
	public static final String C_MSG_CONTENT = "内容不能为空！";

	public static final Integer C_EID_NODELETEGRADE = 10136;
	public static final String C_MSG_NODELETEGRADE = "该等级还有租户引用，不能删除！";

	public static final Integer C_EID_UNROLEFIND = 10105;
	public static final String C_MSG_UNROLEFIND = "该角色不存在！";

	public static final Integer C_EID_NOT_DELETE = 10106;
	public static final String C_MSG_NOT_DELETE = "不能删除！";

	public static final Integer C_EID_NOTUPDATE = 10107;
	public static final String C_MSG_NOTUPDATE = "不能修改！";

	public static final Integer C_EID_UNFIND = 10108;
	public static final String C_MSG_UNFIND = "未找到相关数据！";

	public static final Integer C_EID_NOTUPDATEDEFAULT = 10109;
	public static final String C_MSG_NOTUPDATEDEFAULT = "该角色为缺省角色，不能修改默认的用户或人员！";

	public static final Integer C_EID_CHILDRENNODE = 10134;
	public static final String C_MSG_CHILDRENNODE = "该租户组织机构下还有节点，不能删除！";

	public static final Integer C_EID_UNUNITFIND = 10105;
	public static final String C_MSG_UNUNITFIND = "该组织机构不存在！";

	public static final Integer C_EID_UNUSERFIND = 10108;
	public static final String C_MSG_UNUSERFIND = "该用户不存在！";

	public static final Integer C_EID_CHILDREN = 10132;
	public static final String C_MSG_CHILDREN = "该组织机构下还有节点，不能删除！";

	public static final Integer C_EID_TENANT = 10104;
	public static final String C_MSG_TENANT = "该等级绑定有租户，不能删除！";

	public static final Integer C_EID_WRONGPARAM = 10129;
	public static final String C_MSG_WRONGPARAM = "参数不正确！";

	public static final Integer C_EID_PASSWORD_LENGTH = 10130;
	public static final String C_MSG_PASSWORD_LENGTH = "密码至少包含数字、字母、特殊字符中的两种，并且长度不得小于8位！";

	public static final Integer C_EID_TOPUNIT = 10131;
	public static final String C_MSG_TOPUNIT = "顶级组织机构不可删除!";

	public static final Integer C_EID_CHILDRENTENANT = 10133;
	public static final String C_MSG_CHILDRENTENANT = "该租户下还有租户，不可删除！";

	public static final Integer C_EID_EXIST = 10135;
	public static final String C_MSG_EXIST = "该用户已存在！";

	public static final Integer C_EID_USRPWDNULL = 10201;
	public static final String C_MSG_USRPWDNULL = "用户名或密码不能为空！";

}
