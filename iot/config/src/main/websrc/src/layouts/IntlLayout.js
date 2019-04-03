import React, { Fragment } from 'react';

import { connect } from 'dva';

import { injectIntl } from 'react-intl';
class IntlLayout extends React.PureComponent {

  componentDidMount(){
    this.props.dispatch({
      type:'global/fetch_getPlatMenu_action',
      payload:null
    })
  }

  componentDidUpdate(){
    window.intl = this.props.intl;

  }

  render() {
    return this.props.children;
  }
}

export default connect(({ global = {} }) => ({
  collapsed: global.collapsed,
  local:global.local
}))(injectIntl(IntlLayout));
