package com.changhong.iot.common.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

/**
 * Created by guiqijiang on 11/6/18.
 */
public class QRCodeUtil {

    /**
     * 生成二维码
     *
     * @param contents  二维码内容
     * @param imageType 二维码图片类型
     * @param w         图片高度
     * @param h         图片宽度
     * @return 二维码流
     * @throws Exception
     */
    public static byte[] getQrCode(String contents, String imageType, int w, int h) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(contents, BarcodeFormat.QR_CODE, w, h);
        BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, imageType, outputStream);
        byte[] bytes = outputStream.toByteArray();
        return bytes;
    }

    /**
     * 生成Base64图片数据
     *
     * @param contents  二维码内容
     * @param imageType 二维码图片类型
     * @param w         高度
     * @param h         宽度
     * @return base64图片数据
     * @throws Exception
     */
    public static String getBase64QrCodeToString(String contents, String imageType, int w, int h) throws Exception {
        BASE64Encoder base64Encoder = new BASE64Encoder();
        return base64Encoder.encode(getQrCode(contents, imageType, w, h));
    }

}
