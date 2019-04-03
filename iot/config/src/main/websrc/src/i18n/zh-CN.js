import antdZh from 'antd/lib/locale-provider/zh_CN';
import appLocaleData from 'react-intl/locale-data/zh';
import enMessages from '../locales/zh.json';

export default {
  messages: {
    ...enMessages,
  },
  antd: antdZh,
  locale: 'zh-CN',
  data: appLocaleData,
};
