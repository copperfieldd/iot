package com.changhong.iot.config.configfile.controller;

import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.common.ServerResponse;
import com.changhong.iot.config.configfile.entity.ConfigFiles;
import com.changhong.iot.config.configfile.service.ConfigFileService;
import com.changhong.iot.config.searchdto.ConfigFilefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.EmptyUtil;
import com.changhong.iot.config.util.JsonUtil;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Map;

@RestController
@RequestMapping("/api-eoms/config/file")
public class ConfigFileController {

	public static final Logger LOGGER = LoggerFactory.getLogger(ConfigFileController.class);
	
	@Resource
	private ConfigFileService configFileService;

	@RequestMapping(value="/list", method= RequestMethod.GET)
	@ResponseBody
	public ServerResponse getConfigList(HttpServletRequest request, @RequestParam int start, @RequestParam int count, String filter, String sort) throws ByteException {

		ConfigFilefilter configFilefilter = JsonUtil.string2Obj(filter, ConfigFilefilter.class);
		Sort sortEntity = JsonUtil.string2Obj(sort, Sort.class);
		try {
			
			Map<String, Object> result = configFileService.getConfigList(start, count, configFilefilter, sortEntity);

			return ServerResponse.createBySuccess(result.get("data"));

		} catch (EomsException e) {
			return ServerResponse.createByError(e.code, e.getMessage());
		}
	}
	
	@RequestMapping(value="/add", method=RequestMethod.POST)
	@ResponseBody
	public ServerResponse getConfigAdd(@RequestBody String body, HttpServletRequest request) {

		try {

			JSONObject jsonObject = JSONObject.fromObject(body);

			String id = jsonObject.optString("id");
			String content = jsonObject.optString("content");
			String fileName = null;
			String serviceName = null;

			if (!jsonObject.has("fileName")) {
				return ServerResponse.createBySuccessMessage("fileName不能为空！");
			}
			if (!jsonObject.has("serviceName")) {
				return ServerResponse.createBySuccessMessage("serviceName不能为空！");
			}

			fileName = jsonObject.optString("fileName");
			serviceName = jsonObject.optString("serviceName");

			if (EmptyUtil.isEmpty(id) && EmptyUtil.isEmpty(content)) {
				return ServerResponse.createByError(1009, "id or content");
			}

			Map<String, Object> result = configFileService.saveConfigAdd(fileName, serviceName, id, content);

			return ServerResponse.createBySuccess(result.get("data"));

		} catch (EomsException e) {
			return ServerResponse.createByError(e.code, e.getMessage());
		} catch (Exception e) {
			return ServerResponse.createByError(1001);
		}
	}

	@RequestMapping(value="/upd", method=RequestMethod.POST)
	@ResponseBody
	public ServerResponse configUpd(@RequestBody String content, HttpServletRequest request) {

		try {

			JSONObject object = JSONObject.fromObject(content);

			if (EmptyUtil.isEmpty(object.optString("id"))) {
				return ServerResponse.createByError(1009, "id");
			}

			configFileService.updConifgContent(object.optString("id"), object.optString("content"), object.optString("fileName"), object.optString("serviceName"));

			return ServerResponse.createBySuccess();

		} catch (EomsException e) {
			return ServerResponse.createByError(e.code, e.getMessage());
		}
	}


	@RequestMapping(value="/del", method=RequestMethod.GET)
	@ResponseBody
	public ServerResponse configFileDel(@RequestParam String id, HttpServletRequest request) {
		try {
			
			Map<String, Object> result = configFileService.configFileDel(id);

			return ServerResponse.createBySuccess(result.get("data"));
			
		} catch (EomsException e) {
			return ServerResponse.createByError(e.code, e.getMessage());
		} catch (Exception e) {
			return ServerResponse.createByError(1001);
		}
	}

	@RequestMapping(value="/item", method=RequestMethod.GET)
	@ResponseBody
	public ServerResponse configFileItem(@RequestParam String id, HttpServletRequest request, HttpServletResponse response) {
		InputStream in = null;
		try {

			in = configFileService.getFileInputStreamById(id);

			if (in != null){
				ConfigFiles configFiles = configFileService.findFileEntity(id);

				StringBuilder sb = new StringBuilder();
				String line;

				BufferedReader br = new BufferedReader(new InputStreamReader(in, "utf-8"));
				while ((line = br.readLine()) != null) {
					sb.append(line).append("\n");
				}

				JSONObject object = new JSONObject();
				object.put("id", configFiles.getId());
				object.put("serviceName", configFiles.getServiceName());
				object.put("fileName", configFiles.getConfigFile());
				object.put("content", sb.toString());

				in.close();
				br.close();

				return ServerResponse.createBySuccess(object);
			} else {
				return ServerResponse.createByError(1012);
			}

		} catch (IOException e) {
			return ServerResponse.createByError(1001);
		}
	}

	@RequestMapping(value="/download", method=RequestMethod.GET)
	@ResponseBody
	public ServerResponse configFileDownload(@RequestParam String id, HttpServletRequest request, HttpServletResponse response) {
		InputStream in = null;
		OutputStream out = null;
		try {

			in = configFileService.getFileInputStreamById(id);

			if (in != null){
				ConfigFiles configFiles = configFileService.findFileEntity(id);

				response.addHeader("Content-Disposition", "attachment;fileName=" + new String(configFiles.getConfigFile().getBytes("utf-8"),"iso-8859-1"));//iso-8859-1
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
				return ServerResponse.createByError(1012);
			}

		} catch (IOException e) {
			return ServerResponse.createByError(1001);
		}
		return null;
	}

}
