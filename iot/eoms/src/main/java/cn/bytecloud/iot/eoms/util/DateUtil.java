package cn.bytecloud.iot.eoms.util;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.common.base.Strings;

public class DateUtil {

    /**
     * 
     * @author Rita 
     * @date 2018年5月13日 下午12:51:15 
     * @MethodsName: strToDateLong 
     * @Description: 将长时间格式字符串转换为时间 yyyy/MM/dd HH:mm:ss
     * @param strDate
     * @return Date
     */
    public static Date strToDateLong(String strDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        ParsePosition pos = new ParsePosition(0);
        Date strtodate = formatter.parse(strDate, pos);
        return strtodate;
    }

    
    /**
     * @author Rita
     * @date 2018年5月13日 下午1:10:03 
     * @MethodsName: dateToStrLong
     * @Description: 将长时间格式时间转换为字符串 yyyy/MM/dd HH:mm:ss       
     * @param dateDate
     * @return String   
     */
    public static String dateToStrLong(Date dateDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String dateString = formatter.format(dateDate);
        return dateString;
    }
    
    /**
     * @MethodsName: dateToStrShort
     * @Description: 将长时间格式时间转换为字符串 yyyy/MM/dd    
     * @param dateDate
     * @return String   
     */
    public static String dateToStrShort(Date dateDate) {
    	SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
    	String dateString = formatter.format(dateDate);
    	return dateString;
    }
    
    /**
     * getFirstDayDateOfMonth:(获取传入日期月份). <br/>
     *
     * @author haocj
     * @param date
     * @return
     * @since JDK 1.8
     */
    public static int getMonthOfDate(final String date) {  
    	final Calendar cal = Calendar.getInstance();  
    	cal.setTime(strToDateLong(date));  
    	return cal.get(Calendar.MONTH) + 1;  
    } 
    
    /**
     * getFirstDayDateOfMonth:(获取传入日期年份). <br/>
     *
     * @author haocj
     * @param date
     * @return
     * @since JDK 1.8
     */
    public static int getYearOfDate(final String date) {  
    	final Calendar cal = Calendar.getInstance();  
    	cal.setTime(strToDateLong(date));  
    	return cal.get(Calendar.YEAR);  
    } 
	
	/**
	 * getFirstDayDateOfMonth:(获取传入日期所在月的第一天). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getFirstDayDateOfMonth(final Date date) {  
	    final Calendar cal = Calendar.getInstance();  
	    cal.setTime(date);  
	    final int last = cal.getActualMinimum(Calendar.DAY_OF_MONTH);  
	    cal.set(Calendar.DAY_OF_MONTH, last);  
	    return cal.getTime();  
	} 
	
	/**
	 * getLastDayOfMonth:(获取传入日期所在月的最后一天). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayOfMonth(final Date date) {  
	    final Calendar cal = Calendar.getInstance();  
	    cal.setTime(date);  
	    final int last = cal.getActualMaximum(Calendar.DAY_OF_MONTH);  
	    cal.set(Calendar.DAY_OF_MONTH, last);  
	    return cal.getTime();  
	}  
	
	/**
	 * getFirstDayDateOfYear:(获取传入日期所在年的第一天). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getFirstDayDateOfYear(final Date date) {  
	    final Calendar cal = Calendar.getInstance();  
	    cal.setTime(date);  
	    final int last = cal.getActualMinimum(Calendar.DAY_OF_YEAR);  
	    cal.set(Calendar.DAY_OF_YEAR, last);  
	    return cal.getTime();  
	}  
	
	/**
	 * getLastDayOfYear:(获取传入日期所在年的最后一天). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayOfYear(final Date date) {  
	    final Calendar cal = Calendar.getInstance();  
	    cal.setTime(date);  
	    final int last = cal.getActualMaximum(Calendar.DAY_OF_YEAR);  
	    cal.set(Calendar.DAY_OF_YEAR, last);  
	    return cal.getTime();  
	}  
    
    /**
     * @author haocj
	 * 获取当前年度
	 */
	public static int getCurYear(){
		return Calendar.getInstance().get(Calendar.YEAR);
	  
	}
	
	/**
	 * 
	 * @author haocj
	 * 获取当前月份
	 */
	public static int getCurMonth(){ 
		return Calendar.getInstance().get(Calendar.MONTH) + 1;
    
	}
	
    /** 
     * 获取上一个月 
     *  
     * @return 
     */  
    public static int getLastMonth() {  
        Calendar cal = Calendar.getInstance();  
        cal.add(cal.MONTH, -1);  
        SimpleDateFormat dft = new SimpleDateFormat("yyyyMM");  
        int lastMonth = Integer.valueOf(dft.format(cal.getTime()));  
        return lastMonth;  
    } 
	
	//2.0新加时间结构格式化
	public static final String STANDARD_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public static boolean isValidDateTime(String time) {
	
		if (Strings.isNullOrEmpty(time)) {
			return false;
		}
		
		// 指定好一个日期格式的字符串
		String pat = "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(time) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{4}/\\d{2}/\\d{2} \\d{2}:\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(time);
			
			if (m.matches()) {
				return true;
			} else {
				pat = "\\d{4}/\\d{2}/\\d{2} \\d{2}:\\d{2}:\\d{2}";
				p = Pattern.compile(pat);
				m = p.matcher(time);
				
				if (m.matches()) {
					return true;
				} else {
					pat = "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}";
					p = Pattern.compile(pat);
					m = p.matcher(time);
					
					if (m.matches()) {
						return true;
					}
				}
			}
		}
		
		return false;
	}
	
	

	public static boolean isValidTime(String time) {
		
		if (Strings.isNullOrEmpty(time)) {
			return false;
		}
		
		// 指定好一个日期格式的字符串
		String pat = "\\d{2}:\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(time) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{2}:\\d{2}:\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(time);
			
			if (m.matches()) {
				return true;
			}
		}
		
		return false;
	}
	
	
	public static boolean isValidDate(String date) {
		
		if (Strings.isNullOrEmpty(date)) {
			return false;
		}
		
		// 指定好一个日期格式的字符串
		String pat = "\\d{4}-\\d{2}-\\d{2}";
		// 指定好正则表达式
		Pattern p = Pattern.compile(pat) ;
		// 实例化Pattern类
		Matcher m = p.matcher(date) ;
		// 实例化Matcher类
		if(m.matches()){
			// 进行验证的匹配，使用正则
			return true;
		} else {
			pat = "\\d{4}/\\d{2}/\\d{2}";
			p = Pattern.compile(pat);
			m = p.matcher(date);
			
			if (m.matches()) {
				return true;
			}
		}
		
		return false;
	}
	
	
	public static String toTimeStampFormat(String time) {
		
		return time.replaceAll("/", "-");
		
	}
	

	public static String toDateFormat(String date) {
		
		return date.replaceAll("/", "-");
		
	}
	
	
	public static int compareDays(Date date1,Date date2) {
		int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
		return days;
	}
	
	/**
	 * getLastDay:(获取当前时间前一天从0点开始). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayStart(Date date) {  
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);  
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        calendar.set(Calendar.HOUR,-12);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);
        calendar.set(Calendar.MILLISECOND,0);
        date = calendar.getTime();  
        return date;  
    }  
	
	/**
	 * getLastDay:(获取当前时间前一天以24点结束). <br/>
	 *
	 * @author haocj
	 * @param date
	 * @return
	 * @since JDK 1.8
	 */
	public static Date getLastDayEnd(Date date) {  
		Calendar calendar = Calendar.getInstance();  
		calendar.setTime(date);  
		calendar.add(Calendar.DAY_OF_MONTH, -1);
		calendar.set(Calendar.HOUR,11);
		calendar.set(Calendar.MINUTE,59);
		calendar.set(Calendar.SECOND,59);
		calendar.set(Calendar.MILLISECOND,999);
		date = calendar.getTime();  
		return date;  
	} 
	
    /**
     * 获取任意时间的下一个月
     * 描述:<描述函数实现的功能>.
     * @param repeatDate
     * @return
     */
    public static String getPreMonth(String repeatDate) {
        String lastMonth = "";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dft = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        int year = Integer.parseInt(repeatDate.substring(0, 4));
        String monthsString = repeatDate.substring(5, 7);
        int month;
        if ("0".equals(monthsString.substring(0, 1))) {
            month = Integer.parseInt(monthsString.substring(1, 2));
        } else {
            month = Integer.parseInt(monthsString.substring(0, 2));
        }
        cal.set(year,month,cal.get(cal.DAY_OF_MONTH));
        lastMonth = dft.format(cal.getTime());
        return lastMonth;
    }
    
    /**
     * 获取任意时间的上一个月
     * 描述:<描述函数实现的功能>.
     * @param repeatDate
     * @return
     */
    public static String getBefMonth(String repeatDate) {
        String lastMonth = "";
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat dft = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        int year = Integer.parseInt(repeatDate.substring(0, 4));
        String monthsString = repeatDate.substring(5, 7);
        int month;
        if ("0".equals(monthsString.substring(0, 1))) {
            month = Integer.parseInt(monthsString.substring(1, 2));
        } else {
            month = Integer.parseInt(monthsString.substring(0, 2));
        }
        cal.set(year,month-2,cal.get(cal.DAY_OF_MONTH));
        lastMonth = dft.format(cal.getTime());
        return lastMonth;
    }
	
	public static void main(String[] args) {
		System.out.println(DateUtil.getPreMonth("2018/12/24 09:36:47"));
	}
	
}
