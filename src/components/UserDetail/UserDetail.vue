<template>
  <div id="userDetail">
    <header>
      <img :src="back_arrow" @click="turnToBack"/>
      <span>个人信息</span>
    </header>
    <div class="section">
      <div class="avatar container">
        <span>头像</span>
        <img :src="avatar"/>
      </div>
      <div class="nname container">
        <span>昵称</span>
        <span>{{user.nname}}</span>
      </div>
      <div class="uname container">
        <span>账号名</span>
        <span>{{user.uname}}</span>
      </div>
      <div class="grade container" @click="addPicker('grade')">
        <span>入学年份</span>
        <span>{{user.grade}}</span>
      </div>
      <div class="faculty container" @click="addPicker('faculty')">
        <span>学院</span>
        <span>{{user.faculty}}</span>
      </div>
    </div>
    <div class="section">
      <div class="gender container" @click="addPicker('gender')">
        <span>性别</span>
        <span>{{gender}}</span>
      </div>
      <div class="site container" @click="addPicker('site')">
        <span>宿舍区</span>
        <span>{{user.site}}</span>
      </div>
      <div class="signature container" @click="turnToModifyUserInfo('signature')">
        <span>个性签名</span>
        <span>{{user.signature}}</span>
      </div>
    </div>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import Loading from '../Common/Loading/Loading.vue'
import Picker from 'better-picker'
import back_arrow from './back_arrow_white.svg'
import avatar from './test_avatar.jpg'

export default {
  components: {
    Loading
  },
  data () {
    return {
      back_arrow,
      avatar,
      picker: '',
      pickerData: {
        grade: [],
        faculty: [
          {text: '海洋学院'},
          {text: '国际教育学院'},
          {text: '工程学院'},
          {text: '食品科学学院'},
          {text: '经济管理学院'},
          {text: '公共管理学院'},
          {text: '资源环境学院'},
          {text: '生命科学学院'},
          {text: '动物科学学院'},
          {text: '兽医学院'},
          {text: '园艺学院'},
          {text: '农学院'},
          {text: '林学与风景园林学院'},
          {text: '电子工程学院'},
          {text: '水利与土木工程学院'},
          {text: '人文与法学学院'},
          {text: '材料与能源学院'},
          {text: '数学与信息学院'},
          {text: '软件学院'},
          {text: '外国语学院'},
          {text: '艺术学院'}
        ],
        gender: [
          {text: '男'},
          {text: '女'}
        ],
        site: [
          {text: '五山区'},
          {text: '华山区'},
          {text: '启林北'},
          {text: '启林南'},
          {text: '其他宿舍区'}
        ]
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    gender() {
      if (this.$store.state.user.gender === true) {
        return '男'
      } else if (this.$store.state.user.gender === false) {
        return '女'
      }
    },
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    turnToBack() {
      this.$router.go(-1)
    },
    turnToModifyUserInfo(item) {
      this.$router.push({ name: 'modifyUser', params: {item}})
    },
    initData() {
      let self = this
      for (let i = 2005; i < 2030; i++) {
        self.pickerData.grade.push({
          text: i
        })
      }
    },
    addPicker(item) {
      let data = this.pickerData[item]
      let picker = new Picker({
        data: [data],
        selectedIndex: [0]
      })
      picker.on('picker.select', (selectedVal, selectedIndex) => {
        let value = data[selectedIndex[0]].text
        if (value == '男') {
          value = true
        }
        if (value == '女') {
          value = false
        }
        this.$store.dispatch('modifyUserInfo', {item, value})
      })
      picker.show()
    }
  }
}
</script>

<style lang="scss">

body .picker .picker-panel {
  height: 6rem;
  .picker-choose {
    height: 1rem;
    font-size: 0.5rem;
    .confirm, .cancel {
      padding: 0;
      top: 0.1rem;
    }
    .confirm {
      right: 0.2rem;
    }
    .cancel {
      left: 0.2rem;
    }
  }
  .picker-content {
    height: 3rem;
    .mask-top, .mask-bottom {
      height: 1rem !important;
    }
    .wheel-wrapper {
      height: 3rem;
      .wheel {
        height: 3rem;
        ul {
          padding: 0;
          list-style: none;
          li[class='wheel-item'] {
            height: 1rem;
            font-size: 0.5rem;
            line-height: 1rem;
          }
        }
      }
    }
  }
}
#userDetail {
  width: 100%;
  height: 100%;
  background: #EBEBEB;
  header {
    width: 100%;
    height: 1.4rem;
    border-bottom: 1px solid #D6D6D6;
    background: #3A393E;
    color: white;
    display: flex;
    align-items: center;
    img {
      width: 0.54rem;
      height: 0.5rem;
      margin-left: 0.45rem;
    }
    span {
      display: inline-block;
      margin-left: 0.4rem;
      font-size: 0.5rem;
    }
  }
  .section {
    width: 100%;
    background: white;
    margin-top: 0.5rem;
    .container {
      width: 90%;
      height: 1.3rem;
      margin: 0 auto;
      background: white;
      border-bottom: 1px solid #E8E8E8;
      font-size: 0.4rem;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:nth-of-type(2) {
        color: #919191;
      }
    }
    .avatar {
      height: 2.2rem;
      img {
        width: 1.7rem;
        height: 1.7rem;
      }
    }
  }
}
</style>
