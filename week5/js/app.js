// api info
const apiPath = 'larry';
const apiUrl = 'https://vue3-course-api.hexschool.io';
// moaal
import productModal from './productModal.js';

// ? 使用解構將三項物件的內容取出
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
// ? 定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// ? 語系設定
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
    data() {
        return {
            products: [],
            product: {},
            carts: [],
            total: '',
            loadingStatus: {
                loadingItem: '',
            },
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: ''
                },
                message: ''
            }
        }
    },
    components: {
        productModal,
    },
    methods: {
        // ? 取得商品資訊
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products`;
            let loader = this.$loading.show();
            axios.get(url)
                .then((res) => {
                    if (res.data.success) {
                        this.products = res.data.products;
                        loader.hide()
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 取得單一商品
        getProduct(item) {
            this.loadingStatus.loadingItem = item.id;
            // console.log(this.loadingStatus.loadingItem);
            const url = `${apiUrl}/api/${apiPath}/product/${item.id}`;
            this.$refs.productModal.openModal();
            // console.log(item);
            axios.get(url)
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res.data);
                        this.product = res.data.product;
                        // console.log(this.product);
                        this.loadingStatus.loadingItem = '';
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 取得購物車資訊
        getCarts() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url)
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res.data.data);
                        this.total = res.data.data.final_total;
                        this.carts = res.data.data.carts;
                        // console.log(this.carts);
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 加入購物車
        addCart(id, qty = 1) {
            this.loadingStatus.loadingItem = id;
            // ! product_id(String)、qty(Number) 為必填欄位
            const cart = {
                product_id: id,
                qty
            }
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.post(url, { data: cart })
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res.data);
                        alert(res.data.message)
                        this.$refs.productModal.hideModal();
                        this.loadingStatus.loadingItem = '';
                        this.getCarts();
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 清空購物車
        delCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url)
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res);
                        this.getCarts();
                        alert(`${res.data.message}所有商品`);
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 刪除單一購物車產品
        delCartItem(cart) {
            const url = `${apiUrl}/api/${apiPath}/cart/${cart.id}`;
            axios.delete(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getCarts();
                        alert(`${cart.product.title}${res.data.message}`);
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 更新購物車
        updateCart(cart) {
            console.log(cart);
            const url = `${apiUrl}/api/${apiPath}/cart/${cart.id}`;
            const obj = {
                product_id: cart.id,
                qty: cart.qty
            }
            this.loadingStatus.loadingItem = cart.id;
            axios.put(url, { data: obj })
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res);
                        this.loadingStatus.loadingItem = '';
                        this.getCarts();
                    } else {
                        alert(res.data.message)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ? 送出訂單
        onSubmit() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const user = this.form.user;
            const message = this.form.message;
            // console.log(user);
            axios.post(url, { data: {user, message} })
                .then((res) => {
                    if (res.data.success) {
                        // console.log(res);
                        alert(res.data.message);
                        //! VeeValidate內建函式
                        this.$refs.form.resetForm();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        isPhone(value) {
                const phoneNumber = /^(09)[0-9]{8}$/
                return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        }
    },
    created() {
        this.getProducts();
        this.getCarts();
    }
})

app.use(VueLoading);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');

