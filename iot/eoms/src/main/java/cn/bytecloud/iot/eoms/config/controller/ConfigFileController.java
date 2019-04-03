package cn.bytecloud.iot.eoms.config.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@RestController
@RequestMapping("/api-eoms/config/file")
public class ConfigFileController {

	public static final Logger LOGGER = LoggerFactory.getLogger(ConfigFileController.class);
	
	@Resource
	private ConfigFileService configFileService;

	@RequestMapping(value="/list", method=RequestMethod.GET)
	@ResponseBody
	public Response getConfigList(HttpServletRequest request) {
		Response response = null;
		String start = request.getParameter("start");
		String count = request.getParameter("count");
		try {
			
			Map<String, Object> result = configFileService.getConfigList(start, count);

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
	public Response getConfigAdd(String fileId, String serviceName, @RequestParam("file")MultipartFile file, HttpServletRequest request) {
		Response response = null;
		
		try {
			
			Map<String, Object> result = configFileService.saveConfigAdd(file.getInputStream(), file.getOriginalFilename(), serviceName, fileId);
			
			return response = new SuccessResponse().setMsg("上传成功！").setValue(result.get("data"));
			
		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			LOGGER.error(e.getMessage());
			return response.setMsg("文件上传异常！");
		}
	}
	
	@RequestMapping(value="/del", method=RequestMethod.GET)
	@ResponseBody
	public Response configFileDel(HttpServletRequest request) {
		Response response = null;
		String fileId = request.getParameter("id");
		try {
			
			Map<String, Object> result = configFileService.configFileDel(fileId);
			
			return response = new SuccessResponse().setMsg("上传成功！").setValue(result.get("data"));
			
		} catch (EomsException e) {
			response = new FailResponse();
			return response.setMsg(e.getMessage());
		} catch (Exception e) {
			response = new FailResponse();
			return response.setMsg("文件上传异常！");
		}
	}
	
	@RequestMapping(value="/download", method=RequestMethod.GET)
	@ResponseBody
	public Response configFileDownload(HttpServletRequest request, HttpServletResponse response) {
		Response result = null;
		InputStream in = null;
		OutputStream out = null;
		String id = request.getParameter("id");
		try {

			in = configFileService.getFileInputStreamById(id);

			if (in != null){
				ConfigFiles configFiles = configFileService.findFileEntity(id);

				response.addHeader("Content-Disposition", "attachment;fileName=" + new String(configFiles.getConfigFile().getBytes(),"iso-8859-1"));//iso-8859-1
				response.setContentType("multipart/form-data");

				out = response.getOutputStream();

				byte b[] = new byte[1024];
				while(in.read(b) != -1) {
					out.write(b);
				}

				in.close();
				out.flush();
				out.close();
			} else {
				return result = new FailResponse().setMsg("资源不存在或已被删除！");
			}

		} catch (IOException e) {
			return result = new FailResponse().setMsg("获取资源异常！");
		}
		return null;
	}

}
