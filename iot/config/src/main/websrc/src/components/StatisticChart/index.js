import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import * as routerRedux from "react-router-redux";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

export default class StatisticsChart extends Component {
  constructor() {
    super();
  };
  render() {
    let padding = [40, 40, 40, 40];
    const {height,data} = this.props;

    const cols = {
      date: {
        alias: "Day"
      },
      acc: {
        alias: "Total"
      },
    };
    return (
      <div style={{position:"relative",top:'0px',right:'0px'}}>
        <Chart padding={padding} height={height} data={data} scale={cols} forceFit >
          <Axis
            name="day"
            title={null}
            tickLine={null}
          />
          <Axis
            name="acc"
            line={false}
            tickLine={null}
            grid={null}
            title={null}
          />
          <Tooltip/>
          <Geom
            type="line"
            position="date*acc"
            size={1}
            shape="smooth"
          />
        </Chart>
      </div>
    );
  }
}
