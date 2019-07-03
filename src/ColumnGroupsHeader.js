// @flow

import * as React from 'react'
import { List, Map } from 'immutable'
import ColumnGroup from "./ColumnGroup"
import Column from "./Column"
import RowSkeleton from './RowSkeleton'
import type { ComputedColumnGroup } from './ComputedColumnGroup'
import { getComputedColumnGroups } from './Utils'
import Constants from './Constants'
import { css } from 'emotion'

type ColumnGroupsHeaderProps = {
  leftLockedColumns: List<Column>,
  freeColumns: List<Column>,
  rightLockedColumns: List<Column>,
  columnGroups: List<ColumnGroup>,
  scrollLeft: number,
  onScroll: Function,
  columnsWidth : Map<string, number>,
  style: Object,
  className: string
}

const columnGroupHeaderStyle = css`
  flex-shrink: 0;
  padding: 8px;
  border-right: solid 1px #ccc;
`

export default class ColumnGroupsHeader extends React.PureComponent<ColumnGroupsHeaderProps> {

  constructor(props : ColumnGroupsHeaderProps) {
    super(props)
  }

  render = () => this.renderColumnGroupsHeader(this.props.style)

  renderColumnGroupsHeader = (style: Object) => this.props.columnGroups.size > 0 && <RowSkeleton
    className={this.props.className}
    key={1}
    style={{ ...style, ...this.props.style }}
    leftLocked={this.renderColumnGroupsHeaderForColumns(this.props.leftLockedColumns)}
    free={this.renderColumnGroupsHeaderForColumns(this.props.freeColumns)}
    rightLocked={this.renderColumnGroupsHeaderForColumns(this.props.rightLockedColumns)}
    scrollLeft={this.props.scrollLeft}
    onScroll={this.props.onScroll}
    rightWidth={Constants.columnsOptionsWidth}
  />
  
  renderColumnGroupHeader = (c: ComputedColumnGroup, index: number) => <div className={[columnGroupHeaderStyle, 'functional-data-grid__cell'].join(' ')} style={{ width: `${this.getColumnsWidth(c.columns)}px` }} key={index}>
    { c.columnGroup != null && this.getColumnGroupById(c.columnGroup).headerRenderer() }
  </div>
  
  renderColumnGroupsHeaderForColumns = (columns: List<Column>) => getComputedColumnGroups(columns)
    .map((g, index) => this.renderColumnGroupHeader(g, index))

  getColumnGroupById = (id: string) => this.props.columnGroups.find(g => g.id === id)

  getColumnsWidth = (columns: List<Column>) => columns.reduce((accumulator: number, c: Column) => accumulator + this.getColumnWidth(c), 0)

  getColumnWidth = (c : Column) => this.props.columnsWidth.get(c.id) != null ? this.props.columnsWidth.get(c.id) : c.width
}
