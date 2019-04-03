package com.changhong.iot.pms.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by guiqijiang on 10/29/18.
 */
@Setter
@Getter
public class UserBean {

    //当前用户ID
    private String appUserId;

    private String lesseeId;

    //当前用户类型
    private UserType userType;

    public void setUserType(int type) {
        int len = UserType.values().length;
        if (type < len) {
            this.userType = UserType.values()[type];
        }
    }

    public enum UserType {
        APP, LESSEE, SYS
    }
}
