package cn.bytecloud.iot.eoms.instance.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import cn.bytecloud.iot.eoms.base.dto.FailResponse;
import cn.bytecloud.iot.eoms.base.dto.Response;
import cn.bytecloud.iot.eoms.base.dto.SuccessResponse;
import cn.bytecloud.iot.eoms.config.entity.ConfigFiles;
import cn.bytecloud.iot.eoms.config.service.ConfigFileService;
import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.instance.dto.ServiceInstanceDto;
import cn.bytecloud.iot.eoms.instance.service.InstanceService;
import net.sf.json.JSONObject;

@RestController
@RequestMapping("/api-eoms/service/instances")
public class ServiceInstanceController {

	public static final Logger LOGGER = LoggerFactory.getLogger(ServiceInstanceController.class);
	
	@Resource
	private InstanceService instanceService;

	@RequestMapping(value="/list", method=RequestMethod.GET)
	@ResponseBody
	public Response getServiceList(HttpServletRequest request) {
		Response response = null;
		String start = request.getParameter("start");
		String count = request.getParameter("count");
		try {
			
			Map<String, Object> result = instanceService.getServiceList(start, count);

			return response = new SuccessResponse().setMsg("查询成功").setValue(result.get("data"));

		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			return response.setMsg("查询失败");
		}
	}
	
	@RequestMapping(value="/add", method=RequestMethod.POST)
	@ResponseBody
	public Response saveInstance(@RequestBody JSONObject json,  HttpServletRequest request) {
		Response response = null;
		ServiceInstanceDto serviceInstanceDto = (ServiceInstanceDto) json.toBean(json, ServiceInstanceDto.class);
		try {
			
			Map<String, Object> result = instanceService.saveInstance(serviceInstanceDto);
			
			return response = new SuccessResponse().setMsg("保存成功");
			
		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			LOGGER.error(e.getMessage());
			return response.setMsg("保存失败");
		}
	}
	
	@RequestMapping(value="/upd", method=RequestMethod.POST)
	@ResponseBody
	public Response updateInstance(@RequestBody JSONObject json,  HttpServletRequest request) {
		Response response = null;
		ServiceInstanceDto serviceInstanceDto = (ServiceInstanceDto) json.toBean(json, ServiceInstanceDto.class);
		try {
			
			Map<String, Object> result = instanceService.saveInstance(serviceInstanceDto);
			
			return response = new SuccessResponse().setMsg("保存成功");
			
		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			LOGGER.error(e.getMessage());
			return response.setMsg("保存失败");
		}
	}
	
	@RequestMapping(value="/del", method=RequestMethod.GET)
	@ResponseBody
	public Response instanceDel(HttpServletRequest request) {
		Response response = null;
		String serviceId = request.getParameter("id");
		try {
			
			Map<String, Object> result = instanceService.instanceDel(serviceId);
			
			return response = new SuccessResponse().setMsg("删除成功！");
			
		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			return response.setMsg("删除失败！");
		}
	}
	

}
