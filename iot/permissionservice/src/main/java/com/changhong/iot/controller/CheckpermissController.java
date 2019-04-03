package com.changhong.iot.controller;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.Checkpermiss;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CheckpermissController {

    @Resource
    private Checkpermiss checkpermiss;

    @PostMapping("/checkPermiss")
    public ServerResponse checkPermiss(@RequestBody String content) throws ByteException {

        JSONObject jsonObject = JSONObject.fromObject(content);

        String orgId = null;
        List<String> menuIds = null, apiIds = null;

        if (jsonObject.has("orgId")) {
            orgId = jsonObject.getString("orgId");
        }
        menuIds = jsonObject.optJSONArray("menuIds");
        apiIds = jsonObject.optJSONArray("apiIds");

        checkpermiss.checkPermiss(orgId, menuIds, apiIds);

        return ServerResponse.createBySuccess();
    }


}
