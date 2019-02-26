<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="openList">
        <el-submenu
          v-for="(item, index1) in menuList"
          :key="index1"
          :index="`${index1}`">
          <template slot="title">{{ item.database }}</template>
          <el-menu-item
            v-for="(sub, index2) in item.tables"
            :key="index2"
            :class="sub.isActive"
            :index="`${index1}-${index2}`"
            @click="renderTable(item, sub)"
            >{{ sub.tableName }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>      
      <el-main>
        <div style="display: flex; justify-content: flex-end;">
          <el-form :inline="true" class="search-form-inline">
            <el-form-item>
              <el-input v-model="content" placeholder="输入查询条件"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-row v-show="showTable">
          <el-col>
            <div class="table-title">{{ type }} {{ description }}</div>
          </el-col>
        </el-row>
        <el-table v-show="showTable" :data="tableData" :row-class-name="tableRowClassName">
          <el-table-column prop="field" label="字段"/>
          <el-table-column prop="cnName" label="中文名"/>
          <el-table-column prop="metamapNo" label="图谱编号"/>
          <el-table-column v-if="false" prop="metamapVersion" label="图谱版本" />
          <el-table-column prop="type" label="字段属性"/>
          <el-table-column v-if="false" prop="metamapSql" label="图谱SQL"/>
          <el-table-column v-if="false" prop="remark" label="备注"/>
          <el-table-column v-if="false" prop="queryCode" label="queryCode"/>
          <el-table-column label="产品">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="productClick(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                disabled="disabled"
                size="mini"
                @click="handleClick(scope.$index, scope.row)">mock</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="fieldCode" v-if="false" />
        </el-table>
        <el-tree
          v-show="showTree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"></el-tree>
      </el-main>
    </el-container>

    <el-dialog title="选择对应产品" :visible.sync="dialogFormVisible" width="80%">
      <el-row v-for="(item, index) in formList" :key="index">
        <el-col :span="5">{{ item.appName }}</el-col>
        <el-col :span="5">{{ item.groupName }}</el-col>
        <el-col :span="5">{{ item.indicatorName }}</el-col>
        <el-col :span="5">{{ item.type }}</el-col>
        <el-col :span="5" v-if="false">{{ item.id }}</el-col>
        <el-col :span="4"><div @click="removeFormList(item, index)"><i class="el-icon-error"/></div></el-col>
      </el-row>
      <el-row>
        <el-form
          v-for="(item, index) in formData"
          :key="index"
          :model="item" :inline="true" size="mini">
          <el-col :span="20">
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.app" 
                placeholder="请选择应用"
                @change="selectGroup(item)">
                <el-option 
                  v-for="app in appList"
                  :label="app.name"
                  :key="app.code"
                  :value="app.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.groupCode" placeholder="请选择组" @change="selectIndicator(item)">
                <el-option 
                  v-for="group in groupList"
                  :label="group.name"
                  :key="group.code"
                  :value="group.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.indicatorCode" placeholder="请选择指标">
                <el-option 
                  v-for="indicator in indicatorList"
                  :label="indicator.name"
                  :key="indicator.code"
                  :value="indicator.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.type" placeholder="请选择类型">
                <el-option label="分子" value="1"></el-option>
                <el-option label="分母" value="2"></el-option>
                <el-option label="全部" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <div @click="removeFormData(index)"><i class="el-icon-error"/></div>
          </el-col>
          <el-col :span="2">
            <div @click="submitFormData(index, item)"><i class="el-icon-success"/></div>
          </el-col>
        </el-form>
      </el-row>
      <el-button @click="addForm()">新 增</el-button>
    </el-dialog>
  </el-container>
</template>

<script>
/* eslint-disable */
import menuJson from '../json/menu.json'
import tableJson from '../json/table.json'
import formJson from '../json/form.json'
import axios from 'axios'
import { getMenu, getField, getForm, getTreeData, getIndicator, getGroups, getApp } from 'api'
import {baseUrl} from 'api/helpers.js'
var qs = require('qs');

export default {
  data () {
    return {
      showTable: false,
      index: 0,
      openList: [],
      showTree: false,
      dialogFormVisible: false,
      content: '', // 右上角搜索框的值
      tableData: [], // 表格数据，异步取
      queryCode: '',
      fieldCode: '',
      database: '', // 左边menu点击收集的数据
      description: '', // 左边menu点击收集的数据
      type: '', // 左边menu点击收集的数据
      formData: [], // 接口取浮层写死的数据
      formList: [], // 新增的数据
      menuList: [], // 接口取的，左边目录的数据
      treeData: [],
      groupList: [],
      appList: [],
      indicatorList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeLevel: {} // 点击树的第三层，收集的三个label
    }
  },
  created () {
    this._getMenu()
  },
  beforeMount () {
  },
  methods: {
    _getMenu() {
      getMenu({}).then((data) => {
        this.menuList = data
      })
    },
    renderTable ({database}, sub) {
      this.description = sub.description
      this.type = sub.type
      getField({database: database, table: sub.tableName}).then((data) => {
        this.tableData = data
      })
      this.showTable = true
      return
    },
    productClick (index, row) { // 点击产品按钮，出浮层
      this.formList = []
      this.formData = []
      this.fieldCode = row.fieldCode
      getForm({fieldCode: this.fieldCode}).then((data) => {
        this.formList = data
        this.selectApp()
      })
      
      this.dialogFormVisible = true
    },
    handleClick (index, row) { // 点击mock按钮，出浮层
    },
    addForm () { // 增加一行浮层表单
      this.formData.push({})
    },
    removeFormList (item, index) { // 删除写死的浮层一行
      let url = baseUrl + "indicator/visual/mapping/" + item.id + "/del.do"
      axios.delete(url, {"data": {"fieldCode": this.fieldCode }})
           .then((res) => {
             this.initForms()
           })
           .catch((err) => {
             this.initForms()
           });
    },
    initForms() {
      this.formList = []
      this.productClick({}, {"fieldCode": this.fieldCode})
    },
    removeFormData (index) { // 删除新增的浮层一行
      this.formData = []
      this.formData.splice(index, 1)
    },
    submitFormData (index, item) { // 提交新增的一行
      let url = baseUrl + 'indicator/visual/mapping.do'
      if (this.fieldCode === undefined || item.indicatorCode === undefined || item.groupCode === undefined || item.type === undefined) {
        alert(" 请选择必要参数 ")
        return
      }
      this.formData = []
      axios.post(url, qs.stringify({"fieldCode": this.fieldCode, "indicatorCode": item.indicatorCode, "groupCode": item.groupCode, "type": item.type}),{
          headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
          },
      })
      .then((data) => {
        this.productClick({}, {fieldCode: this.fieldCode})
      })
      .catch((err) => {
        this.productClick({}, {fieldCode: this.fieldCode})
      })
      
    },
    selectApp() {
      getApp().then((data) => {
        this.appList = data;
      })
    },
    // 根据应用 选组
    selectGroup(item) {
      if (item.app === undefined) {
        return
      } else {
        getGroups({"app": item.app}).then((data) => {
          this.groupList = data;
        })
      }
    },
    selectIndicator(item) {
      if (item.app === undefined || item.groupCode === undefined) {
        this.indicatorList = [];
      } else {
        getIndicator({appCode: item.app, groupCode: item.groupCode}).then((data) => {
          this.indicatorList = data;
        });
      }
    },
    handleNodeClick(item, node, self) { // 点击树第三层处理函数
      if (node.childNodes.length) return
      this.treeLevel.third = node.label
      this.treeLevel.second = node.parent.label
      this.treeLevel.first = node.parent.parent.label

      for (var i=0;i<this.menuList.length;i++) {
        if (this.menuList[i] != undefined && this.menuList[i].database == this.treeLevel.first) {
          this.openList.push(i.toString())
          var mts = this.menuList[i].tables;
          for (var h=0;h<mts.length;h++) {
              if (this.treeLevel.second === mts[h].tableName) {
                mts[h].isActive = 'is-active'
                this.renderTable({"database": this.treeLevel.first}, mts[h])
              }
          }
          
        }
      } 

      

      this.showTree = false
      this.showTable = true
    },
    onSubmit () { // 右上角搜索按钮的处理函数
      getTreeData({content: this.content}).then((data) => {
        this.treeData = data
      })
      this.openList = []
      this.showTree = true
      this.showTable = false
    },
    tableRowClassName ({row, rowIndex}) { // 控制某一行要不要高亮，根据行内容和第几行
      return 'success-row'
    }
  }
}
</script>

<style>
  .table-title {
    background-color: #409EFF;
    color: #333;
    line-height: 60px;
    text-align:center
  }

  .input {
    margin: 0;
    width: 20%
  }

  .el-aside {
    color: #333;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
