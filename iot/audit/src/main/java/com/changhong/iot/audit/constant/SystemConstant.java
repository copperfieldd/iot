package com.changhong.iot.audit.constant;

public class SystemConstant {

	public static final String JWT_PREFIX_STR = "ByteCloud ";
	
	public static final int JWT_PREFIX_LEN = 10;
	
	public static final String STR_FRAME_HEAD = "AA55";
	
	public static final String STR_FRAME_TAIL = "AA55";

	public static final byte[] BYTE_FRAME_HEAD = {-86, 85};
	
	public static final byte[] BYTE_FRAME_TAIL = {85, -86};

	public static final byte[] SEEKCY_GATEWAY_HEAD = {21, 73};
	
	public static final byte[] SEEKCY_BEACON_HEAD = {-123, 70};

	public static final byte SEEKCY_BEACON_SHORT = 1;

	public static final byte SEEKCY_BEACON_LONG1 = 2;

	public static final byte SEEKCY_BEACON_LONG2 = 3;

	public static final byte SEEKCY_BEACON_LONG3 = 4;

	public static final byte SEEKCY_BEACON_LONG4 = 5;

	public static final byte SEEKCY_BEACON_TRIGGER = 17;
	
	public static final byte BYTE_HEAD_FAIL = 99;
	
	public static final int FRAME_INDEX_LENGTH = 2;
	
	public static final int FRAME_INDEX_COMMAND = 3;
	
	public static final int FRAME_INDEX_DATA = 4;	
	
	//命令
	public static final byte CMD_KEEP_ALIVE_H2S = 1;

	public static final byte CMD_ONLINE_AWARE_H2S = 2;

	public static final byte CMD_TAG_INFO_H2S = 3;

	public static final byte CMD_HARDWARE_ID_S2H = 12;

	public static final byte CMD_HARDWARE_ID_H2S = 22;

	//真趣接口对接
	public static final byte CMD_SEEKCY_GATEWAY = 101;

	public static final byte CMD_SEEKCY_BEACON = 102;
	
	public static final Integer MAX_EXPORT_ROWS = 1000;
	
    //导出信息所在目录
    public static final String FILE_EXPORT_PATH = "/export";
    
    public static final String CACHE_PREFIX_GATEWAY = "BCEAM-GATEWAY-";

    public static final String CACHE_PREFIX_BLUETOOTH = "BCEAM-BLUETOOTH-";

    public static final int STEP_UPDATE_COUNT = 10;
    
	public static final int STEP_BLUETOOTH_DETECT = 60000;

	//public static final int LOST_GATEWAY_TIMEOUT = 120000;

	//public static final int LOST_BLUETOOTH_TIMEOUT = 120000;
	
    public static final String CACHE_GATEWAYS = CACHE_PREFIX_GATEWAY + "LIST";

    public static final String CACHE_BLUETEETH = CACHE_PREFIX_BLUETOOTH + "LIST";
    
    //非常重要，切勿删除，所有外部系统接口访问密码的种子KEY！！！！！！！
    public static final String AES_ENCRYPT_KEY = "9BF9D26F7C66C15D1CABC88C8A9AAD6A";

    //public static final int TRANSFER_STABLE_TOUCH = 3;
    
}
