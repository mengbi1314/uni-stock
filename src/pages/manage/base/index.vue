<template>
    <view class="container">
        <u-grid :border="true" @click="changeGrid" col="2" :customStyle="GridStyle">
            <u-grid-item :name="baseListItem.id" :customStyle="ItemStyle" v-for="(baseListItem, baseListIndex) in baseList"
                :key="baseListIndex">
                <u-icon :customStyle="IconStyle" :name="baseListItem.name" :size="40"></u-icon>
                <text class="grid-text">{{ baseListItem.title }}</text>
            </u-grid-item>
        </u-grid>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            baseList: [{
                id: 1,
                name: 'more-circle-fill',
                title: '客户来源'
            },
            {
                id: 2,
                name: 'account-fill',
                title: '客户公海'
            },
            {
                id: 3,
                name: 'account',
                title: '客户私海'
            },
            {
                id: 4,
                name: 'plus-people-fill',
                title: '领取记录'
            },
            {
                id: 5,
                name: 'server-fill',
                title: '回访记录'
            },
            {
                id: 6,
                name: 'trash-fill',
                title: '客户回收站'
            },
            {
                id: 7,
                name: 'order',
                title: '课程订单'
            },
            {
                id: 8,
                name: 'file-text-fill',
                title: '商品订单'
            },
            ],
            GridStyle: {
                borderBottom: '1px solid #dadbde'
            },
            ItemStyle: {
                padding: '2em 0em'
            },
            IconStyle: {
                marginBottom: '.5em',
                color: "#19BC9C"
            },
        }
    },
    methods: {
        // 点击官格事件
        changeGrid(name) {
            let check = this.$u.auth.check()

            if (check === true) {
                switch (name) {
                    case 1:
                        this.$u.route('pages/manage/source/index');
                        break;

                    case 2:
                        this.$u.route('pages/manage/highsea/index');
                        break;
                    case 7:
                        this.$u.route('pages/manage/subject/index')
                        break;
                }
            }
        }
    },
}
</script>