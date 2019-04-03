/**
 * Project Name:byteoa4
 * File Name:HeaderFilter.java
 * Package Name:cn.bytecloud.oa.config
 * Date:2018年11月6日上午9:59:21
 * Copyright (c) 2018, haocj@bytecloud.cn All Rights Reserved.
 *
*/

package com.changhong.iot.zuul;
/**
 * ClassName:HeaderFilter <br/>
 * Function: TODO ADD FUNCTION. <br/>
 * Reason:	 TODO ADD REASON. <br/>
 * Date:     2018年11月6日 上午9:59:21 <br/>
 * @author   haocj
 * @version  
 * @since    JDK 1.8
 * @see 	 
 */

import org.springframework.context.annotation.Configuration;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@WebFilter("/*")
public class HeaderFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) resp;
        HttpServletRequest request = (HttpServletRequest) req;
        response.setHeader("Access-Control-Allow-Origin", "*"); // 解决跨域访问报错
        response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600"); // 设置过期时间
        response.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, X-Cookie, Authorization");

        // 支持HTTP
        response.setHeader("Access-Control-Allow-Credentials", "true");

        if (!request.getRequestURI().contains(".")) {
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // 支持HTTP
            response.setHeader("Pragma", "no-cache"); // 支持HTTP 1.0.
        }

        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 处理 multipart/form-data 请求
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
