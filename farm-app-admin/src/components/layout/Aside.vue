<template>
  <div class="aside">
    <div class="aside-header" style="padding-top: 30px">
      <img style="width: 40px; height: 40px;float: left" src="../../assets/img/logo.png" alt=""/>
      <div style="padding-left: 15px;padding-top: 8px;float: left">助农app后台管理</div>
    </div>
    <div>
      <el-col style="padding-top: 30px">
        <el-menu
            class="menu"
            background-color="#242930"
            text-color="#FFFFFF"
            active-text-color="#409EFF">
          <router-link to="/index">
            <el-menu-item index="4">
              <i class="el-icon-document"></i>
              <span slot="title">系统首页</span>
            </el-menu-item>
          </router-link>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-film"></i>
              <span>信息管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/information/notice">
                <el-menu-item style="padding-left: 70px" index="2-1">公告信息</el-menu-item>
              </router-link>
              <router-link to="/information/news">
                <el-menu-item style="padding-left: 70px" index="2-2">助农资讯</el-menu-item>
              </router-link>
              <router-link to="/information/category">
                <el-menu-item style="padding-left: 70px" index="2-3">农产品分类</el-menu-item>
              </router-link>
              <router-link to="/information/product">
                <el-menu-item style="padding-left: 70px" index="2-4">农产品信息</el-menu-item>
              </router-link>
              <router-link to="/information/order">
                <el-menu-item style="padding-left: 70px" index="2-5">订单信息</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/user/list">
                <el-menu-item style="padding-left: 70px" index="1-1">用户列表</el-menu-item>
              </router-link>
              <router-link to="/user/store">
                <el-menu-item style="padding-left: 70px" index="1-2">店铺列表</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>海报管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/information/poster">
                <el-menu-item style="padding-left: 70px" index="6-1">海报列表</el-menu-item>
              </router-link>
              <!-- <router-link to="/order/exception">
                <el-menu-item style="padding-left: 70px" index="6-2">异常订单</el-menu-item>
              </router-link> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-wind-power"></i>
              <span>活动管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/activity/killActivity">
                <el-menu-item style="padding-left: 70px" index="7-1">秒杀活动列表</el-menu-item>
              </router-link>
              <!-- <router-link to="/order/exception">
                <el-menu-item style="padding-left: 70px" index="7-2">异常订单</el-menu-item>
              </router-link> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-opportunity"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="/system/permission">
                <el-menu-item style="padding-left: 70px" index="3-1">权限管理</el-menu-item>
              </router-link>
              <!-- <router-link to="/worker/daily">
                <el-menu-item style="padding-left: 70px" index="3-2">每日工作</el-menu-item>
              </router-link>
              <router-link to="/worker/add">
                <el-menu-item style="padding-left: 70px" index="3-3">新增员工</el-menu-item>
              </router-link> -->
            </el-menu-item-group>
          </el-submenu>


          <router-link  to="/setting">
            <el-menu-item index="7">
              <i class="el-icon-setting"></i>
              <span slot="title">个人设置</span>
            </el-menu-item>
          </router-link>

        </el-menu>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      role: localStorage.getItem('role')
    }
  }

}
</script>

<style scoped>
.aside {
  color: #FFFFFF;
}

.aside-header {
  padding: 21px;
  font-size: 18px;
  font-weight: 500;
}

.menu {
  font-size: 100px;
  border-right: 0;
  letter-spacing: 1px;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
}

</style>
