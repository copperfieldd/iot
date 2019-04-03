package com.changhong.iot.config.instance.controller;

import com.changhong.iot.config.base.exception.ByteException;
import com.changhong.iot.config.base.exception.EomsException;
import com.changhong.iot.config.base.dto.PageModel;
import com.changhong.iot.config.common.ServerResponse;
import com.changhong.iot.config.instance.dto.PobeListDto;
import com.changhong.iot.config.instance.entity.DiskStats;
import com.changhong.iot.config.instance.entity.MemoryStats;
import com.changhong.iot.config.instance.service.DiskStatsService;
import com.changhong.iot.config.instance.service.InstanceService;
import com.changhong.iot.config.instance.service.LatestService;
import com.changhong.iot.config.instance.service.PobeService;
import com.changhong.iot.config.util.EntityUtil;
import com.changhong.iot.config.util.ParamUtil;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disk")
public class DiskStatsController {

    @Resource
    private DiskStatsService diskStatsService;

    @Resource
    private InstanceService instanceService;

    @Resource
    private LatestService latestService;

    @GetMapping("/list")
    public ServerResponse list(@RequestParam int start, @RequestParam int count, String name) throws ByteException {

        PageModel pageModel = instanceService.getServiceList(start, count, null, null);

        List list = pageModel.getList();

        try {
            list = EntityUtil.entityListToDtoList(list, PobeListDto.class);

            pageModel.setList(latestService.pack(list, 3));
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }

        return ServerResponse.createBySuccess(pageModel);
    }

    @PostMapping("/upd")
    public ServerResponse upd(@RequestBody DiskStats diskStats) throws ByteException {

        ParamUtil.checkOrParamNotNull(diskStats, "threshold", "cycle");

        diskStatsService.updAll(diskStats.getCycle(), diskStats.getThreshold());

        return ServerResponse.createBySuccess("修改成功！");
    }

    @GetMapping("/item")
    public ServerResponse item() {

        Map<String, Object> map = new HashMap<>();

        DiskStats entity = diskStatsService.findOne();

        if (entity == null) {
            map.put("cycle", 0);
            map.put("threshold", 0);
        } else {
            map.put("cycle", entity.getCycle());
            map.put("threshold", entity.getThreshold());
        }

        return ServerResponse.createBySuccess(map);
    }

}
