import { get } from './helpers'

const getMenu = get('indicator/visual/tables.do')
const getField = get('indicator/visual/fields.do')
const getForm = get('indicator/visual/mapping/query.do')
const getTreeData = get('indicator/visual/content.do')
const getIndicator = get('indicator/visual/mapping/indicator.do')
const getGroups = get('indicator/visual/mapping/group.do')
const getApp = get('indicator/visual/mapping/app.do')

export {
  getMenu,
  getField,
  getForm,
  getTreeData,
  getIndicator,
  getGroups,
  getApp
}