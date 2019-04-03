package com.changhong.iot.util;
import com.changhong.iot.base.exception.ByteException;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public class ExcelUtil {

	public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";
    public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";

    public static final String EMPTY = "";
    public static final String POINT = ".";
    public static final String LIB_PATH = "lib";
    public static final String NOT_EXCEL_FILE = " : Not the Excel file!";
    public static final String PROCESSING = "Processing...";
    
    
    /**
     * read the Excel file
     * @return
     * @throws IOException
     */
    public static List<Map<String, Object>> readExcel(InputStream is, String name) throws IOException, ByteException {
        if (name == null || EMPTY.equals(name)) {
            return null;
        } else {
            String postfix = getPostfix(name);
            if (!EMPTY.equals(postfix)) {
                if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
                    return readXls(is);
                } else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
                    return readXlsx(is);
                }
            } else {
            	System.out.println(name + NOT_EXCEL_FILE);
            }
        }
        return null;
    }

    /**
     * Read the Excel 2010
     * @return
     * @throws IOException
     * @throws ByteException 
     */
    public static List<Map<String, Object>> readXlsx(InputStream is) throws IOException, ByteException {
        XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = null;
        // Read the Sheet
        for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
            XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
            if (xssfSheet == null) {
                continue;
            }
            // Read the Row
            for (int rowNum = 1; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
                XSSFRow xssfRow = xssfSheet.getRow(rowNum);
                if (xssfRow != null) {
                    map = new HashMap<>();
                    
                    XSSFCell name = xssfRow.getCell(0);
                    XSSFCell pCode = xssfRow.getCell(1);
                    XSSFCell code = xssfRow.getCell(2);

                    if ((name != null && !name.toString().isEmpty()) || (pCode != null && !pCode.toString().isEmpty())
                            || (code != null && !code.toString().isEmpty())) {
                        
                    
                        if (code == null || name == null || code.toString().isEmpty() || name.toString().isEmpty()) {
                        	
                        	if (xssfWorkbook != null) {
                            	xssfWorkbook.close();
                            }
                        	throw new ByteException(1004);
                        }

                        name.setCellType(Cell.CELL_TYPE_STRING);
                        code.setCellType(Cell.CELL_TYPE_STRING);

                        map.put("name", getValue(name));
                        map.put("code", getValue(code));


                        if (pCode != null) {
                            pCode.setCellType(Cell.CELL_TYPE_STRING);
                            map.put("pCode", getValue(pCode));
                        }

                        list.add(map);
                    }
                }
            }
        }
       
        if (xssfWorkbook != null) {
        	xssfWorkbook.close();
        }
        
        return list;
    }

    /**
     * Read the Excel 2003-2007
     * @return
     * @throws IOException
     * @throws ByteException 
     */
    public static List<Map<String, Object>> readXls(InputStream is) throws IOException, ByteException {
        HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> map = null;
        // Read the Sheet
        for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
            HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
            if (hssfSheet == null) {
                continue;
            }
            // Read the Row
            for (int rowNum = 1; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
                HSSFRow hssfRow = hssfSheet.getRow(rowNum);
                if (hssfRow != null) {
                    map = new HashMap<>();

                    HSSFCell name = hssfRow.getCell(0);
                    HSSFCell pCode = hssfRow.getCell(1);
                    HSSFCell code = hssfRow.getCell(2);

                    if ((name != null && !name.toString().isEmpty()) || (pCode != null && !pCode.toString().isEmpty())
                            || (code != null && !code.toString().isEmpty())) {


                        if (code == null || name == null || code.toString().isEmpty() || name.toString().isEmpty()) {

                            if (hssfWorkbook != null) {
                                hssfWorkbook.close();
                            }
                            throw new ByteException(1004, "数据不完整！");
                        }

                        name.setCellType(Cell.CELL_TYPE_STRING);
                        code.setCellType(Cell.CELL_TYPE_STRING);

                        map.put("name", getValue(name));
                        map.put("code", getValue(code));


                        if (pCode != null) {
                            pCode.setCellType(Cell.CELL_TYPE_STRING);
                            map.put("pCode", getValue(pCode));
                        }

                        list.add(map);
                    }
                }
            }
        }
        
        if (hssfWorkbook != null) {
        	hssfWorkbook.close();
        }

        return list;
    }

    @SuppressWarnings("static-access")
    private static String getValue(XSSFCell xssfRow) {
        if (xssfRow.getCellType() == xssfRow.CELL_TYPE_BOOLEAN) {
            return String.valueOf(xssfRow.getBooleanCellValue()).trim();
        } else if (xssfRow.getCellType() == xssfRow.CELL_TYPE_NUMERIC) {
            return String.valueOf(xssfRow.getNumericCellValue()).trim();
        } else {
            return String.valueOf(xssfRow.getStringCellValue()).trim();
        }
    }

    @SuppressWarnings("static-access")
    private static String getValue(HSSFCell hssfCell) {
        if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
            return String.valueOf(hssfCell.getBooleanCellValue()).trim();
        } else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
            return String.valueOf(hssfCell.getNumericCellValue()).trim();
        } else {
            return String.valueOf(hssfCell.getStringCellValue()).trim();
        }
    }
	
     
    private Vector<String> getVector(XSSFCell xssfRow, String regex) {
    	
    	Vector<String> result = null;
    	
    	String value = xssfRow.toString().trim();
//    	getStringCellValue();
    	
    	if (value != null && value.length() > 0) {
    		
    		String[] items = value.split(regex);

    		result = new Vector<String>();
    		for (String item : items) {
        		result.addElement(item);
    		}
    	}
    	
    	return result;
    	
    }
    
    private Vector<String> getVector(HSSFCell hssfCell, String regex) {
    	
    	Vector<String> result = null;
    	
    	String value = hssfCell.toString().trim();
    	
    	if (value != null && value.length() > 0) {
    		
    		String[] items = value.split(regex);

    		result = new Vector<String>();
    		for (String item : items) {
        		result.addElement(item);
    		}
    	}
    	
    	return result;
    	
    }
    
    /**
     * get postfix of the path
     * @param path
     * @return
     */
    private static String getPostfix(String path) {
        if (path == null || EMPTY.equals(path.trim())) {
            return EMPTY;
        }
        if (path.contains(POINT)) {
            return path.substring(path.lastIndexOf(POINT) + 1, path.length());
        }
        return EMPTY;
    }
}
