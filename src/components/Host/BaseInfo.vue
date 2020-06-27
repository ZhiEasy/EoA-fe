<template>
  <div>
    <Row :gutter="16">
      <Col :xs="24" :sm="24" :md="24" :lg="6">
        <Card title="负责人邮件列表" :padding="0">
          <CellGroup>
            <Cell v-for="(item, index) in row.blame_email" :key="index" :title="item.email">
              <Button type="text" slot="extra" style="color: red" @click="handleDeleteBlameEmail(item.id)">删除</Button>
            </Cell>
          </CellGroup>
          <div style="text-align: center; padding-top: 20px; padding-bottom: 20px">
            <Button type="info" @click="show_host_blame_email = true">添加负责人</Button>
          </div>
        </Card>
      </Col>
      <Col :xs="24" :sm="24" :md="24" :lg="18">
        <Card title="基础信息">
          <div v-if="row.base_info !== ''">
            <Tag>CPU：
              <span>
          {{ row.base_info.cpu_info.cores }} * {{ row.base_info.cpu_info.model_name }}
          {{ row.base_info.cpu_info.mhz }} MHZ
        </span>
            </Tag>
            <br>
            <Tag>
              开机时间：
              <span>
          {{ new Date(row.base_info.host_info.boot_time * 1000).toLocaleDateString() }} -
          {{ new Date(row.base_info.host_info.boot_time * 1000).toLocaleTimeString() }}
        </span>
            </Tag>
            <Tag>
              OS：
              <span>{{ row.base_info.host_info.os }}</span>
              <span>{{ row.base_info.host_info.platform }}</span>
              <span>{{ row.base_info.host_info.platform_version }}</span>
            </Tag>
            <Tag>
              内存：
              <span class="expand-value">{{ row.base_info.mem_info.total }}GB</span>
            </Tag>
            <Tag>
              磁盘：
              <span class="expand-value">{{ row.base_info.disk_info.total }}GB</span>
            </Tag>
          </div>
          <div v-else>
            基础信息暂无
          </div>
        </Card>
      </Col>
    </Row>

    <Modal
      v-model="show_host_blame_email"
      title="添加负责人邮件">
      <Input type="textarea" v-model="add_host_blame_email" placeholder="邮箱"></Input>
      <div slot="footer" style="text-align: center">
        <Button type="primary" @click="handleAddBlameEmail">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {deleteHostBlameEmail, addHostBlameEmail} from '../../api/host'

  export default {
    name: "BaseInfo",
    props: {
      row: Object
    },
    data() {
      return {
        add_host_blame_email: "",
        show_host_blame_email: false
      }
    },
    methods: {
      handleDeleteBlameEmail(id) {
        deleteHostBlameEmail({id: id}).then(res => {
          if (res.status === 0) {
            this.$emit('getHostInfo')
          }
        })
      },
      handleAddBlameEmail() {
        if (this.add_host_blame_email === '') {
          return
        }
        let email_list = this.add_host_blame_email.split(';');
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        for (let i = 0; i < email_list; i++) {
          if (!reg.test(email_list[i])) {
            this.$Modal.error({
              title: '邮箱格式有误',
              content: `邮箱 '${email_list[i]}' 的格式有误！`
            });
            return;
          }
        }
        addHostBlameEmail({
          host_id: this.row.id,
          email: email_list
        }).then(res => {
          if (res.status === 0) {
            this.$emit('getHostInfo')
          }
        })
      },
    },
  }
</script>

<style scoped>

</style>
