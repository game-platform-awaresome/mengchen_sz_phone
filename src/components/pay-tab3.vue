<template>
    <div>
        <div style="margin-top: 0.5rem" class="d-flex justify-content-start">
            <div style="margin-left: 1rem">
                <img height="20px" src="../assets/title_dot.png"/>
            </div>
            <div style="margin-left: 0.5rem">
                <span style="text-align: center" class="pay-tab-title">购买房卡</span>
            </div>
        </div>
        <div style="margin-top: 1rem">
            <div style="margin-left: 1rem;margin-right: 1rem" class="d-flex justify-content-between">
                <div class="user-font">选择牌艺馆</div>
                <div class="user-font">牌艺馆房卡余量：<span class="user-fangka">{{communityBalance}}</span></div>
            </div>

            <div v-if="loading === false">
                <select v-model="formData.community_id" class="m-input" v-on:change="searchCommunityBalance">
                    <option :value="community.id" v-for="community in communityList"
                    >{{community.id}}-{{community.name}}</option>
                </select>
            </div>
        </div>
        <div style="margin-top: 1rem">
            <div style="margin-left: 1rem;margin-right: 1rem" class="d-flex justify-content-between">
                <div class="user-font">充值数量</div>
            </div>

            <div>
                <input v-model="formData.item_amount" class="m-input"/>
            </div>

            <div v-on:click="pay()" style="margin-top: 2.5rem;">
                <div style="margin: 0 auto;margin-top: 0.5rem" class="pay-btn"><span>提交订单</span></div>
            </div>
        </div>
    </div>

</template>

<script>
    import {myTools} from '../tools/myTools.js'
    import qs from 'qs'

    window.confirm = function (message) {
            var iframe = document.createElement("IFRAME");
            iframe.style.display = "none";
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            var alertFrame = window.frames[0];
            var result = alertFrame.window.confirm(message);
            iframe.parentNode.removeChild(iframe);
            return result;
    };

    export default {
        data () {
            return {
              formData: {
                item_type_id: 1,    //房卡道具类型id
                community_id: '',
                item_amount: '',
              },

              loading: true,
              communityList: [],
              topUpApi: '/agent/api/community/card/top-up',
              communitiesApi: '/agent/api/communities',  //获取此代理商的所有牌艺馆
              communityInfoApiPrefix: '/agent/api/community/info/',
              communityBalance: 0,
              agentInfoApi: '/api/info',
            }
        },
        methods:{
            pay: function () {
              let _self = this

              if (this.formData.item_amount <= 0) {
                return alert('数量错误')
              }

                let r = confirm("是否给玩家（ID:"+this.formData.community_id+"）充值"+this.formData.item_amount+"张房卡？")
                console.log("r="+r)
                if (r==true){
            
                    myTools.axiosInstance.post(this.topUpApi, qs.stringify(this.formData))
                        .then(function (res) {
                        let msg = res.data.error ? res.data.error : res.data.message
                        _self.formData.item_amount = 0
                        _self.updateInfo()
                        _self.searchCommunityBalance()   //刷新玩家房卡余量
                        return alert(msg)
                        })
                }
            },

          searchCommunityBalance () {
            let _self = this

            myTools.axiosInstance.get(this.communityInfoApiPrefix + this.formData.community_id)
              .then(function (res) {
                _self.communityBalance = res.data.card_stock
              })
          },
          updateInfo () {
            let _self = this
            myTools.axiosInstance.get(this.agentInfoApi)
              .then(function (res) {
                _self.$root.eventHub.$emit('main:info', res.data)
              })
          },
        },
      created () {
        let _self = this

        myTools.axiosInstance.get(this.communitiesApi)
        .then(function (res) {
          _self.communityList = res.data.communities
          //默认选中第一个
          if (_self.communityList.length > 0) {
            _self.formData.community_id = _self.communityList[0].id
            _self.searchCommunityBalance()
          }
          _self.loading = false
        })
      },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .pay-tab-title{
        font-family: MicrosoftYaHei-Bold;
        font-size: 1rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1rem;
        letter-spacing: 0rem;
        color: #573126;
    }
    .user-font{
        font-family: MicrosoftYaHei;
        font-size: 1rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1.5rem;
        letter-spacing: 0rem;
        color: #573126;
    }
    .user-fangka{
        font-family: MicrosoftYaHei;
        font-size: 1rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1.5rem;
        letter-spacing: 0rem;
        color: #f14b1b;
    }
    .m-input{
        height: 2rem;
        width: 91%;
        border: 0px;
        margin-top: 0.5rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        padding-left: 5px;
        padding-right: 5px;
        background-color: #ffffff;
        border-radius: 0.3rem;
    }
    .pay-btn{
        height: 3rem;
        width: 11rem;
        background-color: #41af11;
        border-radius: 0.5rem;
        font-family: MicrosoftYaHei-Bold;
        font-size: 1rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 3rem;
        letter-spacing: 0rem;
        color: #ffffff;
        text-align: center;
    }
</style>
