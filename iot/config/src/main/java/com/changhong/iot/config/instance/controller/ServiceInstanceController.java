package com.changhong.iot.config.instance.controller;

import com.changhong.iot.config.base.dao.BaseMongoDaoImpl;
import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.common.ServerResponse;
import com.changhong.iot.config.instance.entity.ServiceInstances;
import com.changhong.iot.config.instance.service.InstanceService;
import com.changhong.iot.config.instance.service.impl.InstanceServiceImpl;
import com.changhong.iot.config.searchdto.Instancefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.EmptyUtil;
import com.changhong.iot.config.util.JsonUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api-eoms/service/instances")
public class ServiceInstanceController {

	public static final Logger LOGGER = LoggerFactory.getLogger(ServiceInstanceController.class);
	
	@Resource
	private InstanceService instanceService;



	@RequestMapping(value="/list", method=RequestMethod.GET)
	@ResponseBody
	public ServerResponse getServiceList(@RequestParam int start, @RequestParam int count, HttpServletRequest request, String filter, String sort) throws ByteException {

		Instancefilter instancefilter = JsonUtil.string2Obj(filter, Instancefilter.class);
		Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);

		PageModel pageModel = instanceService.getServiceList(start, count, instancefilter, sortEntity);

		return ServerResponse.createBySuccess(pageModel);
	}
	
	@RequestMapping(value="/add", method=RequestMethod.POST)
	@ResponseBody
	public ServerResponse saveInstance(@RequestBody ServiceInstances serviceInstance, HttpServletRequest request) {


        ServiceInstances query = instanceService.query(serviceInstance);
        if(query!=null){
            return ServerResponse.createByErrorMessage("地址已存在，请重新输入!");
        }

		if (EmptyUtil.isEmpty(serviceInstance.getServiceHost())) {
			return ServerResponse.createByError(1009, "serviceHost");
		}
		if (EmptyUtil.isEmpty(serviceInstance.getServiceName())) {
			return ServerResponse.createByError(1009, "serviceName");
		}
		if (serviceInstance.getServicePort() == null) {
			serviceInstance.setServicePort(80);
		} else if (serviceInstance.getServicePort() < 0 || serviceInstance.getServicePort() > 65535) {
			return ServerResponse.createByError(1004);
		}



        instanceService.saveInstance(serviceInstance);

		return ServerResponse.createBySuccess(serviceInstance);

	}
	
	@RequestMapping(value="/upd", method=RequestMethod.POST)
	@ResponseBody
	public ServerResponse updateInstance(@RequestBody ServiceInstances serviceInstance) {

		if (EmptyUtil.isEmpty(serviceInstance.getId())) {
			return ServerResponse.createByError(1009, "id");
		}

		if (serviceInstance.getServicePort() != null) {
			if (serviceInstance.getServicePort() < 0 || serviceInstance.getServicePort() > 65535) {
				return ServerResponse.createByError(1004);
			}
		}

		instanceService.updateInstance(serviceInstance);
			
		return ServerResponse.createBySuccess();
			
	}
	
	@RequestMapping(value="/del", method=RequestMethod.GET)
	@ResponseBody
	public ServerResponse instanceDel(@RequestParam String id, HttpServletRequest request) {

		instanceService.instanceDel(id);

		return ServerResponse.createBySuccessMessage("删除成功！");
	}

	@GetMapping("/opt")
	public ServerResponse opt() {

		JSONArray array = new JSONArray();
		JSONObject obj = null;

		List<ServiceInstances> all = instanceService.findAll();
		for (ServiceInstances entity : all) {
			obj = new JSONObject();
			obj.put("id", entity.getId());
			obj.put("serviceName", entity.getServiceName());

			array.add(obj);
		}

		return ServerResponse.createBySuccess(array);
	}

	@PostMapping("/updStatus")
	public ServerResponse updStatus(@RequestBody ServiceInstances serviceInstances) {

		if (EmptyUtil.isEmpty(serviceInstances.getId())) {
			return ServerResponse.createByError(1009, "id");
		}
		if (serviceInstances.getServiceValue() == null) {
			return ServerResponse.createByError(1009, "serviceValue");
		}

		instanceService.updStatus(serviceInstances.getId(), serviceInstances.getServiceValue());

		return ServerResponse.createBySuccessMessage("操作成功！");
	}

}
