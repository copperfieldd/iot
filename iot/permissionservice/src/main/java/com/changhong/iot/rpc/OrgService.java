package com.changhong.iot.rpc;

import com.changhong.iot.base.exception.ByteException;
import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.config.MyThreadLocal;
import com.changhong.iot.dto.UnitDto;
import com.changhong.iot.dto.UserDto;
import com.changhong.iot.util.JsonUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class OrgService {

    @Resource
    private OrgRPC orgRPC;

    @Resource
    private RedisTemplate redisTemplate;

    public UserDto login(String userName, String password, int type) throws ByteException {

        JSONObject object = new JSONObject();
        object.put("username", userName);
        object.put("password", password);
        object.put("type", type);

        ServerResponse<UserDto> login = orgRPC.login(object.toString());

        if (login.getStatus() != 0) {
            throw new ByteException(login.getStatus());
        }
        return login.getValue();
    }

    public UserDto findCurrentUser() throws ByteException {

        String s = (String) redisTemplate.opsForValue().get(MyThreadLocal.getToken());
        UserDto userDto = JsonUtil.string2Obj(s, UserDto.class);

        if (userDto == null || userDto.getId() == null) {
            ServerResponse<UserDto> response = orgRPC.getCurrentUser(MyThreadLocal.getToken());

            if (response.getStatus() != 0) {
                throw new ByteException(response.getStatus(), response.getValue());
            } else if (response.getValue() == null) {
                throw new ByteException(401, "登录过期，请重新登录！");
            }
            userDto = response.getValue();
        }
        redisTemplate.boundValueOps(MyThreadLocal.getToken()).set(JsonUtil.obj2String(userDto), 60, TimeUnit.MINUTES);
        redisTemplate.boundValueOps(userDto.getId()).set(JsonUtil.obj2String(userDto), 60, TimeUnit.MINUTES);

        return userDto;
    }

    public List<String> findPids(String orgId) {

        ServerResponse<List<String>> serverResponse = orgRPC.getPids(orgId, MyThreadLocal.getToken());

        if (serverResponse.getStatus() != 0) {
            return new ArrayList<>();
        }

        return serverResponse.getValue();
    }

    public UserDto findUser(String id) throws ByteException {

        String s = (String) redisTemplate.opsForValue().get(id);
        UserDto userDto = JsonUtil.string2Obj(s, UserDto.class);

        if (userDto == null || userDto.getId() == null) {
            ServerResponse<UserDto> response = orgRPC.findUserById(id, MyThreadLocal.getToken());

            if (response.getStatus() != 0) {
                throw new ByteException(response.getStatus(), response.getValue());
            } else if (response.getValue() == null){
                throw new ByteException(1012);
            }
            userDto = response.getValue();
            redisTemplate.boundValueOps(id).set(JsonUtil.obj2String(userDto), 60, TimeUnit.MINUTES);
        }
        return userDto;
    }

    public UserDto findManagerByAppId(String appId) throws ByteException {

        ServerResponse<UserDto> response = orgRPC.findManagerByAppId(appId, MyThreadLocal.getToken());

        if (response.getStatus() != 0) {
            throw new ByteException(response.getStatus(), response.getValue());
        }
        return response.getValue();
    }

    public JSONArray findByUserIds(List<String> ids) throws ByteException {

        ServerResponse<List<UnitDto> > response = orgRPC.findByUnitIds(ids, MyThreadLocal.getToken());
        ServerResponse<List<UserDto> > responseUser = orgRPC.findByUserIds(ids, MyThreadLocal.getToken());
        if (response.getStatus() != 0 || responseUser.getStatus() != 0) {
            throw new ByteException(response.getStatus(), response.getValue());
        }
        List<UnitDto> units = response.getValue();
        List<UserDto> users = responseUser.getValue();

        JSONArray array = new JSONArray();
        JSONObject obj = null;

        for (UnitDto unit : units) {
            obj = new JSONObject();
            obj.put("id", unit.getId());
            obj.put("name", unit.getName());
            obj.put("type", unit.getType());
            obj.put("isUser", false);

            array.add(obj);
        }
        for (UserDto user : users) {
            obj = new JSONObject();
            obj.put("id", user.getId());
            obj.put("name", user.getUserName());
            obj.put("type", user.getType());
            obj.put("isUser", true);

            array.add(obj);
        }
        return array;
    }

}
