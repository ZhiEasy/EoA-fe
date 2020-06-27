<template>
  <div>

    <div>
      <Tabs value="my_watchs" class="tabs-style2" type="card">
        <TabPane label="我关注的" name="my_watchs">
          <HostInfo @getHostInfo="getHostInfo" :hosts="hosts.my_watchs"></HostInfo>
        </TabPane>
        <TabPane label="其他主机" name="not_watchs">
          <HostInfo @getHostInfo="getHostInfo" :hosts="hosts.not_watchs"></HostInfo>
        </TabPane>
        <TabPane label="添加主机" name="add_host">
          <AddHost></AddHost>
        </TabPane>
      </Tabs>
    </div>

  </div>
</template>

<script>
  import {getHostInfo, deleteHostWatch, addHostWatch, deleteHost} from '../../api/host'
  import AddHost from "@/components/Host/AddHost";
  import BaseInfo from "@/components/Host/BaseInfo";
  import HostInfo from "@/components/Host/HostInfo";

  export default {
    name: "Index",
    components: {HostInfo, AddHost},
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
                  }
                }
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
            title: '创建者',
            slot: 'user'
          },
          {
            title: '基础信息',
            slot: 'base_info'
          },
          {
            title: 'IP',
            key: 'ip'
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
            title: '操作',
            slot: 'action'
          }
        ],
        hosts: [],
      }
    },
    mounted() {
      this.getHostInfo()
    },
    methods: {
      onAddHost() {
        this.getHostInfo()
      },
      onDelHost() {
        this.getHostInfo()
      },
      // 获取主机信息
      getHostInfo() {
        getHostInfo().then(res => {
          if (res.status === 0) {
            this.hosts = res.data
          }
        })
      },
      // 取消关注主机
      deleteHostWatch(host_id) {
        deleteHostWatch({host_id: host_id}).then(res => {
          if (res.status === 0) {
            this.getHostInfo();
            this.$Message.success(res.msg);
          }
        })
      },
      // 关注主机
      addHostWatch(host_id) {
        addHostWatch({host_id: host_id}).then(res => {
          if (res.status === 0) {
            this.getHostInfo();
            this.$Message.success(res.msg);
          }
        })
      },
    },
  }
</script>

<style scoped>
  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-radius: 0;
    background: #fff;
  }

  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-top: 1px solid #3399ff;
  }

  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
