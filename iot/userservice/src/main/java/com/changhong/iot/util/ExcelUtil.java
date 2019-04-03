package com.changhong.iot.util;

import com.changhong.iot.base.exception.ByteException;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.util.*;

/*
        <dependency>
			<groupId>org.apache.poi</groupId>
			<artifactId>poi-ooxml</artifactId>
			<version>3.17</version>
		</dependency>
 */

public class ExcelUtil {

    public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";
    public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";

    public static final String POINT = ".";


    /**
     * Read the Excel
     * @param is excel文件的io流
     * @param name excle文件名
     * @param ignoreRow 忽略的行数
     * @param cellNameAndType 每一列的name和type （type可选值 DOUBLE、STRING、BOOLEAN、ARRAY、INT、LONG）
     * @param regex 如果type为ARRAY,则以regex拆分
     * @param essential 哪些参数不能为空
     * @return
     *
     */
    public static List<Map<String, Object>> readExcel(InputStream is, String name, Integer[] ignoreRow, Map<String, String> cellNameAndType, List<String> essential, String regex) throws IOException, ByteException {
        if (name == null || name.isEmpty()) {
            return null;
        } else {
            String postfix = getPostfix(name);
            if (!postfix.isEmpty()) {
                if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
                    return readXls(is, Arrays.asList(ignoreRow), cellNameAndType, essential, regex);
                } else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
                    return readXlsx(is, Arrays.asList(ignoreRow), cellNameAndType, essential, regex);
                }
            }
        }
        return null;
    }

    /**
     * Read the Excel 2010
     */
    public static List<Map<String, Object>> readXlsx(InputStream is, List<Integer> ignoreRow, Map<String, String> cellNameAndType, List<String> essential, String regex) throws IOException, ByteException {

        List<Map<String, Object>> list = new ArrayList<>();

        if (cellNameAndType == null || cellNameAndType.isEmpty()) {
            return list;
        }

        Set<String> keySet = cellNameAndType.keySet();
        List<String> cellName = new ArrayList<>(keySet);

        Map<String, Object> map = null;

        XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
        // Read the Sheet
        try {
            for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
                XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
                if (xssfSheet == null) {
                    continue;
                }
                // Read the Row
                for (int rowNum = 0; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
                    if (ignoreRow != null && ignoreRow.contains(rowNum)) {
                        continue;
                    }
                    XSSFRow xssfRow = xssfSheet.getRow(rowNum);
                    if (xssfRow != null) {
                        map = new HashMap<>();

                        for (int i = 0; i < cellName.size(); i++) {
                            map.put(cellName.get(i), xssfRow.getCell(i));
                        }

                        boolean empty = true;
                        Set<Map.Entry<String, Object>> entries = map.entrySet();
                        for (Map.Entry<String, Object> entry : entries) {
                            Object value = entry.getValue();
                            if (value != null && !value.toString().isEmpty()) {
                                empty = false;
                            }
                        }
                        if (empty) {
                            continue;
                        }

                        if (essential != null && !essential.isEmpty()) {
                            for (String key : essential) {
                                Object o = map.get(key);
                                if (o == null || o.toString().isEmpty()) {
                                    throw new ByteException(1, key + "数据不能为空！");
                                }
                            }
                        }

                        for (int i = 0; i < cellName.size(); i++) {
                            XSSFCell value = (XSSFCell) map.get(cellName.get(i));
                            Object obj = null;
                            if (value != null) {
                                String type = cellNameAndType.get(cellName.get(i));
                                value.setCellType(CellType.STRING);
                                obj = getValue(value);
                                try {
                                    switch (type) {
                                        case "ARRAY":
                                            obj = string2Vector(obj.toString(), regex);
                                            break;
                                        case "STRING":
                                            break;
                                        case "BOOLEAN":
                                            obj = Boolean.valueOf(obj.toString().trim());
                                            break;
                                        case "DOUBLE":
                                            obj = Double.valueOf(obj.toString().trim());
                                            break;
                                        case "INT":
                                            obj = Integer.valueOf(obj.toString().trim());
                                            break;
                                        case "LONG":
                                            obj = Long.valueOf(obj.toString().trim());
                                            break;
                                        default: break;
                                    }
                                } catch (NumberFormatException e) {
                                    throw new ByteException(1, obj + "转" + type.toLowerCase() + "失败！");
                                }
                            }
                            map.put(cellName.get(i), obj);
                        }
                        list.add(map);
                    }
                }
            }
        } finally {
            if (xssfWorkbook != null) {
                xssfWorkbook.close();
            }
        }

        return list;
    }

    /**
     * Read the Excel 2003-2007
     */
    public static List<Map<String, Object>> readXls(InputStream is, List<Integer> ignoreRow, Map<String, String> cellNameAndType, List<String> essential, String regex) throws IOException, ByteException {

        List<Map<String, Object>> list = new ArrayList<>();

        if (cellNameAndType == null || cellNameAndType.isEmpty()) {
            return list;
        }

        Set<String> keySet = cellNameAndType.keySet();
        List<String> cellName = new ArrayList<>(keySet);

        Map<String, Object> map = null;

        HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
        // Read the Sheet
        try {
            for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
                HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
                if (hssfSheet == null) {
                    continue;
                }
                // Read the Row
                for (int rowNum = 0; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
                    if (ignoreRow != null && ignoreRow.contains(rowNum)) {
                        continue;
                    }
                    HSSFRow hssfRow = hssfSheet.getRow(rowNum);
                    if (hssfRow != null) {
                        map = new HashMap<>();

                        for (int i = 0; i < cellName.size(); i++) {
                            map.put(cellName.get(i), hssfRow.getCell(i));
                        }

                        boolean empty = true;
                        Set<Map.Entry<String, Object>> entries = map.entrySet();
                        for (Map.Entry<String, Object> entry : entries) {
                            Object value = entry.getValue();
                            if (value != null && !value.toString().isEmpty()) {
                                empty = false;
                            }
                        }
                        if (empty) {
                            continue;
                        }

                        if (essential != null && !essential.isEmpty()) {
                            for (String key : essential) {
                                Object o = map.get(key);
                                if (o == null || o.toString().isEmpty()) {
                                    throw new ByteException(1, key + "数据不能为空！");
                                }
                            }
                        }

                        for (int i = 0; i < cellName.size(); i++) {
                            HSSFCell value = (HSSFCell) map.get(cellName.get(i));
                            Object obj = null;
                            if (value != null) {
                                String type = cellNameAndType.get(cellName.get(i));
                                value.setCellType(CellType.STRING);
                                obj = getValue(value);
                                try {
                                    switch (type) {
                                        case "ARRAY":
                                            obj = string2Vector(obj.toString(), regex);
                                            break;
                                        case "STRING":
                                            break;
                                        case "BOOLEAN":
                                            obj = Boolean.valueOf(obj.toString().trim());
                                            break;
                                        case "DOUBLE":
                                            obj = Double.valueOf(obj.toString().trim());
                                            break;
                                        case "INT":
                                            obj = Integer.valueOf(obj.toString().trim());
                                            break;
                                        case "LONG":
                                            obj = Long.valueOf(obj.toString().trim());
                                            break;
                                        default: break;
                                    }
                                } catch (NumberFormatException e) {
                                    throw new ByteException(1, obj + "转" + type.toLowerCase() + "失败！");
                                }
                            }
                            map.put(cellName.get(i), obj);
                        }
                        list.add(map);
                    }
                }
            }
        } finally {
            if (hssfWorkbook != null) {
                hssfWorkbook.close();
            }
        }

        return list;
    }

    private static Object getValue(XSSFCell xssfRow) {
        switch (xssfRow.getCellTypeEnum()) {
            case STRING : return xssfRow.getStringCellValue();
            case NUMERIC : return xssfRow.getNumericCellValue();
            case BOOLEAN : return xssfRow.getBooleanCellValue();
            case BLANK : return xssfRow.getRawValue();
            case ERROR : return xssfRow.getErrorCellString();
            case _NONE : return xssfRow.getStringCellValue();
            case FORMULA : return xssfRow.getRawValue();
        }
        return null;
    }

    private static Object getValue(HSSFCell hssfCell) {
        switch (hssfCell.getCellTypeEnum()) {
            case STRING : return hssfCell.getStringCellValue();
            case NUMERIC : return hssfCell.getNumericCellValue();
            case BOOLEAN : return hssfCell.getBooleanCellValue();
            case BLANK : return hssfCell.getStringCellValue();
            case ERROR : return hssfCell.getErrorCellValue();
            case _NONE : return hssfCell.getStringCellValue();
            case FORMULA : return hssfCell.getStringCellValue();
        }
        return null;
    }


    private static Vector<String> string2Vector(String value, String regex) {

        Vector<String> result = new Vector();

        if (value != null && value.length() > 0) {

            String[] items = value.split(regex);

            result = new Vector<>(Arrays.asList(items));
        }

        return result;
    }

    /**
     * get postfix of the path
     * @param path
     * @return
     */
    private static String getPostfix(String path) {
        if (path == null || path.trim().isEmpty()) {
            return "";
        }
        if (path.contains(POINT)) {
            return path.substring(path.lastIndexOf(POINT) + 1, path.length());
        }
        return "";
    }

	public static void exportToExcel(String pathName, String fileName, String sheetName, Vector<String> titles, Vector<Vector<String>> values) {

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
        FileOutputStream fout = null;
        try
        {
        	File file = new File(pathName+fileName);

            fout = new FileOutputStream(file);
            wb.write(fout);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally {
            if (fout != null) {
                try {
                    fout.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
	}

}
