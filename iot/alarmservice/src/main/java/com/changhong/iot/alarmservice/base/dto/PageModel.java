package com.changhong.iot.alarmservice.base.dto;

import java.io.Serializable;
import java.util.List;

/**
 * 分页模型类
 * ClassName: PageModel
 * Description:
 * 
 * @author don
 * @date 2018年3月12日
 */
public class PageModel<T> implements Serializable {
	/** serialVersionUID */
	private static final long serialVersionUID = 1L;

	/** 默认页码 */
	public static final int DEFAULT_PAGENO = 1;
	/** 默认页容量 */
	public static final int DEFAULT_PAGESIZE = 20;

	/** 基础字段 */

	// 当前页码
	private int pageNo;
	// 页容量
	private int pageSize;
	// 总记录
	private int totalCount;
	// 总页数
	private int totalPage;
	// 数据集合
	private List<T> value;
	
	/**
	 * start是索引值  从0开始
	 * start、count与page之间的转换
	 * 把start索引值转换为pageNo
	 * 
	 * 带有索引、每页容量的方法
	 */
	public static PageModel indexToPage(int start,int count){
		int newPage= (start/count)+1;
		return new PageModel(newPage,count);
	}
	
	/**
	 * 带有索引、每页容量、总记录数的方法
	 */
	public static PageModel indexToPage(int start,int count,int totalCount){
		int newPage= (start/count)+1;
		return new PageModel(newPage,count,totalCount);
	}
	
/*    public static <T> ServerResponse<T> createBySuccess(){
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode());
    }*/

	/** 构造方法 */

	/**
	 * 默认，初始化pageNo=1，pageSize=20
	 */
	public PageModel() {
		// 一定要先设置页容量
		this.setPageSize(DEFAULT_PAGESIZE);
		this.setPageNo(DEFAULT_PAGENO);
	}

	/**
	 * 带有页码，页容量参数的构造函数
	 * 
	 * @param pageNo
	 * @param pageSize
	 */
	public PageModel(int pageNo, int pageSize) {
		// 一定要先设置页容量
		this.setPageSize(pageSize);
		this.setPageNo(pageNo);
	}
	
	/**
	 * 带有当前页数、每页容量、总记录数的构造器
	 */
	public PageModel(int pageNo, int pageSize,int totalCount) {
		// 一定要先设置页容量
		this.setPageSize(pageSize);
		this.setPageNo(pageNo);
		this.setTotalCount(totalCount);
	}

	/**
	 * 带有页码，页容量，总记录，数据集合参数的构造函数
	 * 
	 * @param pageNo
	 *            The current pageNo
	 * @param pageSize
	 *            The page's size
	 * @param totalCount
	 *            The total record count
	 * @param list
	 *            The record list
	 */
	public PageModel(int pageNo, int pageSize, int totalCount, List<T> list) {
		// 一定要先设置页容量
		this.setPageSize(pageSize);
		this.setPageNo(pageNo);
		this.setTotalCount(totalCount);
		this.setValue(list);
	}

	public int getPageNo() {
		return this.pageNo;
	}

	public void setPageNo(int pageNo) {
		if (pageNo <= 0) {
			this.pageNo = DEFAULT_PAGENO;
		} else {
			this.pageNo = pageNo;
		}
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		if (pageSize <= 0) {
			this.pageSize = DEFAULT_PAGESIZE;
		} else {
			this.pageSize = pageSize;
		}
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		if (totalCount <= 0) {
			this.totalCount = 0;
		} else {
			this.totalCount = totalCount;
		}
	}

	public int getTotalPage() {
		this.totalPage = (getTotalCount() - 1) / getPageSize() + 1;
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		if (totalPage < 0) {
			this.totalPage = 0;
		} else {
			this.totalPage = totalPage;
		}
	}

	public List<T> getValue() {
		return value;
	}

	public void setValue(List<T> list) {
		this.value = list;
	}

	/**
	 * 是否是第一页
	 * 
	 * @return 是否
	 */
	public boolean isFirstPage() {
		return this.pageNo <= 1;
	}

	/**
	 * 是否是最后一页
	 * 
	 * @return 是否
	 */
	public boolean isLastPage() {

		return this.pageNo >= this.getTotalPage();
	}

	/**
	 * 下一页
	 * 
	 * @return 下一页页码
	 */
	public int getNextPage() {
		if (this.isLastPage()) {
			return this.getTotalPage();
		}
		return this.pageNo + 1;
	}

	/**
	 * 上一页
	 * 
	 * @return 上一页页码
	 */
	public int getPrevPage() {
		if (this.pageNo <= 1) {
			return 1;
		}
		return this.pageNo - 1;
	}

	/**
	 * 获取第一条记录位置，用于数据库查询时设置的第一条记录
	 * 
	 * @return
	 */
	public int getFirstResult() {
		return (this.getPageNo() - 1) * this.getPageSize();
	}

}
