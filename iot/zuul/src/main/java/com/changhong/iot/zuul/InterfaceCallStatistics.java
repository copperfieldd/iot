package com.changhong.iot.zuul;

import com.changhong.iot.rpc.PermissionAuthenticity;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;


@Component
public class InterfaceCallStatistics extends ZuulFilter {

    private List<String> path;

    @Autowired
    private PermissionAuthenticity permissionAuthenticity;

    @PostConstruct
    public void init() {
        //排除验权路径
        path = new ArrayList<String>();
        path.add("/userservice/api/login");
        path.add("/api/login");
    }

    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 2;
    }

    @Override
    public boolean shouldFilter() {

        RequestContext ctx = RequestContext.getCurrentContext();

        HttpServletRequest request = ctx.getRequest();

        String uri = request.getRequestURI();

        if (path.contains(uri) || uri.substring(uri.lastIndexOf("/"), uri.length()).contains(".")) {
            return false;
        }

        return true;
    }

    @Override
    public Object run() {

        RequestContext ctx = RequestContext.getCurrentContext();

        HttpServletRequest request = ctx.getRequest();
        String uri = request.getRequestURI();

        String token = request.getHeader("Authorization");

        try {
            if (token != null && !token.isEmpty()) {
                permissionAuthenticity.interfaceCallStatistics(uri, token);
            }
        } catch (Exception e) {}

        return null;
    }
}
