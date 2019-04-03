package com.changhong.iot.rpc;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.ApplicationDto;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

@Component
public class ApplicationService {

    @Resource
    private ApplicationRPC applicationRPC;

    public ApplicationDto findById(String id) {

        ServerResponse<ApplicationDto> response = applicationRPC.item(id, MyThreadLocal.getToken());
        if (response.getStatus() != 0) {
            return null;
        }
        return response.getValue();
    }

    public List<ApplicationDto> all(String token) {
        ServerResponse<List<ApplicationDto>> response = applicationRPC.all(token);
        if (response.getStatus() != 0) {
            return null;
        }
        return response.getValue();
    }

}
