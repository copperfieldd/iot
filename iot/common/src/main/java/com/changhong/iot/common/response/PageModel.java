package com.changhong.iot.common.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
public class PageModel<T> implements Serializable {

    public PageModel() {
    }

    public PageModel(long totalCount, List<T> t) {
        this.setTotalCount(totalCount);
        this.setList(t);
    }

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;

    /**
     * 默认页码
     */
    public static final int DEFAULT_PAGENO = 1;
    /**
     * 默认页容量
     */
    public static final int DEFAULT_PAGESIZE = 20;

    // 总记录
    private long totalCount = 0l;
    // 数据集合
    private List<T> list;

}
