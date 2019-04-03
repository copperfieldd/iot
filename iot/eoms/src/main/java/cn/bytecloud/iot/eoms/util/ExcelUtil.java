package cn.bytecloud.iot.eoms.util;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Vector;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


public class ExcelUtil {

    /**
     * 
     * @author Rita
     * @date 2018年5月18日 上午5:57:47 
     * @MethodsName: exportToExcelHSSF
     * @Description: 导出2003版  后缀为xls       
     * @param pathName
     * @param fileName
     * @param sheetName
     * @param titles
     * @param values void
     */
    public static void exportToExcelHSSF(String pathName, String fileName, String sheetName, Vector<String> titles, Vector<Vector<String>> values) {
        
        // 第一步，创建一个webbook，对应一个Excel文件  
        HSSFWorkbook wb = new HSSFWorkbook();  
        // 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet  
        HSSFSheet sheet = wb.createSheet(sheetName);  
        // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short  
        HSSFRow row = sheet.createRow((int) 0);  
        // 第四步，创建单元格，并设置值表头 设置表头居中  
        HSSFCellStyle style = wb.createCellStyle();  
        style.setAlignment(HorizontalAlignment.CENTER); // 创建一个居中格式  
  
        HSSFCell cell = row.createCell(0);  
        
        for (int i=0; i<titles.size(); i++) {
            cell.setCellValue(titles.elementAt(i));  
            cell.setCellStyle(style);  
            cell = row.createCell(i+1);
        }
        
        for (int i=0; i<values.size(); i++) {
            
            Vector<String> item = values.elementAt(i);

            row = sheet.createRow((int) i + 1);  
            
            for (int j=0; j<item.size(); j++) {
                
                // 第四步，创建单元格，并设置值  
                row.createCell(j).setCellValue(item.elementAt(j));
                
            }
            
        }
        
        FileUtil.createDir(pathName);
        
        // 第六步，将文件存到指定位置  
        try  
        {  
            File file = new File(pathName+fileName);
            
            FileOutputStream fout = new FileOutputStream(file);  
            wb.write(fout);  
            fout.close();  
        }  
        catch (Exception e)  
        {  
            e.printStackTrace();  
        }  
    }
    
    
    /**
     * 
     * @author Rita
     * @date 2018年5月18日 上午5:58:33 
     * @MethodsName: exportToExcelXSSF
     * @Description: 导出2007版  后缀为xlsx       
     * @param pathName
     * @param fileName
     * @param sheetName
     * @param titles
     * @param values void
     */
       public static void exportToExcelXSSF(String pathName, String fileName, String sheetName, Vector<String> titles, Vector<Vector<String>> values) {
            
            // 第一步，创建一个webbook，对应一个Excel文件  
           // HSSFWorkbook wb = new HSSFWorkbook();  
            XSSFWorkbook wb = new XSSFWorkbook();
            // 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet  
           // HSSFSheet sheet = wb.createSheet(sheetName); 
            XSSFSheet sheet = wb.createSheet(sheetName); 
            // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short  
            XSSFRow row = sheet.createRow((int) 0);  
            // 第四步，创建单元格，并设置值表头 设置表头居中  
            XSSFCellStyle style = wb.createCellStyle();  
            style.setAlignment(HorizontalAlignment.CENTER); // 创建一个居中格式  
      
            XSSFCell cell = row.createCell(0);  
            
            for (int i=0; i<titles.size(); i++) {
                cell.setCellValue(titles.elementAt(i));  
                cell.setCellStyle(style);  
                cell = row.createCell(i+1);
            }
            
            for (int i=0; i<values.size(); i++) {
                
                Vector<String> item = values.elementAt(i);

                row = sheet.createRow((int) i + 1);  
                
                for (int j=0; j<item.size(); j++) {
                    
                    // 第四步，创建单元格，并设置值  
                    row.createCell(j).setCellValue(item.elementAt(j));
                    
                }
                
            }
            
            FileUtil.createDir(pathName);
            
            // 第六步，将文件存到指定位置  
            try  
            {  
                File file = new File(pathName+fileName);
                
                FileOutputStream fout = new FileOutputStream(file);  
                wb.write(fout);  
                fout.close();  
            }  
            catch (Exception e)  
            {  
                e.printStackTrace();  
            }  
        }
        
}
