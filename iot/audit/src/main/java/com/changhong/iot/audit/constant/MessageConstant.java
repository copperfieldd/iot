package com.changhong.iot.audit.constant;

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

    @Value("${failure.message.nameIsNull}")
    public String nameIsNull;

    @Value("${failure.message.idIsNull}")
    public String idIsNull;

    @Value("${failure.message.databaseIdNull}")
    public String databaseIdNull;

    @Value("${failure.message.nameRepeat}")
    public String nameRepeat;

    @Value("${failure.message.dataIsNull}")
    public String dataIsNull;

    @Value("${failure.message.numberIsNull}")
    public String numberIsNull;

    @Value("${failure.message.areaIsNull}")
    public String areaIsNull;

    @Value("${failure.message.numberRepeat}")
    public String numberRepeat;

    @Value("${failure.message.typeIsNull}")
    public String typeIsNull;

    @Value("${failure.message.startOrCountIdNull}")
    public String startOrCountIdNull;

    @Value("${failure.message.hardwareIdIsNull}")
    public String hardwareIdIsNull;

    @Value("${failure.message.gatewayIdIsNull}")
    public String gatewayIdIsNull;

    @Value("${failure.message.hardwareIdRepeat}")
    public String hardwareIdRepeat;

    @Value("${failure.message.statusIsNull}")
    public String statusIsNull;

    @Value("${failure.message.departmentIdIsNull}")
    public String departmentIdIsNull;

    @Value("${success.message.requestSuccess}")
    public String requestSuccess;

    @Value("${failure.message.requestFailure}")
    public String requestFailure;

    @Value("${failure.message.unitIdIsNull}")
    public String unitIdIsNull;

    @Value("${failure.message.formatError}")
    public String formatError;

    @Value("${failure.message.dataErroe}")
    public String dataErroe;

    @Value("${failure.message.deptIdIsNull}")
    public String deptIdIsNull;

    @Value("${failure.message.gatewayIsNotNull}")
    public String gatewayIsNotNull;

    @Value("${failure.message.logicalUnitIdIsNull}")
    public String logicalUnitIdIsNull;

    @Value("${failure.message.logicalUnitIsParent}")
    public String logicalUnitIsParent;

    @Value("${failure.message.remarkIsNull}")
    public String remarkIsNull;

    @Value("${failure.message.lengthISError}")
    public String lengthISError;

    @Value("${failure.message.typeIsError}")
    public String typeIsError;

    @Value("${failure.message.userIdIsNull}")
    public String userIdIsNull;

    @Value("${failure.message.assetIdIsNull}")
    public String assetIdIsNull;

    @Value("${failure.message.endAddressIdIsNull}")
    public String endAddressIdIsNull;

    @Value("${failure.message.flagIsNull}")
    public String flagIsNull;

    @Value("${failure.message.courseIsNull}")
    public String courseIsNull;

    @Value("${failure.message.idsIsNull}")
    public String idsIsNull;

    @Value("${failure.message.gpsIsNull}")
    public String gpsIsNull;

    @Value("${failure.message.descIsNull}")
    public String descIsNull;

}
