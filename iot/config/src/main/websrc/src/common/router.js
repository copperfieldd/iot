import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
// import { getMenuData } from './menu';
import messages from '../messages/common/menu';
import { FormattedMessage } from 'react-intl';
let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    component: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function mergeRouterData(menuList, routerConfig) {
  const menuData = getFlatMenuData(menuList);
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
}

export const refreshRouterData = menuList => {
  routerDataCache = mergeRouterData(menuList, routerDataCache);
};

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['login'], () => import('../layouts/BasicLayout')),
    },
    '/index': {
      component: dynamicWrapper(app, ['dashboard'], () => import('../routes/Index')
      ),
      name:<FormattedMessage {...messages.index} />
    },
    // 租户管理
    '/customer/tenantType':{
      component: dynamicWrapper(app, ['tenantType'], () => import('../routes/Customer/TenantType')
      ),
      name:<FormattedMessage {...messages.tenant_category} />
    },
    '/customer/tenantType/add':{
      component: dynamicWrapper(app, ['tenantType'], () => import('../routes/Customer/TenantType/TenantTypeAdd')
      ),
      name:<FormattedMessage {...messages.tenantTypeAdd} />
    },
    '/customer/tenantType/edit/:data':{
      component: dynamicWrapper(app, ['tenantType'], () => import('../routes/Customer/TenantType/TenantTypeEdit')
      ),
      name:<FormattedMessage {...messages.tenantTypeEdit} />
    },
    '/customer/tenantType/item/:data':{
      component: dynamicWrapper(app, ['tenantType'], () => import('../routes/Customer/TenantType/TenantTypeItem')
      ),
      name:<FormattedMessage {...messages.tenantTypeItem} />
    },


    '/customer/tenantManage':{
      component: dynamicWrapper(app, ['tenantManage'], () => import('../routes/Customer/TenantManage')
      ),
      name:<FormattedMessage {...messages.tenant_management} />
    },
    '/customer/tenantManage/add':{
      component: dynamicWrapper(app, ['tenantManage'], () => import('../routes/Customer/TenantManage/TenantManageAdd')
      ),
      name:<FormattedMessage {...messages.tenantAdd} />
    },

    '/customer/tenantManage/edit/:data':{
      component: dynamicWrapper(app, ['tenantManage'], () => import('../routes/Customer/TenantManage/TenantManageEdit')
      ),
      name:<FormattedMessage {...messages.tenantEdit} />
    },
    '/customer/tenantManage/item/:data':{
      component: dynamicWrapper(app, ['tenantManage'], () => import('../routes/Customer/TenantManage/TenantManageItem')
      ),
      name:<FormattedMessage {...messages.tenantItem} />
    },

    //组织机构
    '/customer/organization':{
      component: dynamicWrapper(app, ['organization','customer'], () => import('../routes/Customer/Organization')
      ),
      name:<FormattedMessage {...messages.organization} />
    },
    '/customer/organization/tenantItem/:id':{
      component: dynamicWrapper(app, ['organization','customer'], () => import('../routes/Customer/Organization/TenantItem')
      ),
    },
    '/customer/organization/tenantItem/:id/item/:data':{
      component: dynamicWrapper(app, ['organization','customer'], () => import('../routes/Customer/Organization/OrganizationEditForm')
      ),
    },

    //平台管理员
    '/customer/platManager':{
      component: dynamicWrapper(app, ['platManage',], () => import('../routes/Customer/PlatManage')
      ),
      name:<FormattedMessage {...messages.platform_administrator} />
    },
    '/customer/platManager/add':{
      component: dynamicWrapper(app, ['platManage',], () => import('../routes/Customer/PlatManage/PlatManageAdd')
      ),
      name:<FormattedMessage {...messages.platform_administrator_add} />
    },
    '/customer/platManager/edit/:data':{
      component: dynamicWrapper(app, ['platManage',], () => import('../routes/Customer/PlatManage/PlatManageEdit')
      ),
      name:<FormattedMessage {...messages.platform_administrator_edit} />
    },

    '/permissions/apiManage':{
      component: dynamicWrapper(app, ['permissionsApi'], () => import('../routes/Permissions/Api')
      ),
      name:<FormattedMessage {...messages.api_manager} />
    },
    '/permissions/apiManage/list/api/:id':{
      component: dynamicWrapper(app, ['permissionsApi'], () => import('../routes/Permissions/Api/ApiManage')
      ),
    },
    '/permissions/apiManageAdd':{
      component: dynamicWrapper(app, ['permissionsApi'], () => import('../routes/Permissions/Api/ApiManageAdd')
      ),
      name:<FormattedMessage {...messages.api_manager_add} />
    },
    '/permissions/edit/:id':{
      component: dynamicWrapper(app, ['permissionsApi'], () => import('../routes/Permissions/Api/ApiManageEdit')
      ),
      name:<FormattedMessage {...messages.api_manager_edit} />
    },

    //菜单管理
    '/permissions/menuManage':{
      component: dynamicWrapper(app, ['permissions','permissionsMenu'], () => import('../routes/Permissions/Menu')
      ),
      name:<FormattedMessage {...messages.menu_manager} />
    },
    '/permissions/menuManage/menu/:id':{
      component: dynamicWrapper(app, ['permissions','permissionsRole'], () => import('../routes/Permissions/Menu/MenuList')
      ),
    },
    '/permissions/menuManage/menu/:id/add':{
      component: dynamicWrapper(app, ['permissions','permissionsMenu'], () => import('../routes/Permissions/Menu/MenuManageAdd')
      ),
    },
    '/permissions/menuManage/childAdd':{
      component: dynamicWrapper(app, ['permissions','permissionsMenu'], () => import('../routes/Permissions/Menu/ChildMenuManageAdd')
      ),
    },
    '/permissions/menuManage/menu/:id/edit/:data':{
      component: dynamicWrapper(app, ['permissions','permissionsMenu'], () => import('../routes/Permissions/Menu/MenuManageEdit')
      ),
    },

    //角色管理
    '/permissions/roleManage':{
      component: dynamicWrapper(app, ['permissions','permissionsRole'], () => import('../routes/Permissions/Role')
      ),
      name:<FormattedMessage {...messages.role_manager} />
    },

    '/permissions/roleManage/:data':{
      component: dynamicWrapper(app, ['permissions','permissionsRole'], () => import('../routes/Permissions/Role/RoleManage')
      ),
    },

    '/permissions/adds':{
      component: dynamicWrapper(app, ['permissions','permissionsRole'], () => import('../routes/Permissions/Role/RoleManageAdd')),
      name:<FormattedMessage {...messages.role_add} />
    },
    '/permissions/edits/:data':{
      component: dynamicWrapper(app, ['permissions','permissionsRole'], () => import('../routes/Permissions/Role/RoleManageEdit')),
      name:<FormattedMessage {...messages.role_edit} />

    },


    //应用管理
    //应用列表
    '/application/userApplication':{
      component: dynamicWrapper(app, ['application'], () => import('../routes/Application/UserApplication')
      ),
      name:<FormattedMessage {...messages.application_list} />
    },
    '/application/userApplication/add':{
      component: dynamicWrapper(app, ['application'], () => import('../routes/Application/UserApplication/UserApplicationAdd')),
      name:<FormattedMessage {...messages.application_add} />
    },
    '/application/userApplication/edit/:data':{
      component: dynamicWrapper(app, ['application'], () => import('../routes/Application/UserApplication/UserApplicationEdit')),
      name:<FormattedMessage {...messages.application_edit} />
    },
    '/application/userApplication/item/:data':{
      component: dynamicWrapper(app, ['application'], () => import('../routes/Application/UserApplication/UserApplicationItem')),
      name:<FormattedMessage {...messages.application_item} />
    },
    '/application/userApplication/item/:data/organization/:id':{
      component: dynamicWrapper(app, ['application'], () => import('../routes/Application/UserApplication/OrganizationForm')),
    },

    //终端用户
    '/application/terminalCustomer':{
      component: dynamicWrapper(app, ['terminalCustomer'], () => import('../routes/Application/TerminalCustomer')
      ),
      name:<FormattedMessage {...messages.terminal_customer} />
    },
    '/application/terminalCustomer/add':{
      component: dynamicWrapper(app, ['terminalCustomer'], () => import('../routes/Application/TerminalCustomer/TerminalAdd')),
      name:<FormattedMessage {...messages.terminal_add} />
    },
    '/application/terminalCustomer/edit/:data':{
      component: dynamicWrapper(app, ['terminalCustomer'], () => import('../routes/Application/TerminalCustomer/TerminalEdit')),
      name:<FormattedMessage {...messages.terminal_edit} />

    },
    '/application/terminalCustomer/item/:data':{
      component: dynamicWrapper(app, ['terminalCustomer'], () => import('../routes/Application/TerminalCustomer/TerminalItem')),
      name:<FormattedMessage {...messages.terminal_item} />
    },

    //、告警列表
    '/warning/warningList': {
      component: dynamicWrapper(app, ['warningList'], () => import('../routes/Warning/WarningList')
      ),
      name:<FormattedMessage {...messages.warning_list} />
    },
    //、服务配置
    '/warning/serviceConfig': {
      component: dynamicWrapper(app, ['warningService'], () => import('../routes/Warning/Service')
      ),
      name:<FormattedMessage {...messages.warning_service_config} />
    },
    '/warning/serviceConfig/add': {
      component: dynamicWrapper(app, ['warningService'], () => import('../routes/Warning/Service')
      ),
      name:<FormattedMessage {...messages.warning_service_config_add} />
    },
    '/warning/serviceConfig/edit/:data': {
      component: dynamicWrapper(app, ['warningService'], () => import('../routes/Warning/Service')
      ),
      name:<FormattedMessage {...messages.warning_service_config_edit} />
    },
    //、告警类型
    '/warning/warningType': {
      component: dynamicWrapper(app, ['warningType'], () => import('../routes/Warning/Type')
      ),
      name:<FormattedMessage {...messages.warning_type_list} />
    },
    '/warning/warningType/add': {
      component: dynamicWrapper(app, ['warningType'], () => import('../routes/Warning/Type/WarningTypeAdd')
      ),
      name:<FormattedMessage {...messages.warning_type_add} />
    },
    '/warning/warningType/edit/:data': {
      component: dynamicWrapper(app, ['warningType'], () => import('../routes/Warning/Type/WarningTypeEdit')
      ),
      name:<FormattedMessage {...messages.warning_type_edit} />
    },
    //、通知策略
    '/warning/informStrategy': {
      component: dynamicWrapper(app, ['warningStrategy','warning'], () => import('../routes/Warning/Strategy')
      ),
      name:<FormattedMessage {...messages.notification_interface} />
    },
    '/warning/informStrategy/add': {
      component: dynamicWrapper(app, ['warningStrategy','warning'], () => import('../routes/Warning/Strategy/InformStrategyAdd')
      ),
      name:<FormattedMessage {...messages.notification_interface_add} />
    },
    '/warning/informStrategy/edit/:data': {
      component: dynamicWrapper(app, ['warningStrategy','warning'], () => import('../routes/Warning/Strategy/InformStrategyEdit')
      ),
      name:<FormattedMessage {...messages.notification_interface_edit} />
    },
    //、告警规则
    '/warning/warningRule': {
      component: dynamicWrapper(app, ['warningRule','warning'], () => import('../routes/Warning/Rule')
      ),
      name:<FormattedMessage {...messages.warning_rule_list} />
    },
    '/warning/warningRule/add': {
      component: dynamicWrapper(app, ['warningRule','warning'], () => import('../routes/Warning/Rule/WarningRuleAdd')
      ),
      name:<FormattedMessage {...messages.warning_rule_add} />
    },
    '/warning/warningRule/edit/:data': {
      component: dynamicWrapper(app, ['warningRule','warning'], () => import('../routes/Warning/Rule/WarningRuleEdit')
      ),
      name:<FormattedMessage {...messages.warning_rule_edit} />
    },


    //、国家信息
    '/position/countriesInfo': {
      component: dynamicWrapper(app, ['position'], () => import('../routes/Position/Country')
      ),
      name:<FormattedMessage {...messages.country_info} />
    },
    '/position/countriesInfo/add': {
      component: dynamicWrapper(app, ['position'], () => import('../routes/Position/Country/CountriesInfoAdd')
      ),
      name:<FormattedMessage {...messages.country_add} />
    },
    '/position/countriesInfo/edit/:data': {
      component: dynamicWrapper(app, ['position'], () => import('../routes/Position/Country/CountriesInfoEdit')
      ),
      name:<FormattedMessage {...messages.country_edit} />
    },


    //、行政区域
    '/position/administrativeAreas': {
      component: dynamicWrapper(app, ['position'], () => import('../routes/Position/Areas')
      ),
      name:<FormattedMessage {...messages.administrative_division} />

    },
    '/position/administrativeAreas/areaItem/:id':{
      component: dynamicWrapper(app, ['permissions'], () => import('../routes/Position/Areas/AdministrativeAreas')
      ),
    },
    '/position/administrativeAreas/areaItem/:id/:id':{
      component: dynamicWrapper(app, ['permissions'], () => import('../routes/Position/Areas/AdministrativeAreasItem')
      ),
    },

    //、审计查询
    '/securityAudit/auditQuery':{
      component: dynamicWrapper(app, ['securityAudit'], () => import('../routes/SecurityAudit/Query')
      ),
      name:<FormattedMessage {...messages.audit_enquiry} />
    },

    //、审计类型
    '/securityAudit/auditType':{
      component: dynamicWrapper(app, ['securityAudit'], () => import('../routes/SecurityAudit/Type')
      ),
      name:<FormattedMessage {...messages.audit_type} />
    },
    '/securityAudit/auditType/add':{
      component: dynamicWrapper(app, ['securityAudit'], () => import('../routes/SecurityAudit/Type/AuditTypeAdd')
      ),
      name:<FormattedMessage {...messages.audit_type_add} />
    },
    '/securityAudit/auditType/edit/:data':{
      component: dynamicWrapper(app, ['securityAudit'], () => import('../routes/SecurityAudit/Type/AuditTypeEdit')
      ),
      name:<FormattedMessage {...messages.audit_type_edit} />
    },


    //、管理员
    '/beingPushed/msgTenant':{
      component: dynamicWrapper(app, ['beingPushed','msgTenant'], () => import('../routes/BeingPushed/MsgTenant')
      ),
      name:<FormattedMessage {...messages.message_tenant_manager} />
    },
    //、管理员
    '/beingPushed/msgTenant/add/:data':{
      component: dynamicWrapper(app, ['beingPushed','msgTenant'], () => import('../routes/BeingPushed/MsgTenant/AddMsgTenant')
      ),
      name:<FormattedMessage {...messages.message_tenant_add} />
    },
    //、管理员
    '/beingPushed/msgTenant/edit/:data':{
      component: dynamicWrapper(app, ['beingPushed','msgTenant'], () => import('../routes/BeingPushed/MsgTenant/EditMsgTenant')
      ),
      name:<FormattedMessage {...messages.message_tenant_edit} />
    },
    //、管理员
    '/beingPushed/msgTenant/item/:data':{
      component: dynamicWrapper(app, ['beingPushed','msgTenant'], () => import('../routes/BeingPushed/MsgTenant/MsgTenantItem')
      ),
      name:<FormattedMessage {...messages.message_tenant_item} />
    },


    //应用管理员
    '/beingPushed/msgApplication': {
      component: dynamicWrapper(app, ['beingPushed'], () => import('../routes/BeingPushed/MsgApplication')
      ),
      name:<FormattedMessage {...messages.message_tenant_application} />
    },
    '/beingPushed/msgApplication/add/:data':{
      component: dynamicWrapper(app, ['beingPushed'], () => import('../routes/BeingPushed/MsgApplication/AddMsgApplication')
      ),
      name:<FormattedMessage {...messages.message_application_add} />
    },
    '/beingPushed/msgApplication/item/:id':{
      component: dynamicWrapper(app, ['beingPushed'], () => import('../routes/BeingPushed/MsgApplication/MessageAppItem')
      ),
      name:<FormattedMessage {...messages.message_application_item} />
    },
    '/beingPushed/msgApplication/edit/:data':{
      component: dynamicWrapper(app, ['beingPushed'], () => import('../routes/BeingPushed/MsgApplication/EditMsgApplication')
      ),
      name:<FormattedMessage {...messages.message_application_edit} />
    },

    //消息服务
    '/beingPushed/msgService':{
      component: dynamicWrapper(app, ['msgService'], () => import('../routes/BeingPushed/MsgService')
      ),
      name:<FormattedMessage {...messages.message_service_config} />
    },

    //、消息管理
    '/beingPushed/msgManage':{
      component: dynamicWrapper(app, ['beingPushed'], () => import('../routes/BeingPushed/MsgManage')
      ),
      name:<FormattedMessage {...messages.message_manage} />
    },



    //、配置管理
    '/platformOperation/configManage':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Manage')
      ),
      name:<FormattedMessage {...messages.plt_config_manage} />
    },
    '/platformOperation/configManage/add':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Manage/ConfigManageAdd')
      ),
      name:<FormattedMessage {...messages.plt_config_add} />
    },
    '/platformOperation/configManage/edit/:data':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Manage/ConfigManageEdit')
      ),
      name:<FormattedMessage {...messages.plt_config_edit} />
    },

    //、实例管理
    '/platformOperation/demoManage':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Demo')
      ),
      name:<FormattedMessage {...messages.plt_demo_manage} />
    },
    '/platformOperation/demoManage/add':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Demo/DemoManageAdd')
      ),
      name:<FormattedMessage {...messages.plt_demo_add} />
    },
    '/platformOperation/demoManage/edit/:data':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/Demo/DemoManageEdit')
      ),
      name:<FormattedMessage {...messages.plt_demo_edit} />
    },


    //、服务实例
    '/platformOperation/serviceDemo':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/ServiceDemo')
      ),
      name:<FormattedMessage {...messages.plt_service_demo} />
    },
    '/platformOperation/serviceDemo/editLife/:data':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/ServiceDemo/ServiceLife')
      ),
      name:<FormattedMessage {...messages.plt_life_config_edit} />
    },
    '/platformOperation/serviceDemo/editRAM/:data':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/ServiceDemo/ServiceRAM')
      ),
      name:<FormattedMessage {...messages.plt_memory_config_edit} />
    },
    '/platformOperation/serviceDemo/editDisk/:data':{
      component: dynamicWrapper(app, ['platformOperation'], () => import('../routes/PlatformOperation/ServiceDemo/ServiceDisk')
      ),
      name:<FormattedMessage {...messages.plt_disk_config_edit} />
    },

    //、应用列表
    '/payManage/applicationList':{
      component: dynamicWrapper(app, ['payManage'], () => import('../routes/PayManage/Application')
      ),
      name:<FormattedMessage {...messages.pay_application_manage} />
    },
    '/payManage/applicationList/add':{
      component: dynamicWrapper(app, ['payManage'], () => import('../routes/PayManage/Application/AddApplication')
      ),
      name:<FormattedMessage {...messages.pay_application_add} />
    },
    '/payManage/applicationList/edit/:data':{
      component: dynamicWrapper(app, ['payManage'], () => import('../routes/PayManage/Application/EditApplication')
      ),
      name:<FormattedMessage {...messages.pay_application_edit} />
    },

    //订单
    '/payManage/orderManage':{
      component: dynamicWrapper(app, ['payManage'], () => import('../routes/PayManage/OrderManage')
      ),
      name:<FormattedMessage {...messages.pay_order_manage} />
    },

    //订单
    '/payManage/orderManage/item/:data':{
      component: dynamicWrapper(app, ['payManage'], () => import('../routes/PayManage/OrderManage/OrderListItem')
      ),
      name:<FormattedMessage {...messages.pay_order_item} />
    },


    //、适配管理
    '/equipment/adapterManage':{
      component: dynamicWrapper(app, ['equipment','equipmentAdapter'], () => import('../routes/Equipment/Adapter')
      ),
      name:<FormattedMessage {...messages.eq_adapter_manage} />
    },
    '/equipment/adapterManage/add':{
      component: dynamicWrapper(app, ['equipment','equipmentAdapter'], () => import('../routes/Equipment/Adapter/AdapterManageAdd')
      ),
      name:<FormattedMessage {...messages.eq_adapter_add} />
    },
    '/equipment/adapterManage/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentAdapter'], () => import('../routes/Equipment/Adapter/AdapterManageEdit')
      ),
      name:<FormattedMessage {...messages.eq_adapter_edit} />
    },

    //、设配类型
    '/equipment/equipmentType':{
      component: dynamicWrapper(app, ['equipment','equipmentType'], () => import('../routes/Equipment/EqType')
      ),
      name:<FormattedMessage {...messages.eq_config_manage} />
    },
    '/equipment/equipmentType/add':{
      component: dynamicWrapper(app, ['equipment','equipmentType'], () => import('../routes/Equipment/EqType/EquipmentTypeAdd')
      ),
      name:<FormattedMessage {...messages.eq_config_add} />
    },
    '/equipment/equipmentType/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentType'], () => import('../routes/Equipment/EqType/EquipmentTypeEdit')
      ),
      name:<FormattedMessage {...messages.eq_config_edit} />
    },
    '/equipment/equipmentType/item/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentType'], () => import('../routes/Equipment/EqType/EquipmentTypeItem')
      ),
      name:<FormattedMessage {...messages.eq_config_item} />
    },

    //、设配管理
    '/equipment/equipmentManage':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage')
      ),
      name:<FormattedMessage {...messages.eq_device_manage} />
    },
    '/equipment/equipmentManage/add':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManageAdd')
      ),
      name:<FormattedMessage {...messages.eq_device_add} />
    },
    '/equipment/equipmentManage/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManageEdit')
      ),
      name:<FormattedMessage {...messages.eq_device_edit} />

    },
    '/equipment/equipmentManage/item/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManageItem')
      ),
      name:<FormattedMessage {...messages.eq_device_item} />
    },
    '/equipment/equipmentManage/import':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManageImport')
      ),
      name:<FormattedMessage {...messages.eq_device_import} />
    },

    '/equipment/equipmentManage/preview/:id':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManagePerview')
      ),
      name:<FormattedMessage {...messages.eq_import_preview} />
    },
    '/equipment/equipmentManage/importItem/:id':{
      component: dynamicWrapper(app, ['equipment','equipmentManage'], () => import('../routes/Equipment/EqManage/EquipmentManageImportItem')
      ),
      name:<FormattedMessage {...messages.eq_import_record_item} />
    },

    //组件管理
    '/equipment/componentManage':{
      component: dynamicWrapper(app, ['equipment','equipmentComponent'], () => import('../routes/Equipment/Component')
      ),
      name:<FormattedMessage {...messages.eq_assembly_manage} />
    },
    '/equipment/componentManage/add':{
      component: dynamicWrapper(app, ['equipment','equipmentComponent'], () => import('../routes/Equipment/Component/ComponentManageAdd')
      ),
      name:<FormattedMessage {...messages.eq_assembly_add} />
    },
    '/equipment/componentManage/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentComponent'], () => import('../routes/Equipment/Component/ComponentManageEdit')
      ),
      name:<FormattedMessage {...messages.eq_assembly_edit} />
    },

    //、规则管理
    '/equipment/ruleManage':{
      component: dynamicWrapper(app, ['equipment','equipmentRule'], () => import('../routes/Equipment/Rule')
      ),
      name:<FormattedMessage {...messages.eq_rule_manage} />
    },
    '/equipment/ruleManage/add':{
      component: dynamicWrapper(app, ['equipment','equipmentRule'], () => import('../routes/Equipment/Rule/RuleManageAdd')
      ),
      name:<FormattedMessage {...messages.eq_rule_add} />
    },
    '/equipment/ruleManage/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentRule'], () => import('../routes/Equipment/Rule/RuleManageEdit')
      ),
      name:<FormattedMessage {...messages.eq_rule_edit} />
    },
    '/equipment/ruleManage/item/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentRule'], () => import('../routes/Equipment/Rule/RuleManageItem')
      ),
      name:<FormattedMessage {...messages.eq_rule_item} />
    },

    //、插件管理
    '/equipment/plugManage':{
      component: dynamicWrapper(app, ['equipment','equipmentPlugin'], () => import('../routes/Equipment/Plug')
      ),
      name:<FormattedMessage {...messages.eq_plug_manage} />
    },
    '/equipment/plugManage/add':{
      component: dynamicWrapper(app, ['equipment','equipmentPlugin'], () => import('../routes/Equipment/Plug/PlugManageAdd')
      ),
      name:<FormattedMessage {...messages.eq_plug_add} />
    },
    '/equipment/plugManage/edit/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentPlugin'], () => import('../routes/Equipment/Plug/PlugManageEdit')
      ),
      name:<FormattedMessage {...messages.eq_plug_edit} />
    },

    //、日志管理
    '/equipment/logManage':{
      component: dynamicWrapper(app, ['equipment'], () => import('../routes/Equipment/Log')
      ),
      name:<FormattedMessage {...messages.eq_log_manage} />
    },

    //、数据管理
    '/equipment/dataManage':{
      component: dynamicWrapper(app, ['equipment','equipmentData'], () => import('../routes/Equipment/Data')
      ),
      name:<FormattedMessage {...messages.eq_data_manage} />
    },

    '/equipment/dataManage/item/:data':{
      component: dynamicWrapper(app, ['equipment','equipmentData'], () => import('../routes/Equipment/Data/DataManageItem')
      ),
      name:<FormattedMessage {...messages.eq_data_item} />
    },

    '/equipment/typeManage':{
      component: dynamicWrapper(app, ['equipment','equipmentTypeManage'], () => import('../routes/Equipment/TypeManage')
      ),
      name:<FormattedMessage {...messages.eq_device_model} />
    },

    '/equipment/typeFirstManage':{
      component: dynamicWrapper(app, ['equipment','equipmentTypeManage'], () => import('../routes/Equipment/TypeManage/TypeFirstManage')
      ),
      name:<FormattedMessage {...messages.eq_type_manage} />
    },

    '/equipment/TypeFirstManage/firstAdd':{
      component: dynamicWrapper(app, ['equipment','equipmentTypeManage'], () => import('../routes/Equipment/TypeManage/FirstTypeAdd')
      ),
      name:<FormattedMessage {...messages.eq_type_add} />
    },

    '/equipment/typeManage/SecondAdd':{
      component: dynamicWrapper(app, ['equipment','equipmentTypeManage'], () => import('../routes/Equipment/TypeManage/SecondTypeAdd')
      ),
      name:<FormattedMessage {...messages.eq_model_add} />
    },

    '/equipment/TypeFirstManage/firstEdit/:data':{
      component: dynamicWrapper(app, ['equipment'], () => import('../routes/Equipment/TypeManage/FirstTypeEdit')
      ),
      name:<FormattedMessage {...messages.eq_type_edit} />
    },

    '/equipment/typeManage/SecondEdit/:data':{
      component: dynamicWrapper(app, ['equipment'], () => import('../routes/Equipment/TypeManage/SecondTypeEdit')
      ),
      name:<FormattedMessage {...messages.eq_model_edit} />
    },


    //数据统计
    '/menuDataSti/dataSti':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/DataSti')
      ),
      name:<FormattedMessage {...messages.sti_data_statistics} />
    },

    '/menuDataSti/childService':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ChildService')
      ),
      name:<FormattedMessage {...messages.sti_service_manage} />
    },
    '/menuDataSti/childService/add':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ChildService/ChildServiceAdd')
      ),
      name:<FormattedMessage {...messages.sti_service_add} />
    },
    '/menuDataSti/childService/edit/:data':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ChildService/ChildServiceEdit')
      ),
      name:<FormattedMessage {...messages.sti_service_edit} />
    },


    '/menuDataSti/dataTable':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/DataTable')
      ),
      name:<FormattedMessage {...messages.sti_data_table_manage} />
    },
    '/menuDataSti/dataTable/add':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/DataTable/DataTableAdd')
      ),
      name:<FormattedMessage {...messages.sti_data_table_add} />
    },
    '/menuDataSti/dataTable/edit/:data':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/DataTable/DataTableEdit')
      ),
      name:<FormattedMessage {...messages.sti_data_table_edit} />
    },
    '/menuDataSti/dataTable/item/:data':{
      component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/DataTable/DataTableItem')
      ),
      name:<FormattedMessage {...messages.sti_data_table_item} />
    },

    // '/menuDataSti/scriptManage':{
    //   component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ScriptManage')
    //   ),
    //   name:<FormattedMessage {...messages.sti_script_manage} />
    // },
    // '/menuDataSti/scriptManage/add':{
    //   component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ScriptManage/ScriptManageAdd')
    //   ),
    //   name:<FormattedMessage {...messages.sti_script_add} />
    // },
    // '/menuDataSti/scriptManage/edit/:data':{
    //   component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ScriptManage/ScriptManageEdit')
    //   ),
    //   name:<FormattedMessage {...messages.sti_script_edit} />
    // },
    // '/menuDataSti/scriptManage/item/:data':{
    //   component: dynamicWrapper(app, ['dataSti'], () => import('../routes/MenuDataSti/ScriptManage/ScriptManageItem')
    //   ),
    //   name:<FormattedMessage {...messages.sti_script_item} />
    // },



    '/firmwareUpdate/hardwareUpdate':{
      component: dynamicWrapper(app, ['hardwareUpdate'], () => import('../routes/FirmwareUpdate/HardwareUpdate')
      ),
      name:<FormattedMessage {...messages.upg_hard_update_manage} />
    },
    '/firmwareUpdate/hardwareUpdate/add':{
      component: dynamicWrapper(app, ['hardwareUpdate'], () => import('../routes/FirmwareUpdate/HardwareUpdate/HardwareUpdateAdd')
      ),
      name:<FormattedMessage {...messages.upg_duty_add} />
    },
    '/firmwareUpdate/hardwareUpdate/edit/:data':{
      component: dynamicWrapper(app, ['hardwareUpdate'], () => import('../routes/FirmwareUpdate/HardwareUpdate/HardwareUpdateEdit')
      ),
      name:<FormattedMessage {...messages.upg_duty_edit} />
    },

    '/firmwareUpdate/hardwareUpdate/item/:data':{
      component: dynamicWrapper(app, ['hardwareUpdate'], () => import('../routes/FirmwareUpdate/HardwareUpdate/HardwareUpdateItem')
      ),
      name:<FormattedMessage {...messages.upg_update_item} />
    },
    '/firmwareUpdate/hardwareUpdate/updateSuccess/:id':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdate/UpdateSuccess')
      ),
      name:<FormattedMessage {...messages.upg_success_item} />
    },

    '/firmwareUpdate/hardwareUpdate/updateFails/:id':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdate/UpdateFails')
      ),
      name:<FormattedMessage {...messages.upg_failed_item} />
    },



    '/firmwareUpdate/hardwareUpdate/dutyItemU':{
      component: dynamicWrapper(app, ['hardwareUpdate'], () => import('../routes/FirmwareUpdate/HardwareUpdate/HardwareUpdateListItemU')
      ),
      name:<FormattedMessage {...messages.upg_update_item} />
    },


    '/firmwareUpdate/hardwareUpdateBag':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_hard_package_manage} />
    },
    '/firmwareUpdate/hardwareUpdateBag/upload':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdateBag/UploadUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_upload_package} />
    },
    '/firmwareUpdate/hardwareUpdateBag/update/:date':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdateBag/UpdUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_package_edit} />
    },


    '/firmwareUpdate/hardwareUpdateBag/updateSuccess/:id':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdateBag/UpdateSuccess')
      ),
      name:<FormattedMessage {...messages.upg_success_item} />
    },

    '/firmwareUpdate/hardwareUpdateBag/updateFails/:id':{
      component: dynamicWrapper(app, ['hardwareUpdateBag'], () => import('../routes/FirmwareUpdate/HardwareUpdateBag/UpdateFails')
      ),
      name:<FormattedMessage {...messages.upg_failed_item} />
    },

    '/firmwareUpdate/appUpdateBag':{
      component: dynamicWrapper(app, ['appUpdateBag'], () => import('../routes/FirmwareUpdate/APPUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_app_package_manage} />
    },

    '/firmwareUpdate/appUpdateBag/upload':{
      component: dynamicWrapper(app, ['appUpdateBag'], () => import('../routes/FirmwareUpdate/APPUpdateBag/UploadUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_upload_package} />
    },

    '/firmwareUpdate/appUpdateBag/update/:date':{
      component: dynamicWrapper(app, ['appUpdateBag'], () => import('../routes/FirmwareUpdate/APPUpdateBag/UpdUpdateBag')
      ),
      name:<FormattedMessage {...messages.upg_package_edit} />
    },


    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
  };
  routerDataCache = routerConfig;
  return routerDataCache;
};
