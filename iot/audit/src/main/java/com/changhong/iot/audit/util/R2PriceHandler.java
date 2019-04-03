package com.changhong.iot.audit.util;
import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

public class R2PriceHandler extends BaseTypeHandler<String> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
    	
        ps.setBigDecimal(i, new BigDecimal(parameter));
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return r2price(rs.getBigDecimal(columnName));
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return r2price(rs.getBigDecimal(columnIndex));
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return r2price(cs.getBigDecimal(columnIndex));
    }

    private String r2price(BigDecimal result) {
    	DecimalFormat df = new DecimalFormat("0.00");
    	return df.format(result);
    }
}
