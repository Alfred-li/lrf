const data=require('./data.json')
const menu=data.menu
const table=data.table
const form=data.form

module.exports = {
    devServer: {
      before(app) {
          app.get('/data/menu', function(req, res) {
             res.json({
                 error: 0,
                 data: menu
                })   
          });
          app.get('/data/table', function(req, res) {
              res.json({
                error: 0,
                data: table
              });
          });
          app.get('/data/form', function(req, res) {
              res.json({
                  error: 0,
                  data: form
              });
          })
      }
    }
  }