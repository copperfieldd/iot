package cn.bytecloud.iot.eoms.constant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MessageConstant {
    @Value("${success.message.import}")
    public String importSuccessMessage;

    @Value("${failure.message.import}")
    public String importFailureMessage;

    @Value("${success.message.export}")
    public String exportSuccessMessage;

    @Value("${failure.message.export}")
    public String exportFailureMessage;

    @Value("${success.message.save}")
    public String saveSuccessMessage;

    @Value("${failure.message.save}")
    public String saveFailureMessage;

    @Value("${success.message.update}")
    public String updateSuccessMessage;

    @Value("${failure.message.update}")
    public String updateFailureMessage;

    @Value("${success.message.delete}")
    public String deleteSuccessMessage;

    @Value("${failure.message.delete}")
    public String deleteFailureMessage;

    @Value("${success.message.list}")
    public String listSuccessMessage;

    @Value("${failure.message.list}")
    public String listFailureMessage;
}
