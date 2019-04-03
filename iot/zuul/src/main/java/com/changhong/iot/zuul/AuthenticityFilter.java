package com.changhong.iot.zuul;

import com.changhong.iot.common.ServerResponse;
import com.changhong.iot.rpc.PermissionAuthenticity;
import com.changhong.iot.util.JsonUtil;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
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
public class AuthenticityFilter extends ZuulFilter {

    @Value("${authenticity.enable:true}")
    private boolean isAuthenticity;

    @Autowired
    private PermissionAuthenticity permissionAuthenticity;

    @Value("#{'${filter.ignoredPatterns:}'.split(',')}")
    private List<String> path;

    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @PostConstruct
    public void init() {
        //排除actuator监控路径
        path.add("/autoconfig");
        path.add("/configprops");
        path.add("/beans");
        path.add("/dump");
        path.add("/env");
        path.add("/env/*");
        path.add("/health");
        path.add("/info");
        path.add("/mappings");
        path.add("/metrics");
        path.add("/metrics/*");
        path.add("/shutdown");
        path.add("/trace");
        //排除验权路径
        path.add("/permissionservice/authenticity");
        path.add("/userservice/identity");
        path.add("/userservice/api/user/current");
        path.add("/userservice/api/user/items");
        path.add("/userservice/api/login");
        path.add("/api/login");
        path.add("/userservice/api/unit/pids");
    }

    @Override
    public boolean shouldFilter() {

        RequestContext ctx = RequestContext.getCurrentContext();

        if (!ctx.sendZuulResponse()) {
            return false;
        }

        HttpServletRequest request = ctx.getRequest();

        String uri = request.getRequestURI();

        System.out.println("uri == " + uri);
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

        if (!isAuthenticity) {
            return true;
        }

        RequestContext ctx = RequestContext.getCurrentContext();

        HttpServletRequest request = ctx.getRequest();
        HttpServletResponse response = ctx.getResponse();

        ServerResponse serverResponse = null;
        String uri = request.getRequestURI();

        String token = request.getHeader("Authorization");

        serverResponse = this.permissionAuthenticity.authenticity(uri, token);

        int code = 200;
        if (serverResponse.getStatus() == 0) {
            return null;
        } else if (serverResponse.getStatus() == 401) {
            code = 401;
        }

        ctx.setSendZuulResponse(false);//不进行路由
        ctx.setResponseStatusCode(code);

        response.setCharacterEncoding("utf-8");  //设置字符集
        response.setContentType("application/json; charset=utf-8"); //设置相应格式

        try {
            response.getWriter().write(JsonUtil.obj2String(serverResponse));
        } catch (Exception e) {
        }

        return null;
    }
}
