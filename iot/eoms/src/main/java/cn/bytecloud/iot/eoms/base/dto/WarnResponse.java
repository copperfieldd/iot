package cn.bytecloud.iot.eoms.base.dto;

import java.util.Map;

/**
 * 返回前台警告对象
 */
public class WarnResponse extends Response {

  private static final long serialVersionUID = -3435256799895340269L;

  public WarnResponse() {
    super();
    setWarnFlag();
  }

  public WarnResponse(Map<Object, Object> map) {
    super(map);
    setWarnFlag();
  }

}
