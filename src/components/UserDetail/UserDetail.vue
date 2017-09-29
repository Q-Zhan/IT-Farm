<template>
  <div id="userDetail">
    <header>
      <img :src="back_arrow" @click="turnToBack"/>
      <span>个人信息</span>
    </header>
    <div class="section">
      <div class="avatar container">
        <input type="file" @change="encodeImg" accept=""/>
        <span>头像</span>
        <img :src="getAvatar()"/>
      </div>
      <div class="nname container">
        <span>昵称</span>
        <span>{{user.nname}}</span>
      </div>
      <div class="uname container">
        <span>账号名</span>
        <span>{{user.uname}}</span>
      </div>
      <div class="grade container" @click="openPicker('grade')">
        <span>入学年份</span>
        <span>{{user.grade}}</span>
      </div>
      <div class="faculty container" @click="openPicker('faculty')">
        <span>学院</span>
        <span>{{user.faculty}}</span>
      </div>
    </div>
    <div class="section">
      <div class="gender container" @click="openPicker('gender')">
        <span>性别</span>
        <span>{{gender}}</span>
      </div>
      <div class="site container" @click="openPicker('site')">
        <span>宿舍区</span>
        <span>{{user.site}}</span>
      </div>
      <div class="signature container" @click="turnToModifyUserInfo('signature')">
        <span>个性签名</span>
        <span>{{user.signature}}</span>
      </div>
    </div>
    <Loading v-show="isLoading"/>
    <Toast ref="toast"/>
    <picker v-model="isPickerShowed" :data-items="pickerItems" @change="changePickerValue">
      <div class="top-content" slot="top-content" >
        <span @click="closePicker">取消</span>
        <span @click="changeInfo">确定</span>
      </div>
    </picker>
  </div>

</template>

<script>
import { api } from '../../api'
import Loading from '../Common/Loading/Loading.vue'
import Toast from '../Common/Toast/Toast.vue'
import back_arrow from './back_arrow_white.svg'
import userAvatar from './user_avatar.svg'

export default {
  components: {
    Loading,
    Toast
  },
  data () {
    return {
      back_arrow,
      userAvatar,
      pickerData: {
        grade: [],
        faculty: ['海洋学院', '国际教育学院', '工程学院', '食品科学学院', '经济管理学院', '公共管理学院', '资源环境学院', '生命科学学院', '动物科学学院', '兽医学院', '园艺学院', '农学院', '林学与风景园林学院', '电子工程学院', '水利与土木工程学院', '人文与法学学院', '材料与能源学院', '数学与信息学院', '软件学院', '外国语学院', '艺术学院'],
        gender: ['男', '女'],
        site: ['五山区', '华山区', '启林北', '启林南', '其他宿舍区']
      },
      isPickerShowed: false,
      pickerItems: [],
      choseValue: ''
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
    this.initGradeData()
  },
  methods: {
    closePicker() {
      this.isPickerShowed = false
    },
    changeInfo() {
      this.isPickerShowed = false
      // console.log(this.choseValue)
      if (this.choseValue == '男') {
        this.choseValue = true
      }
      if (this.choseValue == '女') {
        this.choseValue = false
      }
      this.$store.dispatch('modifyUserInfo', {item: this.pickerItemName, value: this.choseValue})
    },
    changePickerValue(value) {
      if (value) {
        this.choseValue = value
      }
    },
    openPicker(item) {
      this.pickerItemName = item
      this.pickerItems = [{
        values: this.pickerData[item]
      }]
      this.choseValue = this.pickerData[item][0]
      this.isPickerShowed = true
    },
    turnToBack() {
      this.$router.go(-1)
    },
    turnToModifyUserInfo(item) {
      this.$router.push({ name: 'modifyUser', params: {item}})
    },
    initGradeData() {
      let self = this
      for (let i = 2005; i < 2030; i++) {
        self.pickerData.grade.push(i)
      }
    },
    encodeImg(e) {
      if (e.target.files[0]) {
        this.$store.commit('startLoading')
        let img_size = e.target.files[0].size / 1024
        let reader = new FileReader()
        let imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)/i
        let prefixReg = /^data:image\/(bmp|cis\-cod|gif|ief|jpeg|png|tiff);base64,/gi
        let self = this
        reader.onload = function() {
          let result = this.result
          // 压缩图片
          let cvs = document.createElement('canvas')
          let ctx = cvs.getContext('2d')
          let img = new Image()
          img.onload = () => {
            // 如果图片大小大于300k就压缩
            if (img_size >= 300) {
              let compress_proportion = 300 / img_size
              cvs.width = img.width
              cvs.height = img.height
              ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
              result = cvs.toDataURL('image/jpeg', compress_proportion)
            }
            // 去除base64前缀
            let new_result = result.replace(prefixReg, '')
            // 编码以便传给后端
            self.sendImg(encodeURIComponent(new_result))
          }
          img.src = result
        }
        // 检测是否为图片类型
        if (imgFilter.test(e.target.files[0].type)) {
          reader.readAsDataURL(e.target.files[0])
        } else {
          this.$store.commit('stopLoading')
          this.$refs.toast.showToast('请上传图片类型')
        }
      }
    },
    sendImg(base64) {
      fetch(api + '/api/image/user/create', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        },
        body: 'image=' + base64
      })
      .then((res) => res.json())
      .then((data) => {
        this.$store.commit('saveUserPic', { webPath: data.content.webPath.slice(9), imageid: data.content.imageid })
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    getAvatar() {
      if (this.user.userPic) {
        return api + this.user.userPic.webPath
      } else {
        return userAvatar
      }
    }
  }
}
</script>

<style lang="scss">

#userDetail {
  width: 100%;
  height: 100%;
  background: #EBEBEB;
  .top-content {
    height: 1.3rem;
    line-height: 1.3rem;
    background: white;
    font-size: 0.5rem;
    letter-spacing: 2px;
    display: flex;
    justify-content: space-between;
    span {
      padding: 0 0.3rem;
    }
    span:nth-of-type(2) {
      color: #007ACC;
    }
  }
  .picker-backdrop {
    overflow: hidden;
  }
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
      position: relative;
      input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
      img {
        width: 1.7rem;
        height: 1.7rem;
      }
    }
  }
}
</style>
