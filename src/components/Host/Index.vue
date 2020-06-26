<template>
  <div>
    <Row :gutter="16">
      <Col span="6">
        <AddHost @onAddHost="onAddHost"></AddHost>
      </Col>
      <Col span="18">
        <div>
          <Tabs value="my_watchs" class="tabs-style2" type="card">
            <TabPane label="我关注的" name="my_watchs">
              <Table :columns="host_columns" :data="hosts.my_watchs">
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
                      {{JSON.parse(row.base_info).host_os }} {{JSON.parse(row.base_info).host_platform}}
                      {{ JSON.parse(row.base_info).host_platform_version }}
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
                <template slot-scope="{ row, index }" slot="action">
                  <Button type="warning" size="small" @click="deleteHostWatch(row.id)">取关</Button>
                </template>
              </Table>
            </TabPane>
            <TabPane label="其他" name="not_watchs">
              <Table :columns="host_columns" :data="hosts.not_watchs">
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
                      {{JSON.parse(row.base_info).host_os + ' ' +  JSON.parse(row.base_info).host_platform}}<br/>
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
                <template slot-scope="{ row, index }" slot="action">
                  <Button type="warning" size="small" @click="addHostWatch(row.id)">关注</Button>
                </template>
              </Table>
            </TabPane>
          </Tabs>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getHostInfo, deleteHostWatch, addHostWatch, deleteHost} from '../../api/host'
  import AddHost from "@/components/Host/AddHost";
  import BaseInfo from "@/components/Host/BaseInfo";

  export default {
    name: "Index",
    components: {AddHost},
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
        addHostWatch({host_id: host_id}).then(res=>{
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
  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
  }
  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
  }
  .tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
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
