<template>
    <div style="height:100%;">
        <!-- main content -->
        <view-box ref="viewBox" :body-padding-top="'0'" body-padding-bottom="50px">
            <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
            <!-- <transition :name="transitionName"> -->
                <keep-alive :include="/session|self|article/">
                    <router-view class="router-view"></router-view>
                </keep-alive>
            <!-- </transition> -->
            <tabbar class="vux-demo-tabbar" icon-class="vux-center" slot="bottom">
                <tabbar-item :link="{path:menus.chat.path}" :class="route.path === menus.chat.path?'hg-icon-select':''" :badge="sessionUnreadCount">
                    <span class="hg-icon-22 hg-icon-chat" slot="icon" style="position:relative;top: -2px;">&#xe637;</span>
                    <span slot="label" class="icon-title">{{menus.chat.name}}</span>
                </tabbar-item>
                <tabbar-item :link="{path:menus.article.path}" :class="route.path === menus.article.path?'hg-icon-select':''">
                    <span class="hg-icon-22 hg-icon-article" slot="icon">&#xe633;</span>
                    <span slot="label" class="icon-title">{{menus.article.name}}</span>
                </tabbar-item>
                <tabbar-item :link="{path:menus.self.path}" :class="route.path === menus.self.path?'hg-icon-select':''">
                    <span class="hg-icon-22 hg-icon-self" slot="icon">&#xe633;</span>
                    <span slot="label" class="icon-title">{{menus.self.name}}</span>
                </tabbar-item>
            </tabbar>
        </view-box>
    </div>
</template>

<script>
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    export default {
        name: 'mmenu',
        computed: {
            ...mapState({
                loadingStatus: state => state.loadingStatus,
                route: state => state.route,
                showToastMsg: state => state.showToastMsg
            }),
            ...mapGetters(['sessionUnreadCount'])
        },
        data() {
            return {
                menus: {
                    chat: {
                        name: '咨询医生',
                        path: "/build/vuepage/menu/session"
                    },
                    article: {
                        name: '科普文章',
                        path: "/build/vuepage/menu/article"
                    },
                    self: {
                        name: '个人中心',
                        path: "/build/vuepage/menu/self"
                    },
                },
                transitionName: 'forward'
            }
        }
    }
</script>
