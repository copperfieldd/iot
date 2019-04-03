/**
 * Project Name:eoms
 * File Name:ConfigFileServiceImpl.java
 * Package Name:cn.bytecloud.iot.eoms.config.service.impl
 * Date:2018年5月31日上午10:32:54
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package cn.bytecloud.iot.eoms.config.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.ho.yaml.Yaml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.bytecloud.iot.eoms.base.dto.PageModel;
import cn.bytecloud.iot.eoms.config.dao.ConfigFileDao;
import cn.bytecloud.iot.eoms.config.dto.ConfigFileDto;
import cn.bytecloud.iot.eoms.config.entity.ConfigFiles;
import cn.bytecloud.iot.eoms.config.service.ConfigFileService;
import cn.bytecloud.iot.eoms.exception.EomsException;
import cn.bytecloud.iot.eoms.util.StringUtil;

/**
 * ClassName:ConfigFileServiceImpl <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年5月31日 上午10:32:54 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */
@Service
public class ConfigFileServiceImpl implements ConfigFileService{

	@Autowired
	private ConfigFileDao configFileDao;
	
	@Override
	public Map<String, Object> getConfigList(String start, String count) throws EomsException {
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		if(StringUtil.isEmpty(start) || StringUtil.isEmpty(count)){
			throw new EomsException("页码错误");
		}
		
		PageModel page = PageModel.indexToPage(Integer.valueOf(start), Integer.valueOf(count));
		
		PageModel pageFiles = configFileDao.pageAll(page.getPageNo(), Integer.valueOf(count));
		
		List<ConfigFiles> configFiles = pageFiles.getList();
		List<ConfigFileDto> configFileDtos = new ArrayList<ConfigFileDto>();
		
		for(ConfigFiles configFile : configFiles){
			ConfigFileDto configFileDto = new ConfigFileDto();
			configFileDto.setId(configFile.getId());
			configFileDto.setServiceName(configFile.getServiceName());
			configFileDto.setConfigFile(configFile.getConfigFile());
			configFileDtos.add(configFileDto);
		}
		
		pageFiles.setList(configFileDtos);
		result.put("data", pageFiles);
		return result;
	}

	@Override
	public Map<String, Object> saveConfigAdd(InputStream in, String fileName, String serviceName, String fileId) throws EomsException, Exception {
		Map<String, Object> result = new HashMap<String, Object>();

        OutputStream out = null;
        ConfigFiles configFiles = null;

        if (StringUtil.isEmpty(fileName)) {
            throw new EomsException("请输入文件名");
        }
        if(StringUtil.isNotEmpty(fileId)){
        	in = getFileInputStreamById(fileId);
        }
        try {
                String path = System.getProperty("user.dir") + "/data/configserver";
                
                String saveName = serviceName + "-" +fileName + ".yml";

                File file = new File(path, saveName);
                // 判断是否存在该文件
                if(file.exists()){
                	throw new EomsException("文件已经存在");
                }
                
                configFiles = new ConfigFiles();
                configFiles.setServiceName(serviceName);
                configFiles.setConfigFile(fileName);
                configFiles.setIsDelete(0);
                configFiles.setCreateTime(new Date());
                configFiles.setUpdateTime(new Date());
                
                configFileDao.save(configFiles);

                // 判断路径是否存在,如果不存在就创建文件路径
                if (!file.getParentFile().exists()) {
                    file.getParentFile().mkdirs();
                }

                // 将上传文件保存到一个目标文件当中
                out = new FileOutputStream(file);

                byte b[] = new byte[1024];

                while (in.read(b) != -1) {
                    out.write(b);
                }
                out.flush();

            
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException e){
            }
        }
        result.put("msg", "保存成功");
		return result;
	}

	@Override
	public Map<String, Object> configFileDel(String fileId) throws EomsException, Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		ConfigFiles configFile = configFileDao.find(fileId);
        if (configFile != null) {

            String path = System.getProperty("user.dir") + "/data/configserver";
            
            String saveName = configFile.getServiceName() + "-" + configFile.getConfigFile() + ".yml";
            
            File filepath = new File(path, saveName);
            // 判断文件是否存在
            if (filepath.exists()) {
                filepath.delete();
            }
            configFileDao.delete(fileId);
        } else {
            throw new EomsException("删除失败");
        }
        result.put("msg", "删除成功");
        return result;
	}

	@Override
	public InputStream getFileInputStreamById(String id) {


        InputStream in = null;

        ConfigFiles configFile = configFileDao.find(id);
        if (configFile != null) {

        	String path = System.getProperty("user.dir") + "/data/configserver";
            
            String saveName = configFile.getServiceName() + "-" + configFile.getConfigFile() + ".yml";
            
            File filepath = new File(path, saveName);
            // 判断文件是否存在
            if (filepath.exists()) {
                try {
                    in = new FileInputStream(filepath);


                } catch(IOException e){
                    e.printStackTrace();
                }
            }
        }

        return in;
    
	}

	@Override
	public ConfigFiles findFileEntity(String id) {
		
		return configFileDao.find(id);
	}

	@Override
	public void initConfigFile() throws FileNotFoundException {
		List<ConfigFiles> count = configFileDao.findAll();
		if(count == null || count.size() == 0){
			String path = System.getProperty("user.dir") + "/data/configserver";
			File allFile = new File(path);
			File[] files = allFile.listFiles();
			for(int i = 0; i < files.length; i++){
				File file = files[i];
				Map<String, Object> yml = Yaml.loadType(file, HashMap.class);
				if((boolean) yml.get("initFromFileSystem")){
					String allName = file.getName();
					String[] name = allName.split("-");
					ConfigFiles configFile = new ConfigFiles();
					configFile.setServiceName(name[0]);
					configFile.setConfigFile(name[1]);
					configFile.setCreateTime(new Date());
					configFile.setUpdateTime(new Date());
					configFile.setIsDelete(0);
					configFileDao.save(configFile);
				}
			}
		}
	}
	
}

