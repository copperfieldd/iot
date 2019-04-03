package com.changhong.iot.pms.web.dto;

import com.changhong.iot.pms.model.bean.UserBean;
import lombok.Getter;
import lombok.Setter;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;

/**
 * Created by guiqijiang on 10/30/18.
 */
@Getter
@Setter
public class BeanRqtDTO {

    //开始
    private Integer start = 0;

    //数据大小
    private Integer count = 10;

    //数据签名
    private String sign;

    //随机字符串
    private String random;

    //用户
    private UserBean userBean;

    public static UserBean getUser(HttpServletRequest request) {
        UserBean userBean = (UserBean) request.getAttribute("userBean");
        return userBean;
    }
}
