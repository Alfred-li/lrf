const webpack = require('webpack')
const path = require('path')
const data=require('./data.json')
const menu=data.menu
const field=data.field
const form=data.form
const treeData=data.treeData
const indicator=data.indicator
const groupData=data.groupData
const appData=data.appData

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
      before(app) {
          app.get('/indicator/visual/tables.do', function(req, res) {
             res.json({
                 code: 0,
                 data: menu
                })   
          });
          app.get('/indicator/visual/fields.do', function(req, res) {
              res.json({
                code: 0,
                data: field
              });
          });
          app.get('/indicator/visual/mapping/query.do', function(req, res) {
              res.json({
                code: 0,
                data: form
              });
          }),
          app.get('/indicator/visual/content.do', function(req, res) {
            res.json({
                code: 0,
                data: treeData
              });
          }),
          app.get('/indicator/visual/mapping/indicator.do', function(req, res) {
                res.json({
                  code: 0,
                  data: indicator
                });
          }),
          app.get('/indicator/visual/mapping/group.do', function(req, res) {
                res.json({
                    code: 0,
                    data: groupData
                })
          }),
          app.get('/indicator/visual/mapping/app.do', function(req, res) {
                res.json({
                    code: 0,
                    data: appData
                })
          })
      }
    },
    chainWebpack(config) {
        config.resolve.alias
          .set('components', resolve('src/components'))
          .set('common', resolve('src/common'))
          .set('api', resolve('src/api'))
    
        config.plugin('context')
          .use(webpack.ContextReplacementPlugin,
            [/moment[/\\]locale$/, /zh-cn/])
      }
}