package com.changhong.iot.base.dto;

import java.io.Serializable;
import java.util.ArrayList;
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

	private int totalCount;
	private List<T> list;

	public static PageModel indexToPage(int totalCount){
		return new PageModel(totalCount, new ArrayList<>());
	}

	public static PageModel indexToPage(List list){
		return new PageModel(0, list);
	}

	public static PageModel indexToPage(int totalCount, List list){
		return new PageModel(totalCount, list);
	}

	public PageModel(int totalCount, List list) {
		this.totalCount = totalCount;
		this.list = list;
	}

	public PageModel() {
		this.list = new ArrayList<>();
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

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}

}
