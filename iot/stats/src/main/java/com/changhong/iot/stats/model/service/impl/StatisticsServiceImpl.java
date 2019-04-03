package com.changhong.iot.stats.model.service.impl;

import com.changhong.iot.common.config.ErrorCode;
import com.changhong.iot.common.exception.ServiceException;
import com.changhong.iot.common.utils.DateUtil;
import com.changhong.iot.stats.model.bean.ApplicationBase;
import com.changhong.iot.stats.model.bean.BaseBean;
import com.changhong.iot.stats.model.bean.ScriptBase;
import com.changhong.iot.stats.model.repository.ApplicationRepository;
import com.changhong.iot.stats.model.repository.ScriptRepository;
import com.changhong.iot.stats.model.repository.StatisticsRepository;
import com.changhong.iot.stats.model.service.StatisticsService;
import com.changhong.iot.stats.web.dto.GetStatsRqtDTO;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.ParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by guiqijiang on 11/9/18.
 */
@Service
public class StatisticsServiceImpl implements StatisticsService {

    Logger logger = LoggerFactory.getLogger(StatisticsServiceImpl.class);

    @Autowired
    ScriptRepository ScriptRepository;

    @Autowired
    StatisticsRepository repository;

    @Autowired
    ApplicationRepository applicationRepository;

    @Override
    public Object count(String domain, String tag, GetStatsRqtDTO getStatsRqtDTO) throws ServiceException {
        ApplicationBase applicationBase = applicationRepository.findAppByDomain(domain);
        if (null == applicationBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        ScriptBase scriptBase = ScriptRepository.findByTag(tag, applicationBase.getId());
        if (null == scriptBase) {
            throw new ServiceException(ErrorCode.NULL_ERROR_DATA, "");
        }
        if (BaseBean.State.DELETE.ordinal() == scriptBase.getState()) {
            throw new ServiceException(ErrorCode.REFERENECD, "");
        }

        try {
            //条件封装到脚本里面
            String script = scriptBase.getScript();
            StandardEvaluationContext teslaContext = new StandardEvaluationContext(getStatsRqtDTO.getHashMap());
            ExpressionParser parser = new SpelExpressionParser();
            script = parser.parseExpression(script, ParserContext.TEMPLATE_EXPRESSION).getValue(teslaContext, String.class);
            logger.debug(script);

            //执行脚本
            Object result = repository.runScript(script);
            if (result instanceof List) {
                List<Map> list = (List<Map>) result;
                if (0 == list.size()) {
                    Map map = new HashMap();
                    long startTime = getStatsRqtDTO.getStarttime();
                    map.put("count", 0);
                    map.put("year", DateUtil.getYearOfDate(startTime));
                    map.put("month", DateUtil.getMonthOfDate(startTime));
                    map.put("day", DateUtil.getDayOfDate(startTime) - 1);
                    list.add(map);
                    return list;
                }
                for (Map h : list) {
                    Object report = h.get("reportTime");
                    if (null != report)
                        h.put("reportTime", DateUtil.format((Integer) report, "yyyy年MM月dd"));

                }
                //排序
                list.sort((o1, o2) -> {
                    int i = (int) o1.getOrDefault("year", 0) - (int) o2.getOrDefault("year", 0);
                    if (i != 0) {
                        return i;
                    }
                    i = (int) o1.getOrDefault("month", 0) - (int) o2.getOrDefault("month", 0);
                    if (i != 0) {
                        return i;
                    }
                    i = (int) o1.getOrDefault("day", 0) - (int) o2.getOrDefault("day", 0);
                    return i;
                });
            } else if (result instanceof Map) {
                Map map = (Map) result;
                Object report = map.get("reportTime");
                if (null != report)
                    map.put("reportTime", DateUtil.format((Integer) report, "yyyy年MM月dd"));
            }
            return result;
        } catch (Exception e) {
            logger.error("请求错误:{}", e.getMessage());
            throw new ServiceException(ErrorCode.SERVER_EXCEPTION, "");
        }
    }
}


