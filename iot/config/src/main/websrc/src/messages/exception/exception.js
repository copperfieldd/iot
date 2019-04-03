import { defineMessages } from 'react-intl';

export default defineMessages({
    exception:{
      back:{
        id:"exceptionConfig.back",
        defaultMessage:"返回首页",
      },
      403:{
        desc:{
          id:"exceptionConfig.403.desc",
          defaultMessage:"抱歉，你无权访问该页面",
        }
      },
      404:{
        desc:{
          id:"exceptionConfig.404.desc",
          defaultMessage:"抱歉，你访问的页面不存在",
        }
      },
      500:{
        desc:{
          id:"exceptionConfig.500.desc",
          defaultMessage:"抱歉，服务器出错了",
        }
      }
    }
  });