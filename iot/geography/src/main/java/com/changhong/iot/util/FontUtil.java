package com.changhong.iot.util;

import java.awt.Font;
import java.awt.FontFormatException;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class FontUtil {

	public Font getCustomFont(String basePath, String filename, Integer size) {  
		
        Font font = null;  
        //字体文件在conf下面  
        String filepath = basePath + filename;  
        File file = new File(filepath);  
        
        try {  
            
        	FileInputStream fi = new FileInputStream(file);  
            BufferedInputStream fb = new BufferedInputStream(fi);  
            font = Font.createFont(Font.TRUETYPE_FONT, fb);  
            
        } catch (FontFormatException e) {  
            return null;  
        } catch (FileNotFoundException e) {  
            return null;  
        } catch (IOException e) {  
            return null;  
        }  
        
        if("宋体.ttf".equals(filename)) {  
            font = font.deriveFont(Font.BOLD, size);  
        } else {  
            font = font.deriveFont(Font.PLAIN, size);  
        }  
        
        return font;  
    }  
	
	
}
