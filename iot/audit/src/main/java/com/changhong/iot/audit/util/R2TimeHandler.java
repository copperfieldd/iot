package com.changhong.iot.audit.util;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.text.SimpleDateFormat;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;


public class R2TimeHandler extends BaseTypeHandler<String> {

    private SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
    	
    	if (DateUtil.isValidTime(parameter)) {

    		Time time = Time.valueOf(parameter);
    		ps.setTime(i, time);
    	}
    	
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
    	Time value = rs.getTime(columnName);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    	Time value = rs.getTime(columnIndex);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    	Time value = cs.getTime(columnIndex);
    	if (value == null) {
    		return null;
    	}
        return sdf.format(value);
    }

}
