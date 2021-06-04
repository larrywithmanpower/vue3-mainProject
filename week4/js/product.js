import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
import pagination from './pagination.js';
import productModal from './productModal.js';
import delProductModal from './delProductModal.js';
import errDataModal from './errDataModal.js';
import successModal from './successModal.js';
import errLoginModal from './errLoginModal.js';
//! 問題：Modal如何import，如果import會被告知已宣告?? => 已解決：加上this後全部正常

// apiInfo(子元件用)
// ! 問題：如果是用ESM引入的modal，如果有帶到api資訊，是不是要在該隻檔案上重寫？是否有其他方法？
const apiPath = 'larry';
const apiUrl = 'https://vue3-course-api.hexschool.io';

// ! 如果將modal放在data()中的問題，不能使用ES module => 改為ESM外部引入
// let productModal = {};


const app = createApp({
    data() {
        return {
            // apiinfo
            apiPath: 'larry',
            apiUrl: 'https://vue3-course-api.hexschool.io',
            token: '',
            // products
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: false,
            // message
            message: '',
            // pagination
            pagination: {},
        }
    },
    // ? 區域註冊
    components: {
        pagination,
        productModal,
        delProductModal,
        errDataModal,
        successModal,
        errLoginModal
    },
    methods: {
        // getData
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            // axios
            axios.get(url)
                .then((res) => {
                    if (res.data.success) {
                        this.products = res.data.products;
                        this.pagination = res.data.pagination;
                        // console.log(res);
                        // console.log(this.pagination);
                    } else {
                        this.errDataModal.show();
                    }
                }).catch((err) => {
                    // ! 補上catch
                    console.log(err);
                })
        },
        // openModal
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imagesUrl: []
                    };
                    this.isNew = true;
                    this.productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = {
                        imagesUrl: [],
                        ...item
                    };
                    this.isNew = false;
                    this.productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = { ...item };
                    this.isNew = true;
                    this.delProductModal.show();
                    break;
            }
        },
        // undateProduct including adding and editing -- 有打錯字
        updateProduct(tempProduct) {
            // ? for new product
            if (this.isNew == true) {
                const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
                axios.post(url, { data: tempProduct })
                    .then((res) => {
                        if (res.data.success) {
                            this.getMessage(res);
                            this.getData();
                            // ! 建議：新增產品，若表單未填妥按下送出會先關掉 modal 才跳 alert 。所以移到這個位置，關閉新增modal後顯示成功modal。 
                            this.productModal.hide();
                            this.successModal.show();
                        } else {
                            // console.log(res);
                            this.getMessage(res);
                            this.errDataModal.show();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                // ? edit product
                const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
                axios.put(url, { data: tempProduct })
                    .then((res) => {
                        if (res.data.success) {
                            this.getMessage(res);
                            this.getData();
                            this.successModal.show();
                        } else {
                            this.getMessage(res);
                            this.errDataModal.show();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                this.productModal.hide();
            }
        },
        // deleteProduct
        deleteProduct(tempProduct) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${tempProduct.id}`;
            axios.delete(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getMessage(res);
                        this.getData();
                        this.successModal.show();
                    } else {
                        this.getMessage(res);
                        this.errDataModal.show();
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            this.delProductModal.hide();
        },
        // logout
        logout() {
            const url = `${this.apiUrl}/logout`;
            axios.post(url)
                .then((res) => {
                    if (res.data.success) {
                        this.getMessage(res);
                        this.tempProduct = {
                            imagesUrl: []
                        };
                        this.products = [];
                        // ! 清空token與products，要跟登入頁輸入參數名稱要相同，不能多也不能少
                        this.token = document.cookie = `myToken=; expires=;`;
                        this.products = [];
                        this.successModal.show();
                        setTimeout(() => {
                            window.location = 'index.html';
                        }, 1500);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        // ! 方便刪圖片
        removeImages() {
            if (this.tempProduct.imagesUrl.length) {
                this.tempProduct.imagesUrl.pop();
            } else {
                if (this.tempProduct.imageUrl) {
                    this.tempProduct.imageUrl = '';
                }
            }
        },
        getMessage(res) {
            this.message = res.data.message.toString();
        },
    },
    mounted() {
        // modal get
        this.productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        this.delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
        this.errLoginModal = new bootstrap.Modal(document.querySelector('#errLoginModal'));
        this.errDataModal = new bootstrap.Modal(document.querySelector('#errDataModal'));
        this.successModal = new bootstrap.Modal(document.querySelector('#successModal'));
        // ! 取出token
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // ! 判斷是否登入(參考範例)
        if (this.token === '') {
            this.errLoginModal.show();
            // back to login page after 2s
            setTimeout(() => {
                window.location = 'index.html';
            }, 2000);
        }
        axios.defaults.headers.common['Authorization'] = this.token;
        // ! 啟動
        this.getData();
    }
})
// ! component --> 全域註冊 => 改為區域註冊ESM引入
app.mount('#app');
