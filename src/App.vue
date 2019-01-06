<template>
  <div id="app">
    <Table/>
  </div>
</template>

<script>
import Table from './components/Table.vue'

export default {
  name: 'app',
  components: {
    Table
  }
  // data: {
  //   showTable: false,
  //   showTree: false,
  //   tableData: [],
  //   input: '',
  //   description: '',
  //   type: '',
  //   dialogFormVisible: false,
  //   formData: [],
  //   formList: [],
  //   menuList: [],
  //   treeData: []
  // },
  // created() {
  //   axios.get('http://localhost:8080/data/menu').then(
  //     response => {
  //       if (response.code == 200) {
  //         alert('OK')
  //       } else {
  //         alert('fail')
  //       }
  //     }
  //   )
  // }
}
</script>
