<template>
  <div>
    <div v-if="row.base_info !== ''">
      <span class="expand-key">CPU: </span>
      <span class="expand-value">
          {{ JSON.parse(row.base_info).cpu_cores }} * {{ JSON.parse(row.base_info).cpu_model_name }}
          {{ JSON.parse(row.base_info).cpu_mhz }} MHZ
        </span>
      <br>
      <span class="expand-key">开机: </span>
      <span class="expand-value">
          {{ new Date(JSON.parse(row.base_info).host_boot_time * 1000).toLocaleDateString() }} -
          {{ new Date(JSON.parse(row.base_info).host_boot_time * 1000).toLocaleTimeString() }}
        </span>
      <br>
      <span class="expand-key">OS: </span>
      <span class="expand-value">{{ JSON.parse(row.base_info).host_os }}</span>
      <span class="expand-value">{{ JSON.parse(row.base_info).host_platform }}</span>
      <span class="expand-value">{{ JSON.parse(row.base_info).host_platform_version }}</span>
      <br>
      <span class="expand-key">MEM: </span>
      <span class="expand-value">{{ JSON.parse(row.base_info).mem_total/1024/1024/3 }}GB</span>
      <br>
      <span class="expand-key">DISK: </span>
      <span class="expand-value">{{ JSON.parse(row.base_info).disk_total/1024/1024/3}}GB</span>
    </div>
    <div v-else>基础信息暂无</div>

    <Button type="info" size="small">创建监控</Button>
    <Button v-if="row.can_del" type="error" size="small" @click="deleteHost(row)">删除</Button>
  </div>
</template>

<script>
  export default {
    name: "BaseInfo",
    props: {
      row: Object
    },
    methods: {
      // 删除主机
      deleteHost(host_info) {
        this.$Modal.confirm({
          title: '谨慎操作',
          content: `
                <p style="color: red">此操作将会删除主机及其监控信息，谨慎操作！</p>
                <p>IP：${host_info.ip}</p>
                <p>名称：${host_info.name}</p>
                <p>描述：${host_info.description===""?"暂无描述":host_info.description}</p>
          `,
          okText: "取消",
          cancelText: "确定",
          onCancel: () => {
            deleteHost({host_id: host_info.id}).then(res=>{
              if (res.status === 0) {
                this.getHostInfo()
              }
            })
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
