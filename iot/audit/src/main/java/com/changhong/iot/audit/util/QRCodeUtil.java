package com.changhong.iot.audit.util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Hashtable;
import java.util.Map;

public class QRCodeUtil {
	// 生成二维码
    public static String encode(String contents, int width, int height, String imgPath) {
    	

        String curDir = Thread.currentThread().getContextClassLoader().getResource("/").getPath();
        
        curDir = curDir.replace("/WEB-INF/classes/", "");
        curDir = curDir.substring(0, curDir.lastIndexOf("/"));
        
        System.out.println("[DEBUG]当前目录："+curDir);
        
        String imgName = StringUtil.getCurrTime() + StringUtil.getRandomInteger(4) + ".png";
    	
        Map<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
        // 指定纠错等级
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        // 指定编码格式
        hints.put(EncodeHintType.CHARACTER_SET, "UTF8");

        //curDir = curDir.replace("/bin", "/webapps");

        FileUtil.createDir(curDir+imgPath);
        
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(contents, BarcodeFormat.QR_CODE, width, height, hints);         
            MatrixToImageWriter.writeToStream(bitMatrix, "png", new FileOutputStream(curDir+imgPath+imgName));        
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return imgName;
    }
    
    // 二维码解析
    public static String decode(String imgPath) {

        String curDir = System.getProperty("user.dir");
        curDir = curDir.replace("/bin", "/webapps");
        
        BufferedImage image = null;
        Result result = null;
        try {
            image = ImageIO.read(new File(curDir+imgPath));
            if (image == null) {
                System.out.println("the decode image may be not exit.");
            }
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));         
            Map<DecodeHintType, Object> hints = new Hashtable<DecodeHintType, Object>();
            hints.put(DecodeHintType.CHARACTER_SET, "UTF8");         
            result = new MultiFormatReader().decode(bitmap, hints);
            return result.getText();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
