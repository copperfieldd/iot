package com.changhong.iot.config.instance.monitor;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.instance.controller.InstanceController;
import com.changhong.iot.config.instance.entity.*;
import com.changhong.iot.config.instance.service.*;
import com.changhong.iot.config.util.EmptyUtil;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
public class StateMonitor implements Runnable{

    @Value("${monitor.cycle:300}")
    private long time;

    @Autowired
    private InstanceStateService instanceStateService;

    @Autowired
    private InstanceService instanceService;

    @Autowired
    private DiskStatsService diskStatsService;

    @Autowired
    private MemoryStatsService memoryStatsService;

    @Autowired
    private PobeService pobeService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void init() {

        new Thread(this).start();
    }

    @Override
    public void run() {

        while (true) {
            try {
                Thread.sleep(time * 1000);

                stateMonitor();
                memoryMonitor();
                diskMonitor();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void stateMonitor() {

        List<ServiceStats> all = instanceStateService.findAll();

        for (ServiceStats entity : all) {
            ServiceInstances instances = instanceService.find(entity.getServiceId());

            if (instances.getServiceValue() == 1) {
                continue;
            }

            String host = instances.getServiceHost();
            Integer port = instances.getServicePort();

            String result = null;
            int state = 1;
            try {
                result = InstanceController.doGet("http://" + host + ":" + port + "/health");
                if (EmptyUtil.isNotEmpty(result)) {
                    JSONObject object = JSONObject.fromObject(result);
                    if (object.has("status") && object.getString("status").equals("UP")) {
                        state = 0;
                    }
                }
            } catch (ByteException e) {
                e.printStackTrace();
            }

            boolean alarmed = false;

            if (state == 1) {
                Integer failure = entity.getFailureNumber();
                Integer number = entity.getNumber();
                if (failure == number + 1) {
                    //TODO 告警
                    alarmed = true;
                } else {
                    entity.setNumber(number + 1);
                    instanceStateService.update(entity);
                }
            }

            saveLatestData(entity.getServiceId(), 1, alarmed, state);
        }

    }

    public void memoryMonitor() {

        List<MemoryStats> all = memoryStatsService.findAll();

        for (MemoryStats entity : all) {
            ServiceInstances instances = instanceService.find(entity.getServiceId());

            if (instances.getServiceValue() == 1) {
                continue;
            }

            String host = instances.getServiceHost();
            Integer port = instances.getServicePort();

            String result = null;
            long memFree = 0;
            try {
                result = InstanceController.doGet("http://" + host + ":" + port + "/metrics");

                if (EmptyUtil.isNotEmpty(result)) {
                    JSONObject object = JSONObject.fromObject(result);
                    if (object.has("mem.free")) {
                        memFree = object.getLong("mem.free");
                    }
                }
            } catch (ByteException e) {
                e.printStackTrace();
            }

            boolean alarmed = false;

            if (memFree < entity.getThreshold()/1024) {
                //TODO 告警
                alarmed = true;
            }

            saveLatestData(entity.getServiceId(), 2, alarmed, memFree);
        }
    }

    public void diskMonitor() {

        List<DiskStats> all = diskStatsService.findAll();

        for (DiskStats entity : all) {
            ServiceInstances instances = instanceService.find(entity.getServiceId());

            if (instances.getServiceValue() == 1) {
                continue;
            }

            String host = instances.getServiceHost();
            Integer port = instances.getServicePort();

            String result = null;
            long free = 0;
            try {
                result = InstanceController.doGet("http://" + host + ":" + port + "/health");
                if (EmptyUtil.isNotEmpty(result)) {
                    JSONObject object = JSONObject.fromObject(result);
                    if (object.has("diskSpace")) {
                        free = object.getJSONObject("diskSpace").getLong("free");
                    }
                }
            } catch (ByteException e) {
                e.printStackTrace();
            }

            boolean alarmed = false;

            if (free < entity.getThreshold()) {
                //TODO 告警
                alarmed = true;
            }

            saveLatestData(entity.getServiceId(), 3, alarmed, free);
        }

    }

    private void saveLatestData(String serviceId, int type, boolean alarmed, long state) {

        PobeEntity pobe = new PobeEntity();
        pobe.setServiceId(serviceId);
        pobe.setType(1);
        pobe.setIsAlarmed(alarmed);
        pobe.setValue(state);

        pobeService.add(pobe);
        //System.out.println(pobe);

        LatestEntity latest = mongoTemplate.findOne(Query.query(Criteria.where("serviceId").is(serviceId).and("type").is(type)), LatestEntity.class);

        if (latest == null) {
            latest = new LatestEntity();
            latest.setId(UUID.randomUUID().toString());
            latest.setServiceId(serviceId);
            latest.setType(type);
        }

        latest.setIsAlarmed(alarmed);
        latest.setValue(state);
        latest.setCreateTime(new Date());

        mongoTemplate.save(latest);
    }

}
