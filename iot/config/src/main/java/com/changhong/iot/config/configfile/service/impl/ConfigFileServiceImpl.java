/**
 * Project Name:eoms
 * File Name:ConfigFileServiceImpl.java
 * Package Name:com.changhong.iot.eoms.config.service.impl
 * Date:2018年5月31日上午10:32:54
 *
*/

package com.changhong.iot.config.configfile.service.impl;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.configfile.dao.ConfigFileDao;
import com.changhong.iot.config.configfile.dto.ConfigFileDto;
import com.changhong.iot.config.configfile.entity.ConfigFiles;
import com.changhong.iot.config.configfile.service.ConfigFileService;
import com.changhong.iot.config.searchdto.ConfigFilefilter;
import com.changhong.iot.config.searchdto.Sort;
import com.changhong.iot.config.util.EmptyUtil;
import com.changhong.iot.config.util.EntityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.*;

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
public class ConfigFileServiceImpl implements ConfigFileService {

	@Autowired
	private ConfigFileDao configFileDao;

	@Value("${data.configserver}")
	private String path;

	@Override
	public Map<String, Object> getConfigList(int start, int count, ConfigFilefilter configFilefilter, Sort sort) throws EomsException, ByteException {
		
		Map<String, Object> result = new HashMap<String, Object>();

        if (sort == null) {
            sort = new Sort();
        }
        if (sort.getName() == null) {
            sort.setName("updateTime");
            sort.setOrder("desc");
        }

        PageModel pageFiles = configFileDao.pageFilterAndPropsAndIn(start, count, null, null, null, null,
                configFilefilter, null, sort);

		try {
			pageFiles.setList(EntityUtil.entityListToDtoList(pageFiles.getList(), ConfigFileDto.class));
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		}

		result.put("data", pageFiles);
		return result;
	}

	@Override
	public Map<String, Object> saveConfigAdd(String fileName, String serviceName, String id, String content) throws EomsException, Exception {
		Map<String, Object> result = new HashMap<String, Object>();

        OutputStream out = null;
        InputStream in = null;
        ConfigFiles configFiles = null;

        try {
            String path = getPath();
            String saveName = serviceName + "-" +fileName + ".yml";

            File file = new File(path, saveName);
            // 判断是否存在该文件
            if(file.exists()){
                throw new EomsException(1011, "文件已经存在！");
            }
            // 判断路径是否存在,如果不存在就创建文件路径
            if (!file.getParentFile().exists()) {
                if (!file.getParentFile().mkdirs()) {
                    throw new EomsException(1001, "创建目录异常！");
                }
            }

            if (EmptyUtil.isNotEmpty(id)) {

                in = getFileInputStreamById(id);
                if (in == null) {
                    throw new ByteException(1012);
                }

                out = new FileOutputStream(file);
                byte b[] = new byte[1024];
                while (in.read(b) != -1) {
                    out.write(b);
                }
                out.flush();

            } else if (EmptyUtil.isNotEmpty(content)) {
                out = new FileOutputStream(file);
                out.write(content.getBytes("utf-8"));
                out.flush();
            }

            configFiles = new ConfigFiles();
            configFiles.setServiceName(serviceName);
            configFiles.setConfigFile(fileName);
            configFiles.setIsDelete(0);
            configFiles.setCreateTime(new Date());
            configFiles.setUpdateTime(new Date());

            configFileDao.save(configFiles);

            result.put("data", configFiles);
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException e){
            }
        }
        result.put("msg", "保存成功");
		return result;
	}

    @Override
    public void updConifgContent(String id, String content, String fileName, String serviceName) throws EomsException {

	    OutputStream out = null;

        ConfigFiles fileEntity = findFileEntity(id);

        if (fileEntity == null) {
            throw new EomsException(1012, "该配置文件不存在！");
        }
        String ySaveName = fileEntity.getServiceName() + "-" + fileEntity.getConfigFile() + ".yml";

        if (EmptyUtil.isNotEmpty(serviceName)) {
            fileEntity.setServiceName(serviceName);
        }
        if (EmptyUtil.isNotEmpty(fileName)) {
            fileEntity.setConfigFile(fileName);
        }
        fileEntity.setUpdateTime(new Date());

        configFileDao.update(fileEntity);

        String path = getPath();
        String saveName = fileEntity.getServiceName() + "-" + fileEntity.getConfigFile() + ".yml";

        File file = new File(path, saveName);

        try {
            out = new FileOutputStream(file);
            out.write(content.getBytes("utf-8"));
            out.flush();

            if (!ySaveName.equals(saveName)) {
                file = new File(path, ySaveName);
                if (file.exists()) {
                    if (!file.delete()) {
                        throw new EomsException(1001, "文件删除失败！");
                    }
                }
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    @Override
	public Map<String, Object> configFileDel(String fileId) throws EomsException, Exception {
		Map<String, Object> result = new HashMap<String, Object>();
		ConfigFiles configFile = configFileDao.find(fileId);
        if (configFile != null) {

            String path = getPath();
            
            String saveName = configFile.getServiceName() + "-" + configFile.getConfigFile() + ".yml";
            
            File filepath = new File(path, saveName);
            // 判断文件是否存在
            if (filepath.exists()) {
                if (!filepath.delete()) {
                    throw new EomsException(1001, "文件删除失败！");
                }
            }
            configFileDao.delete(fileId);
        } else {
            throw new EomsException(1001, "删除失败");
        }
        result.put("msg", "删除成功");
        return result;
	}

	@Override
	public InputStream getFileInputStreamById(String id) {


        InputStream in = null;

        ConfigFiles configFile = configFileDao.find(id);
        if (configFile != null) {

            String path = getPath();
            
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
    @PostConstruct
	public void initConfigFile() {
//                    Map<String, Object> yml = Yaml.loadType(file, HashMap.class);
		List<ConfigFiles> count = configFileDao.findAll();
        List<ConfigFiles> configFiles = new ArrayList<>();
        String path = getPath();
        File allFile = new File(path);
        File[] files = allFile.listFiles();
        if (EmptyUtil.isNotEmpty(files)) {
             for (int i = 0; i < files.length; i++) {
                File file = files[i];
                if (file.isFile()) {
                    boolean flag = false;
                    String allName = file.getName();

                    for (ConfigFiles entity : count) {
                        if (allName.equals(entity.getServiceName()+"-"+entity.getConfigFile()+".yml")) {
                            configFiles.add(entity);
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        String[] name = allName.split("-");
                        ConfigFiles configFile = new ConfigFiles();
                        configFile.setServiceName(name[0]);
                        configFile.setConfigFile(name[1].replaceAll(".yml", ""));
                        configFile.setCreateTime(new Date());
                        configFile.setUpdateTime(new Date());
                        configFile.setIsDelete(0);
                        configFileDao.save(configFile);
                    }
                }
            }
            count.removeAll(configFiles);
        }
        if (EmptyUtil.isNotEmpty(count)) {
            String ids [] = new String[count.size()];
            for (int i = 0; i < count.size(); i++) {
                ids[i] = count.get(i).getId();
            }
            configFileDao.delete(ids);
        }
	}

	public String getPath() {
	    return path;
    }

}

