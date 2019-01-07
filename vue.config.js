const webpack = require('webpack')
const path = require('path')
const data=require('./data.json')
const menu=data.menu
const table=data.table
const form=data.form
const treeData=data.treeData
const indicator=data.indicator

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
      before(app) {
          app.get('/data/menu', function(req, res) {
             res.json({
                 code: 0,
                 data: menu
                })   
          });
          app.get('/data/table', function(req, res) {
              res.json({
                code: 0,
                data: table
              });
          });
          app.get('/data/form', function(req, res) {
              res.json({
                code: 0,
                data: form
              });
          }),
          app.get('/data/treeData', function(req, res) {
            res.json({
                code: 0,
                data: treeData
              });
          }),
          app.get('/data/indicator', function(req, res) {
              res.json({
                  code: 0,
                  data: indicator
              });
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