package com.changhong.iot.config.instance.controller;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.common.ServerResponse;
import com.changhong.iot.config.instance.dto.PobeListDto;
import com.changhong.iot.config.instance.entity.ServiceStats;
import com.changhong.iot.config.instance.service.InstanceService;
import com.changhong.iot.config.instance.service.InstanceStateService;
import com.changhong.iot.config.instance.service.LatestService;
import com.changhong.iot.config.instance.service.PobeService;
import com.changhong.iot.config.searchdto.ServiceStatefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.*;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/state")
public class ServiceStateController {

	@Resource
	private InstanceStateService instanceStateService;

	@Resource
	private InstanceService instanceService;

	@Resource
	private LatestService latestService;

	@GetMapping("/list")
		public ServerResponse list(@RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

		PageModel pageModel = instanceService.getServiceList(start, count, null, null);

		List list = pageModel.getList();

		try {
			list = EntityUtil.entityListToDtoList(list, PobeListDto.class);

			pageModel.setList(latestService.pack(list, 1));
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		}

		return ServerResponse.createBySuccess(pageModel);


//		ServiceStatefilter serviceStatefilter = JsonUtil.string2Obj(filter, ServiceStatefilter.class);
//		Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);
//
//		PageModel page = pobeService.page(start, count, serviceStatefilter, sortEntity);
//
//		return ServerResponse.createBySuccess(page);
	}

	@RequestMapping(value = "/upd", method = RequestMethod.POST)
	@ResponseBody
	public ServerResponse updateInstanceState(@RequestBody ServiceStats serviceStats) throws ByteException {

		ParamUtil.checkOrParamNotNull(serviceStats, "cycle", "failureNumber");

		instanceStateService.updAll(serviceStats.getCycle(), serviceStats.getFailureNumber());

		return ServerResponse.createBySuccessMessage("操作成功！");

	}

	@GetMapping("/item")
	public ServerResponse item() {

		Map<String, Object> map = new HashMap<>();

		ServiceStats entity = instanceStateService.findOne();

		if (entity == null) {
			map.put("cycle", 0);
			map.put("failureNumber", 0);
		} else {
			map.put("cycle", entity.getCycle());
			map.put("failureNumber", entity.getFailureNumber());
		}

		return ServerResponse.createBySuccess(map);
	}

}
