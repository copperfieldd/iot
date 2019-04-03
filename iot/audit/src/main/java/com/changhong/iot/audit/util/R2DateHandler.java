package com.changhong.iot.audit.util;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;


public class R2DateHandler extends BaseTypeHandler<String> {

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {

    	if (DateUtil.isValidDateTime(parameter) || DateUtil.isValidDate(parameter)) {

    		Timestamp time = Timestamp.valueOf(DateUtil.toTimeStampFormat(parameter));
    		ps.setTimestamp(i, time);
    	}
    	
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
    	Timestamp value = rs.getTimestamp(columnName);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    	Timestamp value = rs.getTimestamp(columnIndex);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    	Timestamp value = cs.getTimestamp(columnIndex);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

}
