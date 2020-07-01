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
            <div>
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
          </div>
          <div v-else>
            基础信息暂无
          </div>
        </Card>

        <Card>
          <div slot="title">
            <DatePicker trigger="hover" :transfer="true"
                        type="daterange" :options="host_info_time_picker_option"
                        placement="bottom-end" placeholder="Select date"
                        style="width: 200px"
                        @on-change="onDatePickerChange"
            ></DatePicker>
            <div>
              <div :id="row.id" style="height:400px;"></div>
            </div>
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
  import {deleteHostBlameEmail, addHostBlameEmail, getHostInfoLog} from '../../api/host'

  let echarts = require('echarts');

  export default {
    name: "BaseInfo",
    props: {
      row: Object
    },
    data() {
      return {
        add_host_blame_email: "",
        show_host_blame_email: false,

        host_info_time_picker_option: {
          shortcuts: [
            {
              text: '1 week',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '1 month',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '3 months',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            }
          ]
        },

        chart: Object
      }
    },
    methods: {
      // 删除邮件点击事件
      handleDeleteBlameEmail(id) {
        deleteHostBlameEmail({id: id}).then(res => {
          if (res.status === 0) {
            this.$emit('getHostInfo')
          }
        })
      },
      // 增加邮件按钮点击事件
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
      // 获取监控日志信息
      handleGetHostInfoLog(start, end) {
        this.chart.showLoading();
        getHostInfoLog({
          host_id: this.row.id,
          start: start,
          end: end
        }).then(res => {
          if (res.status === 0) {
            this.chart.setOption({
              title: {
                text: `${start} 至 ${end}`
              },
              xAxis: {
                data: res.data.time
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                data: ['cpu', 'mem', 'disk']
              },
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  xAxisIndex: [0],
                  start: 1,
                  end: 35
                },
                {
                  type: 'slider',
                  show: true,
                  yAxisIndex: [0],
                  left: '93%',
                  start: 1,
                  end: 99
                },
                {
                  type: 'inside',
                  xAxisIndex: [0],
                  start: 1,
                  end: 35
                },
                {
                  type: 'inside',
                  yAxisIndex: [0],
                  start: 1,
                  end: 99
                }
              ],
              yAxis: {},
              series: [{
                name: 'cpu',
                type: 'line',
                data: res.data.cpu
              }, {
                name: 'mem',
                type: 'line',
                data: res.data.mem
              }, {
                name: 'disk',
                type: 'line',
                data: res.data.disk
              }]
            })
          }
          this.chart.hideLoading();
        })
      },
      // 当选择的日期发生改变
      onDatePickerChange(date) {
        this.handleGetHostInfoLog(date[0], date[1]);
      },
    },
    mounted() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.row.id), 'light');
      // 绘制空的图表
      this.chart.setOption({
        title: {
          text: '监控信息'
        },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: []
      });

      Date.prototype.Format = function (fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "H+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      };

      let today = new Date();
      let start = new Date(new Date().setDate(today.getDay() - 3)).Format("yyyy-MM-dd");
      let end = today.Format("yyyy-MM-dd");
      this.handleGetHostInfoLog(start, end);

    }
  }
</script>

<style scoped>

</style>
