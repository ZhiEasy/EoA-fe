<template>
  <div>
    <Table border highlight-row :columns="host_columns" :data="hosts">
      <template slot-scope="{ row }" slot="create_time">
        <p>{{ new Date(row.create_time).toLocaleDateString() }}</p>
        <p>{{ new Date(row.create_time).toLocaleTimeString() }}</p>
      </template>
      <template slot-scope="{ row }" slot="description">
        <span>{{ row.description === "" ? "暂无描述" : row.description }}</span>
      </template>
      <template slot-scope="{ row }" slot="user">
        <Tooltip trigger="hover" :transfer="true">
          <Avatar :src="row.user.avatar_url"/>
          <div slot="content">
            <p>{{row.user.name}}</p>
            <p>{{row.user.email}}</p>
          </div>
        </Tooltip>
      </template>
      <template slot-scope="{ row }" slot="base_info">
        <div v-if="row.base_info === ''">
          暂无信息
        </div>
        <Tooltip v-else placement="bottom" :transfer="true">
          <div>
            {{ row.base_info.host_info.os }} {{ row.base_info.host_info.platform }}
            {{ row.base_info.host_info.platform_version }}
          </div>
          <div slot="content">
            点击行首箭头查看详情
          </div>
        </Tooltip>
      </template>
      <template slot-scope="{ row }" slot="watched_user">
        <div v-for="(u, i) in row.watched_user" :key="i">
          <Tooltip trigger="hover" :transfer="true">
            <Avatar :src="u.avatar_url"/>
            <div slot="content">
              <p>{{u.name}}</p>
              <p>{{u.email}}</p>
            </div>
          </Tooltip>
        </div>
      </template>
      <template slot-scope="{ row }" slot="task_info">
        <div v-if="row.task_info !== null">
          <Tooltip trigger="hover" :transfer="true">
            <div>
              <Badge status="processing"/>
              监控中
            </div>
            <div slot="content">
              <p>创建者：{{row.task_info.user.name}}</p>
              <p>{{row.task_info.user.email}}</p>
              <p>扫描间隔：{{row.task_info.spec}}</p>
              <p>开始时间：{{new Date(row.task_info.create_time).toLocaleDateString()}}</p>
              <p>{{new Date(row.task_info.create_time).toLocaleTimeString()}}</p>
            </div>
          </Tooltip>
        </div>
        <div v-else>
          <Badge status="default"/>
          未开启
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="!row.can_watch" type="warning" size="small" @click="handleDeleteHostWatch(row.id)">取关</Button>
        <Button v-if="row.can_watch" type="warning" size="small" @click="handleAddHostWatch(row.id)">关注</Button>
        <Button v-if="row.can_del" size="small" @click="handleDeleteHost(row)">删除主机</Button>
        <Button type="info" v-if="row.task_info === null" @click="handleShowAddTaskModal(row.id)" size="small">创建监控</Button>
        <Button type="info" size="small" v-if="row.task_info !== null">取消监控</Button>
      </template>
    </Table>
    <!--    创建主机监控表单   -->
    <Modal
      v-model="show_add_task_host"
      title="创建主机资源监控">
      <!--      @on-ok="ok"-->
      <!--      @on-cancel="cancel"-->
      <Form ref="new_host_form" :model="new_task_form" :rules="new_task_rule">
        <FormItem>
          <Input type="textarea" v-model="new_task_form.description" placeholder="简单描述一下"></Input>
        </FormItem>
        <FormItem>
          <Input type="text" v-model="new_task_form.spec" disabled placeholder="时间间隔"></Input>
          每隔1min扫描一次
        </FormItem>
        <FormItem>
          内存使用率下限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.mem_min"></InputNumber>
          内存使用率上限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.mem_max"></InputNumber>
          <p>
            内存使用率范围：[{{new_task_form.mem_min}},{{new_task_form.mem_max}}]
          </p>
        </FormItem>
        <FormItem>
          CPU使用率下限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.cpu_min"></InputNumber>
          CPU使用率上限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.cpu_max"></InputNumber>
          <p>
            CPU使用率范围：[{{new_task_form.cpu_min}},{{new_task_form.cpu_max}}]
          </p>
        </FormItem>
        <FormItem>
          硬盘使用率下限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.disk_min"></InputNumber>
          硬盘使用率上限：
          <InputNumber :max="101" :min="-1" :step="0.1" v-model="new_task_form.disk_max"></InputNumber>
          <p>
            硬盘使用率范围：[{{new_task_form.disk_min}},{{new_task_form.disk_max}}]
          </p>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="handleAddHostInfoTask">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getHostInfo, deleteHostWatch, addHostWatch, deleteHost} from '../../api/host'
  import {addHostInfoTask} from '../../api/task'
  import BaseInfo from "@/components/Host/BaseInfo";

  export default {
    name: "HostInfo",
    props: {
      hosts: Array
    },
    data() {
      return {
        host_columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(BaseInfo, {
                props: {
                  row: params.row
                },
                on: {
                  'onDelHost': () => {
                    this.onDelHost()
                  },
                  'getHostInfo': () => {
                    this.onGetHostInfo()
                  },
                },
              })
            }
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '描述',
            slot: 'description'
          },
          {
            title: 'IP',
            key: 'ip'
          },
          {
            title: '创建者',
            slot: 'user'
          },
          {
            title: '基础信息',
            slot: 'base_info'
          },
          {
            title: '创建时间',
            slot: 'create_time'
          },
          {
            title: '关注列表',
            slot: 'watched_user'
          },
          {
            title: '监控',
            slot: 'task_info'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],

        show_add_task_host: false,
        new_task_form: {
          description: "",
          spec: "0 */1 * * * *",
          mem_line: [],
          mem_min: -1,
          mem_max: 80,
          cpu_line: [],
          cpu_min: -1,
          cpu_max: 80,
          disk_line: [],
          disk_min: -1,
          disk_max: 80
        },
        new_task_rule: {},

        host_id: null,
      }
    },
    methods: {
      onAddHost() {
        this.$emit('getHostInfo')
      },
      onDelHost() {
        this.$emit('getHostInfo')
      },
      onGetHostInfo() {
        this.$emit('getHostInfo')
      },
      // 取消关注主机
      handleDeleteHostWatch(host_id) {
        deleteHostWatch({host_id: host_id}).then(res => {
          if (res.status === 0) {
            this.$emit('getHostInfo');
            this.$Message.success(res.msg);
          }
        })
      },
      // 关注主机
      handleAddHostWatch(host_id) {
        addHostWatch({host_id: host_id}).then(res => {
          if (res.status === 0) {
            this.$emit('getHostInfo');
            this.$Message.success(res.msg);
          }
        })
      },
      // 删除主机
      handleDeleteHost(host_info) {
        this.$Modal.confirm({
          title: '谨慎操作',
          content: `
                <p style="color: red">此操作将会删除主机及其监控信息，谨慎操作！</p>
                <p>IP：${host_info.ip}</p>
                <p>名称：${host_info.name}</p>
                <p>描述：${host_info.description === "" ? "暂无描述" : host_info.description}</p>
          `,
          okText: "取消",
          cancelText: "确定",
          onCancel: () => {
            deleteHost({host_id: host_info.id}).then(res => {
              if (res.status === 0) {
                this.$emit('onDelHost')
              }
            })
          }
        });
      },
      handleAddHostInfoTask() {
        this.new_task_form.mem_line = [];
        this.new_task_form.mem_line.push(this.new_task_form.mem_min);
        this.new_task_form.mem_line.push(this.new_task_form.mem_max);
        this.new_task_form.cpu_line = [];
        this.new_task_form.cpu_line.push(this.new_task_form.cpu_min);
        this.new_task_form.cpu_line.push(this.new_task_form.cpu_max);
        this.new_task_form.disk_line = [];
        this.new_task_form.disk_line.push(this.new_task_form.disk_min);
        this.new_task_form.disk_line.push(this.new_task_form.disk_max);

        addHostInfoTask({
          host_id: this.host_id,
          description: this.new_task_form.description,
          spec: this.new_task_form.spec,
          mem_line: this.new_task_form.mem_line,
          cpu_line: this.new_task_form.cpu_line,
          disk_line: this.new_task_form.disk_line,
        }).then(res=>{
          if (res.status === 0) {
            this.show_add_task_host = false;
            this.$emit('getHostInfo');
            this.host_id = null;
          }
        })
      },
      handleShowAddTaskModal(id) {
        this.host_id = id;
        alert(id)
        this.show_add_task_host = true
      },
    }
  }
</script>

<style scoped>

</style>
