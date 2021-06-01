// 登入
const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            apiPath: 'larry',
            // ! 可以使用v-model雙向綁定，這樣就不用像js需要取得DOM元素
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            const url = `${this.apiUrl}/admin/signin`;

            axios.post(url, this.user)
                .then((res) => {
                    if (res.data.success) {
                        // * 以重構的方式取得token與expired
                        const {token, expired} = res.data;
                        // ! 存取token至cookie
                        document.cookie = `myToken=${token}; expires=${new Date(expired)}`;
                        // ! 換頁
                        window.location = 'product.html';
                    } else {
                        // 提供登入失敗資訊
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
}).mount('#app');