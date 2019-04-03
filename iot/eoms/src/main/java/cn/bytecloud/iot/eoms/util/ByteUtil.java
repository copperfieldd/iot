package cn.bytecloud.iot.eoms.util;

import java.io.File;
import java.io.UnsupportedEncodingException;

import javax.imageio.stream.FileImageOutputStream;

public class ByteUtil {
	
	/** 16进制中的字符集 */  
    private static final String HEX_CHAR = "0123456789ABCDEF";  
      
    /** 16进制中的字符集对应的字节数组 */  
    private static final byte[] HEX_STRING_BYTE = HEX_CHAR.getBytes();  
    
	public static byte[] byteToHex(byte[] b) {  
        int length = b.length;  
        byte[] b2 = new byte[length << 1];  
        int pos;  
        for(int i=0; i<length; i++) {  
            pos = 2*i;  
            b2[pos] = HEX_STRING_BYTE[(b[i] & 0xf0) >> 4];  
            b2[pos+1] = HEX_STRING_BYTE[b[i] & 0x0f];  
        }  
        return b2;  
    }  
	
	public static byte[] yearToHexBytes(int year) {
		
		byte a = (byte)(year / 100);
		byte b = (byte)(year % (a * 100));
	
		byte[] out = {a, b};
		return out;
	}
	
	public static String byteToHexString(byte value) {
		StringBuilder stringBuilder = new StringBuilder("");   
        int v = value & 0xFF;   
        String hv = Integer.toHexString(v);   
        if (hv.length() < 2) {   
            stringBuilder.append(0);   
        }   
        stringBuilder.append(hv);   
   
	    return stringBuilder.toString().toUpperCase();  
	}
	
	public static String bytesToHexString(byte[] value) {
		StringBuilder stringBuilder = new StringBuilder("");   
	    if (value == null || value.length <= 0) {   
	        return null;   
	    }   
	    for (int i = 0; i < value.length; i++) {   
	        int v = value[i] & 0xFF;   
	        String hv = Integer.toHexString(v);   
	        if (hv.length() < 2) {   
	            stringBuilder.append(0);   
	        }   
	        stringBuilder.append(hv);   
	    }   
	    return stringBuilder.toString().toUpperCase();  
	}
	
	/**  
	 * Convert hex string to byte[]  
	 * @param hexString the hex string  
	 * @return byte[]  
	 */  
	public static byte[] hexStringToBytes(String hexString) {   
	    if (hexString == null || hexString.equals("")) {   
	        return null;   
	    }   
	    hexString = hexString.toUpperCase();   
	    int length = hexString.length() / 2;   
	    char[] hexChars = hexString.toCharArray();   
	    byte[] d = new byte[length];   
	    for (int i = 0; i < length; i++) {   
	        int pos = i * 2;   
	        d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));   
	    }   
	    return d;   
	}   
	
	
	/**  
	 * Convert char to byte  
	 * @param c char  
	 * @return byte  
	 */  
	 private static byte charToByte(char c) {   
	    return (byte) "0123456789ABCDEF".indexOf(c);   
	}  
	 
	 
	 public static boolean compareBytes(byte[] one, byte[] two) {
		 
		 if (one.length == two.length && one.length > 0) {
			 for (int i=0; i<one.length; i++) {
				 if (one[i] != two[i]) {
					 return false;
				 }
			 }
			 return true;
		 }
		 
		 return false;
	 }

	 
	 public static char[] bytesToMac(byte[] src) {
		 
		 char[] mac = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
		 
		 for (int i=0; i<src.length; i+=2) {
			 int b1 = src[i] & 0x0f;
			 int b2 = src[i] & 0xf0 >> 4;			 
			 
			 mac[i] = (char)b1;
			 mac[i+1] = (char)b2;
		 }
		 
		 return mac;
	 }
	 
	 
	 public static int bytes2int(byte[] res) {   
		// 一个byte数据左移24位变成0x??000000，再右移8位变成0x00??0000   
		  
		int targets = (res[0] & 0xff) | ((res[1] << 8) & 0xff00) // | 表示安位或   
		| ((res[2] << 24) >>> 8) | (res[3] << 24);   
		return targets;   
	}  


	 public static int byte2int(byte res) {   
		return 0xff & res;   
	}  
	 
	/**
	 * 
	 * 16进制数组转换int
	 * @param buf  byte数组
	 * @param asc  数组中数据顺序，false为倒序
	 * @return
	 */
    public final static int getInt(byte[] buf, boolean asc) {  
        if (buf == null) {  
          throw new IllegalArgumentException("byte array is null!");  
        }  
//        if (buf.length > 4) {  
//          throw new IllegalArgumentException("byte array size > 4 !");  
//        }  
        int r = 0;  
        if (asc)  
          for (int i = buf.length - 1; i >= 0; i--) {  
            r <<= 8;  
            r |= (buf[i] & 0x000000ff);  
          }  
        else  
          for (int i = 0; i < buf.length; i++) {  
            r <<= 8;  
            r |= (buf[i] & 0x000000ff);  
          }  
        return r;  
      }
    
    public static byte[] HexToByte(String hexString){
        int len = hexString.length();
        byte[] b = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            // 两位一组，表示一个字节,把这样表示的16进制字符串，还原成一个字节
            b[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4) + Character
                    .digit(hexString.charAt(i + 1), 16));
        }
        return b;
    }

	
    /**
     * convertHexToString:(16进制转换为10进制字符串). <br/>
     *
     * @author Administrator
     * @param hex
     * @return
     * @throws UnsupportedEncodingException 
     * @since JDK 1.8
     */
    public static String convertHexToString(String hex){  
//	    if(buf == null){
//	    	return "";
//	    }
//    	String hex = bytesToHexString2(buf);
    	StringBuilder sb = new StringBuilder();  
	    StringBuilder temp = new StringBuilder();  
	
	    //49204c6f7665204a617661 split into two characters 49, 20, 4c...  
	    for( int i=0; i<hex.length()-1; i+=2 ){  
	
	        //grab the hex in pairs  
	        String output = hex.substring(i, (i + 2));  
	        //convert hex to decimal  
	        int decimal = Integer.parseInt(output, 16);  
	        //convert the decimal to character  
	        sb.append((char)decimal);  
	
	        temp.append(decimal);  
    }  

    return sb.toString();  
    }   
    
    public final static short getShort(byte[] buf, boolean asc) 
    {
        if (buf == null) 
        {
          throw new IllegalArgumentException("byte array is null!");
        }
        if (buf.length > 2) 
        {
          throw new IllegalArgumentException("byte array size > 2 !");
        }
        short r = 0;
        if (asc)
          for (int i = buf.length - 1; i >= 0; i--) 
            {
            r <<= 8;
            r |= (buf[i] & 0x00ff);
          }
        else
          for (int i = 0; i < buf.length; i++) 
            {
            r <<= 8;
            r |= (buf[i] & 0x00ff);
          }
        return r;
    }
    
    public static void uploadFile(byte[] fs, String path){
        try{
            path = "D:\\a.png";
            FileImageOutputStream imageOutput = new FileImageOutputStream(new File(path));
            imageOutput.write(fs, 0, fs.length);
            imageOutput.close();
        } catch (Exception e){
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) throws UnsupportedEncodingException {  
    	  
//    	String s = "FF D8 FF E0 00 10 4A 46 49 46 00 01 01 01 00 00 00 00 00 00 FF DB 00 43 00 0C 08 09 0B 09 08 0C 0B 0A 0B 0E 0D 0C 0E 12 1E 14 12 11 11 12 25 1A 1C 16 1E 2C 26 2E 2D 2B 26 2A 29 30 36 45 3B 30 33 41 34 29 2A 3C 52 3D 41 47 4A 4D 4E 4D 2F 3A 55 5B 54 4B 5A 45 4C 4D 4A FF DB 00 43 01 0D 0E 0E 12 10 12 23 14 14 23 4A 32 2A 32 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A 4A FF C4 00 1F 00 00 01 05 01 01 01 01 01 01 00 00 00 00 00 00 00 00 01 02 03 04 05 06 07 08 09 0A 0B FF C4 00 B5 10 00 02 01 03 03 02 04 03 05 05 04 04 00 00 01 7D 01 02 03 00 04 11 05 12 21 31 41 06 13 51 61 07 22 71 14 32 81 91 A1 08 23 42 B1 C1 15 52 D1 F0 24 33 62 72 82 09 0A 16 17 18 19 1A 25 26 27 28 29 2A 34 35 36 37 38 39 3A 43 44 45 46 47 48 49 4A 53 54 55 56 57 58 59 5A 63 64 65 66 67 68 69 6A 73 74 75 76 77 78 79 7A 83 84 85 86 87 88 89 8A 92 93 94 95 96 97 98 99 9A A2 A3 A4 A5 A6 A7 A8 A9 AA B2 B3 B4 B5 B6 B7 B8 B9 BA C2 C3 C4 C5 C6 C7 C8 C9 CA D2 D3 D4 D5 D6 D7 D8 D9 DA E1 E2 E3 E4 E5 E6 E7 E8 E9 EA F1 F2 F3 F4 F5 F6 F7 F8 F9 FA FF C4 00 1F 01 00 03 01 01 01 01 01 01 01 01 01 00 00 00 00 00 00 01 02 03 04 05 06 07 08 09 0A 0B FF C4 00 B5 11 00 02 01 02 04 04 03 04 07 05 04 04 00 01 02 77 00 01 02 03 11 04 05 21 31 06 12 41 51 07 61 71 13 22 32 81 08 14 42 91 A1 B1 C1 09 23 33 52 F0 15 62 72 D1 0A 16 24 34 E1 25 F1 17 18 19 1A 26 27 28 29 2A 35 36 37 38 39 3A 43 44 45 46 47 48 49 4A 53 54 55 56 57 58 59 5A 63 64 65 66 67 68 69 6A 73 74 75 76 77 78 79 7A 82 83 84 85 86 87 88 89 8A 92 93 94 95 96 97 98 99 9A A2 A3 A4 A5 A6 A7 A8 A9 AA B2 B3 B4 B5 B6 B7 B8 B9 BA C2 C3 C4 C5 C6 C7 C8 C9 CA D2 D3 D4 D5 D6 D7 D8 D9 DA E2 E3 E4 E5 E6 E7 E8 E9 EA F2 F3 F4 F5 F6 F7 F8 F9 FA FF C0 00 11 08 00 F0 01 40 03 01 21 00 02 11 01 03 11 01 FF DA 00 0C 03 01 00 02 11 03 11 00 3F 00 4B 1D 43 3D EB 6A DE E0 35 07 11 6C 1C D2 D3 10 62 9C 16 81 8E E9 50 CB 28 5A 00 CE B8 BC 03 BD 41 6D 70 5D EB 29 C8 B4 6E DA 8F 96 A6 75 A9 8B 29 8D 43 83 5A F6 57 B9 F9 24 AA 7D C1 68 68 D1 56 6E 14 53 18 51 40 10 5C 5D C5 6E 3E 76 E7 D2 B1 AF 35 77 7E 13 E5 5A E5 9C F9 B4 25 99 12 CE 5B BD 56 69 2A 49 22 2F 4D 2F 4C 44 4C D5 11 6A 04 46 4D 32 81 0A 29 D5 A2 24 28 C5 51 21 8A 36 D3 10 A2 32 7B 55 88 AC D9 A9 88 BD 0E 9D ED 57 E1 D3 FD A9 81 E7 4A CD 11 AD 5B 2D 47 1D 68 46 B2 46 ED AD E0 71 D6 B4 63 70 D5 66 44 C0 52 33 85 A0 0A 57 17 81 7B D6 25 DE A7 CE 16 A5 B2 91 4F CD 69 5B 9A D6 B1 8A B9 E6 6A 8D B8 1F 6A E2 A7 DF 4E 98 A4 25 4A 87 15 B3 20 D2 B3 BC C7 CA FD 2B 44 1C 8C 8A 95 D8 DA 0C 5A 2B 43 41 B2 48 B1 8C B1 C5 64 5F 6A A7 91 17 1E F5 CF 52 57 D0 96 CC 29 AE 19 8F 26 AB 34 95 99 24 4C F5 13 3D 30 22 2F 49 BA 81 11 96 A6 13 40 86 D0 29 88 90 0A 5C 56 A8 81 71 46 DA 62 25 4B 76 6A B7 0D 86 69 88 BF 0E 9F ED 57 A2 B2 F6 A6 22 E4 76 C0 54 DB 02 D2 24 F3 7B CD 3B D0 56 4C 90 B4 26 83 64 C9 ED 2F 4C 67 9A E8 6C 6F C3 0E B5 68 99 23 47 ED 83 1D 6B 3A F7 53 09 DE 81 18 77 37 CF 29 AA CB 96 35 06 A6 8D 94 39 6A E8 2D 23 C0 AE 79 94 8B 75 2A 0A D6 99 12 25 A5 15 A9 04 80 D5 CB 6B C3 17 D2 A1 94 8B C2 FA 12 3A D4 13 6A 20 7F AB A9 BB 66 9C C6 74 F7 25 FA 9A CF 98 E6 A6 C4 94 64 AA CC D5 2C A2 22 F5 13 35 48 11 EF A5 DD 40 86 93 4C AA 01 6A 55 15 48 92 40 29 E1 09 AD 09 27 8E D4 B5 5D 86 C3 DA 98 8D 08 6C 3D AA F4 56 78 ED 4C 92 CA C0 16 97 81 52 21 8D 28 15 56 5B 9C 54 DC 76 30 DE 20 D5 99 77 60 1A B5 19 85 73 69 E5 9A 64 33 34 54 8D 37 2C 9D 41 F1 54 DE 46 73 CD 01 61 51 33 56 A2 4A 4C 0D 7B 08 B8 AD A8 97 0B 5C B2 34 44 80 54 EA 38 AE 98 6C 65 21 D4 55 92 2D 1B A9 0C 69 92 A3 69 6A 4A 23 2D 4D EB 48 08 64 4A A1 3A 54 B2 8A 6D 51 31 AC 86 45 BA 9C 0D 31 0B 49 4C 09 51 6A CC 71 13 56 88 2E 43 66 4D 68 41 61 ED 5A 12 68 C3 63 ED 57 63 B3 02 82 4B 02 20 B4 8C C0 54 88 82 49 B1 54 E5 BA A8 B9 56 28 4D 77 54 65 BA F7 A9 2C 7E EC 54 33 CA B8 AE 92 0C 0D 42 41 9A CC 34 16 80 02 6A 55 4C 50 51 20 AB 50 2E 58 56 72 11 BD 65 1E 05 68 57 37 53 41 F1 8A B1 5D 91 D8 C5 89 4D 26 98 86 17 A8 CC 94 8A 19 BA 8A 90 1C 16 96 80 1A D5 52 68 E9 0C CE 9A 3A A6 F5 93 28 84 D2 8A 06 3C 54 F0 C0 5C D3 24 D2 B6 B1 AD 5B 7B 0F 6A D1 10 69 41 63 ED 57 E3 B5 02 99 04 FB 55 6A 36 90 0A 9B 81 5A 4B 80 2A 94 D7 75 17 2E C5 09 AE FD EA 84 D7 7E F5 25 14 26 BD AA 13 5E FB D3 03 4A E2 E8 25 64 DC DF 16 E9 5D 26 68 CF 66 2C 68 09 4C D0 92 96 90 0F 4A D2 B0 8F 2D 9A CA 63 37 AD 97 8A 97 BD 73 AD CB 65 98 85 4A 6B B5 18 11 33 D4 0D 25 03 23 2D 46 2A 40 78 4A 7E 28 18 52 50 03 69 8C 33 48 0A 73 47 59 B7 11 D4 32 8A 84 73 4E 8E 3D D5 03 2E C1 6B 9A D9 B3 B2 F6 AA 42 36 6D AC AB 46 3B 75 5A B3 22 6E 16 98 D3 01 52 D8 15 A5 BA AA 13 5D D6 77 2D 22 84 D7 7E F5 9F 35 ED 22 8C E9 EF BD EA 84 B7 84 F4 AA 48 45 56 91 9A 99 8A D0 65 89 A5 69 0D 45 E5 13 5B 10 2E CC 53 0D 03 12 96 A4 64 F1 0A D9 B0 4C 0A C6 A0 D1 AE 9C 2D 20 7E 6B 28 6E 53 2D 47 20 C5 23 49 5D 86 24 24 E6 93 6E 68 18 F1 1D 3F 6E 29 00 51 48 63 69 28 01 29 B4 84 46 EB 9A A7 3C 54 86 67 49 0F 35 35 AC 55 93 28 DA B3 B7 AD AB 68 80 A6 84 CB EA 40 A4 69 C0 A2 E4 D8 AD 2D DF BD 52 96 F2 A0 AB 19 F3 5E FB D6 7C F7 FE F4 8A 33 67 D4 2A 94 97 2E F5 69 08 80 E4 D2 62 B4 01 2A 44 82 47 FB AB 4C 45 A1 6E 07 5A 46 15 A9 95 C8 19 6A 22 29 16 36 94 0A 45 17 2D D3 91 5B 56 A3 15 CF 50 A8 97 19 B0 B5 4A 4B 8D A6 A2 3B 8D 92 45 77 9A B4 92 6F AE B3 22 CA C7 52 6D C5 30 0A 6D 20 12 92 90 C6 D2 50 02 52 52 10 DA 63 26 EA 06 56 7B 6C D4 D6 F6 D8 AC A4 52 35 AD D3 6D 5D 57 DA 2A 2E 03 24 BA 02 A9 4D 7B EF 48 0A 13 5F 56 74 FA 87 BD 03 33 E5 BD 2D D2 AA B3 B3 F5 35 A2 42 19 8A 4C 55 88 91 2D E4 93 EE A9 AB D6 FA 2C D2 F5 A4 23 5E D3 C3 7E AB 5B 56 BA 12 AF F0 D0 43 67 20 EB 50 B2 D6 E2 21 65 A8 8A D2 28 8C AD 2A 2D 22 8D 0B 54 AD 58 6B 9A 65 C4 91 BE 6A A7 73 6C 58 51 04 0C CF CB DB B7 35 A1 67 78 2B 74 41 AF 0D C6 6A C6 EC D5 08 43 4D A4 31 29 28 01 B4 94 00 94 52 01 42 54 8B 1D 4B 63 1F E5 53 82 85 AC 5B 28 53 38 5A AF 2D EF BD 48 CA 33 DF FB D6 74 F7 FE 95 42 2A 49 3B BD 40 46 6A D0 83 14 F4 82 49 3E EA D3 11 7E DB 44 9A 5E BC 56 CD 9F 86 47 75 A0 96 CD BB 6D 09 13 B5 68 45 61 12 76 A4 D9 0D 96 56 35 5E 82 9D 51 72 0F 34 75 A8 19 6B B0 A2 12 B5 13 2D 03 23 2B 52 46 95 25 97 AD D7 15 79 3A 57 24 B7 35 45 9B 74 DF 57 BE C7 95 AD A0 67 23 3A F3 4E DD DA B1 26 B3 7B 76 CA D5 81 62 CA E5 BA 1A DA 81 8B 0A 60 4F 86 A6 66 81 05 25 21 89 45 00 2E 29 E0 54 36 50 EA 3C C5 15 8B 65 10 BD D0 15 56 5B DF 7A 43 28 CD 7F EF 55 24 BB 66 E9 54 22 02 59 BA 9A 4C 55 88 7A 42 F2 7D D5 AB D6 DA 2C F3 75 18 A6 49 B3 67 E1 8F EF 0A DC B6 D0 E2 8B A8 A4 4B 66 84 76 91 47 D1 6A 7C 62 A4 8D C2 8A 82 6C 14 53 B0 F9 4F 39 22 A2 65 AE D0 21 65 A8 99 68 18 CD 95 2C 69 52 CA 45 94 15 38 AE 37 B9 B1 AD 61 1E 6B 69 23 F9 6B A5 6C 63 22 39 6D C3 55 09 F4 B3 27 45 AA 11 04 7E 1E 3B B3 8A D7 B5 D2 44 63 9A 02 E5 A3 60 B8 AC DB DD 3F 6F 22 90 26 66 30 2B D6 9B BA 91 62 6E A5 DD 59 B6 50 79 80 53 5A E4 0A CD 94 57 92 F3 DE AA 4B 7D EF 52 32 A4 97 A4 F4 AA ED 33 B7 7A BB 08 65 48 91 BB FD D5 AA 02 F5 B6 8F 71 37 6C 56 E5 97 86 3B B8 A0 8B 9B 96 DA 24 10 F6 AD 08 ED E3 8F A2 D2 B9 1B 92 D1 56 A1 DC D1 53 EE 14 55 72 97 CA 14 55 72 0F 91 05 15 56 1D 8F 3A A4 AA 39 08 CA D4 4C B4 00 CD 95 20 15 32 D8 A4 3D 4D 5B B2 8F CE 98 0A E4 5B 9A F4 3B 1B 1B 25 48 C6 45 5B F2 96 BA EC 73 EA 28 89 45 3F 14 58 71 4E 41 45 26 8B 95 3B 21 86 54 53 82 6A 0B 99 14 A5 66 42 39 AB F7 01 8D 66 99 E9 36 6C 84 FB 45 35 AE AB 1B 94 57 7B CA AF 25 E5 00 56 6B 86 6A 8F AD 50 C7 A4 6C C7 E5 19 AB D6 DA 45 C4 DF C3 8A 62 36 EC BC 33 FD FE 6B 76 D7 43 8A 2E C2 8D 88 6C D2 8E DA 38 FA 2D 4D 4D 45 C8 14 6E 14 57 42 8D 8D 92 B0 51 54 50 51 40 05 14 00 51 48 0F 3A A2 A8 E2 12 98 45 20 13 6D 31 F8 A8 99 71 1A 1A B6 7C 3E 37 4F 5C D1 DC B9 6C 76 C2 8A EB 45 D3 F8 42 8A 65 85 32 57 D8 85 8D 44 8C EA 6D 63 90 D4 75 43 1D CF DE A8 1F 5D F9 3A D6 57 22 C6 4D CE A4 65 35 58 DC 56 5B 96 30 DC D4 4D 70 4D 3B 0C 66 E2 69 55 0B 74 14 C0 BD 6F A5 DC 4D FC 38 AD 9B 2F 0C 96 C6 FE 69 92 D9 D0 59 E8 11 45 FC 22 B5 22 B4 8A 3E 8B 48 8D C9 FA 51 5A 46 9F 73 45 0E E1 45 6E 6A 14 50 01 45 00 14 50 01 45 00 14 56 52 13 3C EE 8A D8 E3 0A 4C 52 01 0D 55 99 AB 2A 86 91 23 06 BA 6F 0D C5 F3 2D 63 12 A4 75 D4 57 52 34 8E C1 41 38 EB 49 BB 0A 53 B1 4A EF 54 B6 B5 1F 33 8A E5 B5 7F 15 2B 82 B1 73 58 B6 65 BE A7 2B 71 78 D3 BE E6 A8 3C DA 93 41 3C CA 37 13 4C 63 95 4B 55 CB 7D 3A 79 BA 25 20 35 EC FC 38 CF F7 EB A1 B2 F0 F2 47 FC 20 50 43 66 C4 36 11 45 DA AC 80 17 A5 09 39 09 2B 8B 45 6F 18 D8 D9 2B 05 15 65 05 14 00 51 40 05 14 00 51 40 05 14 00 51 53 60 3C FB 14 62 AC E2 0C 51 8A 00 8E 5E 05 66 CC FF 00 35 61 50 D6 22 45 F3 48 05 76 DE 1F 2A BB 6B 34 12 3A 2A 09 C0 C9 AE 93 6B E8 61 6A 7E 25 B6 B4 C8 56 04 D7 2B A8 F8 BA 79 B2 22 E0 56 2C C1 2E A6 05 C5 F4 D7 07 32 39 35 5F 7D 23 51 33 4E 50 5A 80 2F 5B 69 B7 13 FD D8 CD 6D D8 F8 56 59 3F D6 50 4B 67 43 67 E1 98 A2 1F 74 56 A4 3A 5C 31 D4 DC CE E5 C4 8D 53 EE 8A 7D 54 61 7D CD 23 0E E1 45 6E 6C 14 53 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 38 2C 52 ED AA 38 83 6D 21 14 80 A5 74 D8 15 96 CD 93 5C D5 37 35 88 23 ED 70 6B 6A CB 56 58 47 2D 52 86 CD 11 E3 88 E1 F9 59 3C CA C8 D6 3C 67 73 7A 86 38 47 93 19 F4 EB 5B 5E E8 94 99 CD 3C C5 8E 49 CD 47 BA A4 D4 06 4D 5C B6 D3 6E 2E 3E E4 66 80 37 6C 3C 27 34 BF EB 2B A5 B0 F0 AC 10 E0 B2 8A 46 4E 46 D4 1A 7C 10 F4 5A B4 00 1D 29 59 B0 51 72 16 8A D5 45 23 75 14 82 8A B2 82 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 E2 36 D2 ED AB 38 45 DB 51 CB C0 A4 C6 63 5F BD 67 E6 B9 25 B9 BA 1A C6 AA 4D 25 38 8C 83 75 1C 9A B1 96 AD B4 EB 9B 93 FB B8 C9 AD FD 3F C1 D7 13 60 CB C5 04 B9 1D 35 87 84 6D E0 E5 94 13 5B 90 69 B6 F0 FD D4 A4 63 7B 96 82 85 E8 29 6A 94 7B 9A C6 9F 70 A2 B4 37 0A 28 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 0A 2A 18 1C 76 DA 70 5A D8 E1 17 6D 53 BA 38 15 2C 68 E7 AF 5B 32 55 5A E5 7B 9B A1 AF 4D B7 D3 6E 6F E6 11 C1 19 26 AE 21 B1 D2 5A 78 06 E0 A8 33 48 07 B5 6C D8 F8 32 08 0F CE 33 5A 35 63 1F 69 73 7E DB 4C B7 B7 1F 2A 0A B8 06 3A 54 DA E3 8C 5C 85 A2 AE C7 4A 8A 41 45 32 82 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 02 8A 00 28 A0 0E 4C 0A 90 2D 59 C2 23 F0 2B 22 FD F0 0D 44 86 8E 7D CE E7 26 A4 B7 B7 32 BE 05 72 9B 9D 06 9F E1 F1 26 37 0C D7 57 A4 E9 91 D8 AE 42 FC D5 B4 0C 9F BD A1 A3 45 68 74 72 2B 58 28 A0 A0 A2 81 85 14 80 28 AE 6F AC 2B D8 02 8A E9 00 A2 98 05 14 00 51 40 05 14 00 51 40 05 14 00 51 40 05 14 00 51 40 05 14 01 CC 28 A9 31 56 70 10 4F C2 D7 3B AA 4B 81 59 D4 2E 26 52 D6 EF 87 ED BC C7 CD 73 A3 56 77 B6 90 08 A3 15 3D 6C 88 A6 AF 2B 85 15 67 50 51 40 05 14 00 51 58 D6 76 88 05 15 E4 9D 6A 2A C1 45 7A D4 3E 03 91 85 15 B0 05 14 00 51 40 05 14 00 51 40 05 14 00 51 40 05 14 00 51 40 05 14 01 CE 28 A7 D5 9C 05 0B D7 C0 AE 57 52 97 32 62 B2 A8 6B 12 BA 72 6B B6 F0 C5 B7 CA B5 89 52 3A BA 2B 68 EC 5D 2F 84 28 AA 35 0A 28 00 A2 80 0A 2B 8B 10 FA 17 01 8C E0 50 8F 9A E3 B1 BD C7 D1 5E 9D 1F 80 E5 0A 2B 60 0A 28 00 A2 80 0A 28 00 A2 80 0A 28 00 A2 80 0A 29 00 51 40 05 14 C0 C0 02 91 FA 55 9C 06 36 A3 26 01 AE 52 77 DF 31 35 84 CD A0 4F 64 9B E6 51 5E 91 A1 43 B2 0A CC 53 35 68 AD 96 C6 D0 F8 42 8A A3 40 A2 80 0A 2A 26 F9 55 C1 2B 85 45 3B ED 5E 2B 89 EA 6F CB 62 A0 2E E6 AE C4 9B 47 BD 65 62 67 21 F4 57 A5 05 68 99 05 15 60 14 50 01 45 00 14 50 01 45 4B 00 A2 9D C0 28 A8 73 00 A2 B2 72 10 51 5B C7 61 85 15 40 62 62 A0 B8 38 5A B3 80 E6 B5 79 70 A6 B9 F1 5C F3 DC DE 26 C6 85 06 FB 81 5E 8F 63 1F 97 00 A9 22 65 8A 2B 73 A6 3B 05 14 14 14 50 01 45 65 57 E1 2A 1A 48 29 08 DD D6 B8 8E C9 AD 2E 01 42 F4 A5 AE AA 74 FA B3 87 A8 51 5D 00 14 52 00 A2 A6 33 E6 00 A2 A8 02 8A 2E 01 45 63 29 80 51 4A 3A 80 51 4E 7E EA 25 BB 05 30 CA 83 F8 AB 8F 56 73 EE 28 91 4F 43 4E AD 69 D4 E4 DC B8 CA C1 45 6A EB AE 85 BA 88 C7 22 A8 5F 36 16 BB 0E 44 72 3A BC B9 6D B5 41 2B 9A 47 42 D8 EA FC 2D 6D 92 0D 77 00 60 62 88 91 BC 85 A2 B6 3A 82 8A 00 28 A0 02 8A CE A7 C2 0B 70 A2 B8 0F 41 EB 00 A2 B6 75 7D DB 1C 5C 81 45 6D 46 5A 58 8E A1 45 5C DE 80 14 57 32 D0 02 8A 3D A1 1C C1 45 66 EA 32 39 C4 C8 F5 A5 AC 5B 65 46 E1 45 76 61 E7 72 C2 A1 B8 B8 48 17 2C 69 56 95 DD 8C A6 FA 18 B7 5A B1 63 F2 D6 73 DE CA 7B D4 A4 48 89 7F 2A 9F BD 57 A1 D7 19 47 CD 43 40 3D FC 41 E9 55 5B 5A 9A 56 C2 D4 F2 8A C6 AC 9D 2B 13 52 93 83 5E 93 31 47 1B 7B 2E FB 83 4D 8F 92 2B 98 E8 E8 7A 07 86 21 DA 8B 5D 2D 5A DC CA FE F8 51 5A 1D 61 45 03 0A 28 00 A2 B0 AD 2B 2B 15 0D C2 8A E2 67 6A 0A 29 9C D5 A7 60 A2 A9 3B 1C 5C FA 85 14 F9 83 9C 29 86 44 1D 5A A7 52 48 5E F6 24 EF 55 E4 D5 A3 1D 28 E5 1D 8A B2 6B 5E 95 4E 4D 61 CF 7A BE 52 AC 32 2D 4E 4D F5 AD 06 A3 C7 26 B3 9A 34 89 60 6A 11 F7 A5 3A 8C 03 BD 42 88 A4 55 B8 D6 63 51 F2 56 15 DD F3 4E DC 9A D9 23 32 A1 96 A3 32 D5 81 19 96 98 65 A0 43 3C CA B9 A6 FC D3 8A 00 EA 6E 4E 16 B9 6D 62 6D A8 D5 DD 23 18 9C 83 36 E6 26 AE 69 A9 E6 DC A0 AC 0E 86 7A 86 8B 6F E5 5B 83 5A 55 A2 32 A6 AF 20 A2 A8 EB 0A 28 00 A2 90 05 15 C3 37 CD 22 93 B0 51 59 1D 29 E8 14 85 80 EA 6A 91 C7 5C 8D AE 63 5F E2 A8 1F 51 89 6A F9 4E 62 B4 9A C2 8E 95 52 5D 6B DE AB 94 AB 15 1F 57 73 DE A2 6D 42 46 EF 4C A2 B3 DC 3B 77 A8 B7 13 DE 90 C2 8C D2 01 77 E2 9D F6 92 3B D2 01 0D DB 7A D4 4D 72 7D 69 D8 44 66 6A 67 99 54 21 BB E9 BB A8 10 D3 4D A0 42 D5 BD 38 ED 98 50 33 A7 BF 7C 2D 71 5A FC FC 62 BB 26 67 03 02 B7 7C 31 16 FB AC D6 46 B2 3D 3E D8 6D 81 6A 5A D1 0A 93 0A 29 9D 01 45 43 91 8C AA D8 28 CE 2B 29 36 CC 94 DB 64 66 74 1D E9 56 45 6E 95 97 29 D1 71 CC C1 45 31 25 0D 59 33 AF A0 E9 0E D5 CD 73 DA 95 FB 46 6A E0 73 D5 32 9F 50 91 AA 03 72 ED DE B5 30 19 BC 9A 33 51 71 89 BC 51 E6 8A 43 1A 66 A6 F9 D4 80 4F 36 8F 32 98 09 BE 93 75 51 22 16 A6 E6 80 12 96 98 85 C5 3B 61 F4 A0 07 79 2E 7B 53 D6 CE 43 DA 90 13 A6 9B 21 AB 30 E9 4C 0E 68 11 73 53 93 AD 70 DA C4 BB EE 31 5D 93 26 05 01 5D 4F 85 22 E7 35 89 A4 8F 45 87 FD 5A D3 E8 B9 CA 14 56 A7 6C 17 BA 14 50 61 2B 46 41 58 17 DA 9E C9 19 73 50 D1 2B 73 35 F5 6C 9E B5 AB A7 DC 97 A8 67 4D 3D 59 6A F2 7D AB 51 59 5C 6E 7A E6 67 61 7E E6 50 23 AE 3F 59 94 6E A2 26 33 32 3C FA 3E D1 54 60 27 DA 29 3C FA 40 37 CE A4 F3 68 00 DF 4B 9A 62 1C 29 E0 53 01 E1 69 FE 5B 1E D5 42 1C 2D DC F6 A7 8B 19 0F 6A 40 4C 9A 63 9A B5 1E 90 4F 6A 57 02 D4 7A 2F B5 5B 8F 46 1F DD A5 71 16 53 49 51 53 AE 9A 82 A7 98 44 CB 67 18 A9 04 28 3B 54 73 08 E3 75 79 B0 AD 5C 2D CC 9B E6 63 5E 8C C2 03 10 F3 5D FF 00 85 62 55 8D 33 59 95 33 B4 1D 28 A9 5B 9C C1 45 74 1E 87 42 0B 9B B8 AD 97 2E D5 87 FF 00 09 64 06 E0 C7 8E 95 17 38 DF BC EE 3E EB 5F 4F 28 ED 35 C6 5E EA 7B E5 63 9A 86 CB 8C 4A D0 5D 99 26 02 BB 3D 28 FC 82 B3 93 3A A9 22 5D 46 4F 96 B3 6D EF FC B7 EB 58 5C DA 44 F7 1A C0 2B D6 B0 75 09 FC DA B3 09 33 25 A6 E6 9E AC 4D 51 04 83 34 F0 A6 A4 44 82 16 3D A9 EB 6B 21 ED 4A E0 58 4B 09 0F 6A B2 9A 5B 9A 43 2C C7 A4 1A B5 1E 8F ED 45 C0 B3 1E 8F ED 56 93 49 1E 94 B9 84 58 4D 2D 45 4C BA 7A 0A 9E 71 12 AD A4 62 A5 11 20 ED 53 CC 21 F4 52 B9 21 45 21 05 14 01 E6 9A FD C6 D8 DA B9 16 6A F5 65 B9 54 C1 1B 0C 2B B0 D0 B5 55 8D 17 26 A0 73 3A 23 E2 68 D1 7E F8 AA 92 78 B9 47 46 A9 32 E5 08 BC 70 8B FE B2 3D D5 05 F7 8E 8B 2E DB 58 B6 FB 9A D7 9B 41 DA 5B 1C F5 EE B7 77 75 F7 9E A8 40 ED BE B2 66 96 34 F0 C5 2A 84 D6 B2 66 B1 E7 19 6B 4A B4 61 36 5A BB 5B 01 B5 05 12 95 D1 D1 4C 6D FF 00 2A 6B 9B B9 8D B3 C5 71 AF 8C B9 15 D5 58 75 A8 9F 2C 71 5D 87 3B 23 4B 07 66 AD 3B 5D 23 3D 6A 6E 06 94 5A 2F B5 5B 8F 46 FF 00 66 A4 0B 51 E8 E3 FB B5 66 3D 24 7A 54 DC 0B 29 A6 28 A9 D6 CA 31 53 CC 04 A2 DD 07 6A 78 45 1D AA 2E 21 D4 52 10 51 40 82 8A 64 85 15 44 85 14 80 28 A6 23 FF D9";
//    	String regex = "(.{2})";
//        s = s.replaceAll (" ", "");
//        Map<String, Object> mapParam = new HashMap<String, Object>();
//    	System.out.println(s);
    	byte[] a ={(byte) 0x8D, (byte) 0xFF};
    	System.out.println(getShort(a, true));
//    	uploadFile(HexToByte(s), "");
////    	mapParam.put("image", HexToByte(s));
//    	String pathUrl = "http://61.153.154.143:8888/analog-electric?digits=5";  
//        String result = HttpPostUrl.httpPost(pathUrl, HexToByte(s));
//        JSONObject json = JSONObject.fromObject(result);
//        System.out.println(json.getString("confidence"));
//    	System.out.println(s.length());
//    	System.out.println(convertHexToString("565451554851485153545453495556"));
//    	String s = "8063x";
//    	String a = s.substring(0, 4);
//    	String b = s.substring(4);
//    	double c;
//    	if(!Character.isDigit(b.charAt(0))){
//    		c = Integer.valueOf(a) + Double.valueOf("0.0");
//    	} else {
//    		c = Integer.valueOf(a) + Double.valueOf("0." + b);
//    	}
//    	System.out.println(c);
    }  
}
