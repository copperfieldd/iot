package com.changhong.iot.audit.util;

import org.apache.shiro.crypto.hash.Md5Hash;

public class Encrypt {
	/*
	 * 散列算法一般用于生成数据的摘要信息，是一种不可逆的算法，一般适合存储密码之类的数据，
	 * 常见的散列算法如MD5、SHA等。一般进行散列时最好提供一个salt（盐），比如加密密码“admin”，
	 * 产生的散列值是“21232f297a57a5a743894a0e4a801fc3”，
	 * 可以到一些md5解密网站很容易的通过散列值得到密码“admin”，
	 * 即如果直接对密码进行散列相对来说破解更容易，此时我们可以加一些只有系统知道的干扰数据，
	 * 如用户名和ID（即盐）；这样散列的对象是“密码+用户名+ID”，这样生成的散列值相对来说更难破解。
	 */
	
	//高强度加密算法,不可逆
	/**
	 * salt	当前用户的用户名做盐
	 * @param password
	 * @param salt
	 * @return
	 */
	public static String md5(String password, String salt){
		//password:填写密码
		//salt:填写用户名,把用户名当做salt
		//再加一个数字2,不容易破解
		return new Md5Hash(password,salt,2).toString();
	}

	//haha    58f796714d1ba4289659e04f7811b526
	//admin   3ef7164d1f6167cb9f2658c07d3c2f0a
	
	/*
	 * zhangsan  3ef7164d1f6167cb9f2658c07d3c2f0a
	 * zhangsi   218a349f970d35db19ea43e8aeae61de
	 * zhangwu  	e494d459e4d50fcdf0a0e344fef05e87
	 * 
	 * fanjiemei	6a21ad53423a0551fac81128383792b2
	 * yangxiaodong		4d9d6fdd8a8cb8ad4370f7763920f5d9
	 * fanguangxiong	31696e1266a698344b60668777165d51
	 * wangjiaqi		c56ba2b6b612c47be0c10bf97d8cfe8b
	 * wangling		6e31216dd90b3fa28bd1f26ee157ddbf
	 * zhangjie		95c4f36111040ac5becdf2c168b33edc
	 * wangkaineng		c7ce29746b99f7a73a5f822e823981d5
	 * dengchao		e15788df614e2a26d5376e10082101bb
	 * meichaofeng		042b767edcd284f42b34f2c06ffcc9cd
	 * 
	 * admin		3ef7164d1f6167cb9f2658c07d3c2f0a
	 */
	public static void main(String[] args) {
		System.out.println(new Md5Hash("admin","admin",2).toString());
	}
	
}
