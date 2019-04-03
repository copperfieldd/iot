package com.changhong.iot.zuul;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.rpc.PermissionIdentity;
import com.changhong.iot.util.JsonUtil;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 网关过滤，有token参数就放行，没有就拦截
 */
@Component
public class IdentityFilter extends ZuulFilter {

    @Autowired
    private PermissionIdentity permissionIdentity;

    @Value("#{'${filter.ignoredPatterns:}'.split(',')}")
    private List<String> path;

    private static Logger log = LoggerFactory.getLogger(IdentityFilter.class);
    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @PostConstruct
    public void init() {
        //排除验权路径
        path.add("/permissionservice/authenticity");
        path.add("/userservice/identity");
        path.add("/userservice/api/user/current");
        path.add("/userservice/api/user/items");
        path.add("/userservice/api/login");
        path.add("/api/login");
    }

    @Override
    public boolean shouldFilter() {

        RequestContext ctx = RequestContext.getCurrentContext();

        if (!ctx.sendZuulResponse()) {
            return false;
        }

        HttpServletRequest request = ctx.getRequest();

        String uri = request.getRequestURI();

        String s = ".";

        System.out.println(uri);
        if (path.contains(uri) || uri.substring(uri.lastIndexOf("/"), uri.length()).contains(".")) {
            return false;
        }
        if (uri.startsWith("/payservice/notify/pay/")) {
            return false;
        }
        if (uri.startsWith("/payservice/test")) {
            return false;
        }

        return true;
    }

    @Override
    public Object run() {

        RequestContext ctx = RequestContext.getCurrentContext();

        HttpServletRequest request = ctx.getRequest();
        HttpServletResponse response = ctx.getResponse();

        ServerResponse serverResponse = null;

//        log.info(String.format("%s >>> %s", request.getMethod(), request.getRequestURL().toString()));

        String token = request.getHeader("Authorization");

        System.out.println("token==" + token);

        if (token != null && !token.isEmpty()) {

            serverResponse = permissionIdentity.identity(token);

            if (serverResponse.getStatus() == 0) {
                return null;
            }
        } else {
            serverResponse = ServerResponse.createByError(1005);
        }
        log.warn("token is invalid");
        ctx.setSendZuulResponse(false);//不进行路由
        ctx.setResponseStatusCode(401);

        response.setCharacterEncoding("utf-8");  //设置字符集
        response.setContentType("application/json; charset=utf-8"); //设置相应格式

        try {
            response.getWriter().write(JsonUtil.obj2String(serverResponse));
        } catch (Exception e) {
        }

        return null;
    }
}
