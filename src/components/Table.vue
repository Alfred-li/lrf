<template>
  <el-container style="border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu>
        <el-submenu
          v-for="(item, index1) in menuList"
          :key="index1"
          :index="`${index1}`">
          <template slot="title">{{ item.database }}</template>
          <el-menu-item
            v-for="(sub, index2) in item.tables"
            :key="index2"
            :index="`${index1}-${index2}`"
            @click="renderTable(sub)"
            >{{ sub.tableName }}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>      
      <el-main>
        <div style="display: flex; justify-content: flex-end;">
          <el-form :inline="true" :model="formInline" class="search-form-inline">
            <el-form-item>
              <el-input v-model="formInline.query" placeholder="输入查询条件"></el-input>
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
        <el-table v-show="showTable" :data="tableData">
          <el-table-column prop="field" label="字段"/>
          <el-table-column prop="cnName" label="中文名"/>
          <el-table-column prop="metamapNo" label="图谱编号"/>
          <el-table-column prop="metamapVersion" label="图谱版本"/>
          <el-table-column prop="type" label="字段属性"/>
          <el-table-column prop="metamapSql" label="图谱SQL"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column prop="queryCode" label="queryCode"/>
          <el-table-column label="产品">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="productClick(scope.$index, scope.row)">产品</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleClick(scope.$index, scope.row)">mock</el-button>
            </template>
          </el-table-column>
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
        <el-col :span="5">{{ item.id }}</el-col>
        <el-col :span="5">{{ item.groupName }}</el-col>
        <el-col :span="5">{{ item.indicatorName }}</el-col>
        <el-col :span="5">{{ item.indicatorCode }}</el-col>
        <el-col :span="4"><div @click="removeFormList(item, index)"><i class="el-icon-error"/></div></el-col>
      </el-row>
      <el-row>
        <el-form
          v-for="(item, index) in formData"
          :key="index"
          :model="item" :inline="true" size="mini">
          <el-col :span="20">
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.a" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.b" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.c" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%; margin: 0">
              <el-select v-model="item.d" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div @click="removeFormData(index)"><i class="el-icon-error"/></div>
          </el-col>
        </el-form>
      </el-row>
      <el-button @click="addForm">新 增</el-button>
    </el-dialog>
  </el-container>
</template>

<script>
/* eslint-disable */
import menuJson from '../json/menu.json'
import tableJson from '../json/table.json'
import formJson from '../json/form.json'
import axios from 'axios'
//import {get} from './helpers'

export default {
  data () {
    return {
      showTable: false,
      showTree: false,
      tableData: [],
      input: '',
      description: '',
      type: '',
      dialogFormVisible: false,
      formData: [],
      formList: [],
      menuList: [],
      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formInline: {
        query: ''
      }
    }
  },
  created () {
    axios.get('http://localhost:8080/data/menu').then(
      response => {
        console.info(response)
        if (response.data.data.code === 200) {
          alert('OK')
        } else {
          alert('fail')
        }
      }
    )
  },
  beforeMount () {
    this.menuList = menuJson.data
    this.tableData = tableJson.data
    this.formList = formJson
  },
  methods: {
    renderTable ({type, description}) {
      this.type = type
      this.description = description
      this.showTable = true
    },
    productClick (index, row) {
      this.dialogFormVisible = true
    },
    handleClick (index, row) {
      this.dialogFormVisible = true
    },
    addForm () {
      this.formData.push({})
    },
    removeFormList (item, index) {
      this.formList.splice(index, 1)
    },
    removeFormData (item, index) {
      this.formData.splice(index, 1)
    },
    handleNodeClick(data) {
      console.log(data)
      this.showTree = false
      this.showTable = true
    },
    onSubmit () {
      this.showTree = true
      this.showTable = false
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
</style>
