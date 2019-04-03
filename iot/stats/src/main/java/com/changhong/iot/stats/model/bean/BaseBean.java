package com.changhong.iot.stats.model.bean;

import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.HashMap;

/**
 * @Author: jiangguiqi@aliyun.com
 * @Description:
 * @Date: Created in 下午7:57 18-1-30
 */
@Setter
@Getter
public class BaseBean {

    //状态
    public enum State {
        NORMAL, //正常
        DISABLE,//禁用
        DELETE;  //删除

        public static State get(int i) {
            if (i < 0 || i >= State.values().length) {
                return null;
            }
            return State.values()[i];
        }
    }

    public static final String FIELD_ID = "_id";
    @Id
    @Field(FIELD_ID)
    private String id;

    //创建时间
    public static final String FIELD_CREATE_TIME = "create_time";
    @Field(FIELD_CREATE_TIME)
    private long cdt;

    //修改时间
    public static final String FIELD_UPDATE_TIME = "update_time";
    @Field(FIELD_UPDATE_TIME)
    private long udt;

    //应用状态 0正常1禁用2删除
    public static final String FIELD_STATE = "state";
    @Field("state")
    private int state = State.NORMAL.ordinal();

    public void setState(BaseBean.State state) {
        this.state = state.ordinal();
    }
}
