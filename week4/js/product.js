import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
import pagination from './pagination.js';
// ! 問題：Modal如何import，如果import會被告知已宣告??

// apiInfo(子元件用)
const apiPath = 'larry';
const apiUrl = 'https://vue3-course-api.hexschool.io';

// ! 如果將modal放在data()中的問題，不能使用ES module
let productModal = {};
let delProductModal = {};
let errDataModal = {};
let errLoginModal = {};
let successModal = {};

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
    // 區域註冊
    components: {
        pagination,
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
                        errDataModal.show();
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
                    productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = {
                        imagesUrl: [],
                        ...item
                    };
                    this.isNew = false;
                    productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = { ...item };
                    this.isNew = true;
                    delProductModal.show();
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
                            this.upload();
                            productModal.hide();
                            successModal.show();
                        } else {
                            // console.log(res);
                            this.getMessage(res);
                            errDataModal.show();
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
                            this.upload();
                            successModal.show();
                        } else {
                            this.getMessage(res);
                            errDataModal.show();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                productModal.hide();
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
                        successModal.show();
                    } else {
                        this.getMessage(res);
                        errDataModal.show();
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            delProductModal.hide();
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
                        }
                        // ! 清空token與products，要跟登入頁輸入參數名稱要相同，不能多也不能少
                        this.token = document.cookie = `myToken=; expires=;`;
                        this.products = [];
                        successModal.show();
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
        // ! 加上圖片上傳
        upload() {
            // ? 上傳的檔案去哪看??
            // ! DOM要放在子元件內才找的到
            const fileInput = document.querySelector('#photoFile');
            // 取出fileInput中的相片檔案
            const file = fileInput.files[0];
            // 格式轉換：使用formData格式來上傳
            const formData = new FormData();
            // 新增欄位file-to-upload
            formData.append('file-to-upload', file);
            
            axios.post(`${apiUrl}/api/${apiPath}/admin/upload`, formData)
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
    mounted() {
        // modal get
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
        errLoginModal = new bootstrap.Modal(document.querySelector('#errLoginModal'));
        errDataModal = new bootstrap.Modal(document.querySelector('#errDataModal'));
        successModal = new bootstrap.Modal(document.querySelector('#successModal'));
        // ! 取出token
        this.token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // ! 判斷是否登入(參考範例)
        if (this.token === '') {
            errLoginModal.show();
            // back to login page after 2s
            setTimeout(() => {
                window.location = 'index.html';
            }, 2000)
        }
        axios.defaults.headers.common['Authorization'] = this.token;
        // ! 啟動
        this.getData();
    }
})
    // ? component --> 全域註冊
    .component('productModal', {
        props: ['tempProduct', 'isNew'],
        // ! 1. 改寫確認按鈕有關updateProduct的觸發，觸發外層元件使用emit
        // ! 2. 嘗試加入上傳圖檔
        template:
            `
            <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
            aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content border-0">
                        <div class="modal-header text-white" :class="{'bg-warning': !isNew, 'bg-success': isNew}">
                            <h5 id="productModalLabel" class="modal-title">
                                <span v-if="isNew">新增產品</span>
                                <span v-else>編輯產品</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <!-- ? 圖片新增 -->
                                <div class="col-sm-4">
                                    <div class="mb-1">
                                        <div class="form-group">
                                            <label for="imageUrl">主要圖片</label>
                                            <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
                                        </div>
                                        <img class="img-fluid" :src="tempProduct.imageUrl">
                                    </div>
                                    <!-- ? 多圖 -->
                                    <div class="mb-1">其他圖片</div>
                                    <div v-if="Array.isArray(tempProduct.imagesUrl)">
                                        <div class="mb-1" v-for="(image, index) in tempProduct.imagesUrl" :key="index">
                                            <label for="imageUrl">圖片網址</label>
                                            <input v-model="tempProduct.imagesUrl[index]" type="text" class="form-control" placeholder="請輸入圖片連結">
                                            <img :src="tempProduct.imagesUrl[index]" class="img-fluid">
                                        </div>   
                                        <div 
                                        v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                                            <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')">
                                                新增圖片
                                            </button>
                                        </div>
                                        <div v-else>
                                            <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                                                刪除空白圖片網址
                                            </button>
                                        </div>
                                    </div> 
                                    <div class="mt-2">
                                        <button class="btn btn-sm btn-danger d-block w-100" @click="removeImages()">刪除圖片</button>
                                    </div>
                                    
                                </div>
                                <!-- ? 產品資料新增 -->
                                <div class="col-sm-8">
                                    <div class="form-group">
                                        <label for="title">標題</label>
                                        <input v-model="tempProduct.title" id="title" type="text" class="form-control"
                                            placeholder="請輸入標題">
                                    </div>

                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="category">分類</label>
                                            <input v-model="tempProduct.category" id="category" type="text"
                                                class="form-control" placeholder="請輸入分類">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="price">單位</label>
                                            <input v-model="tempProduct.unit" id="unit" type="text" class="form-control"
                                                placeholder="請輸入單位">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="origin_price">原價</label>
                                            <input v-model.number="tempProduct.origin_price" id="origin_price" type="number"
                                                min="0" class="form-control" placeholder="請輸入原價">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="price">售價</label>
                                            <input v-model.number="tempProduct.price" id="price" type="number" min="0"
                                                class="form-control" placeholder="請輸入售價">
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="form-group mb-3">
                                        <label for="photoFile">上傳圖片檔案</label>
                                        <input type="file" id="photoFile" class="form-control" placeholder="請輸入圖片路徑">
                                    </div>
                                    <div class="form-group mb-3">
                                        <label for="description">產品描述</label>
                                        <textarea v-model="tempProduct.description" id="description" type="text"
                                            class="form-control" placeholder="請輸入產品描述"></textarea>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label for="content">說明內容</label>
                                        <textarea v-model="tempProduct.content" id="description" type="text"
                                            class="form-control" placeholder="請輸入說明內容"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-check">
                                            <input v-model="tempProduct.is_enabled" id="is_enabled" class="form-check-input"
                                                type="checkbox" :true-value="1" :false-value="0">
                                            <label class="form-check-label" for="is_enabled">是否啟用</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                取消
                            </button>
                            <button type="button" class="btn" :class="{'btn-success': isNew, 'btn-warning': !isNew}" @click="$emit('update-product', tempProduct)">
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            </div>`,
        methods: {
            // ! 修改圖片刪除不正常的位置
            removeImages() {
                if (this.tempProduct.imagesUrl.length) {
                    this.tempProduct.imagesUrl.pop();
                } else {
                    if (this.tempProduct.imageUrl) {
                        this.tempProduct.imageUrl = '';
                    }
                }
            }            
        },
    })
    .component('delProductModal', {
        props: ['tempProduct'],
        template:
            `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="delProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 id="delProductModalLabel" class="modal-title">
                            <span>刪除產品</span>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        是否刪除
                        <strong class="text-danger"> {{ tempProduct.title }} </strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            取消
                        </button>
                        <button type="button" class="btn btn-danger" @click="$emit('deleteProduct', tempProduct)">
                            確認刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>`,

    })
    .component('errLoginModal', {
        template:
            `
        <div class="modal" tabindex="-1" id="errLoginModal" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog pb-3">
                <div class="modal-content">
                    <div class="modal-header bg-danger">
                        <h5 class="modal-title text-white">錯誤資訊</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="h3"><strong>尚未登入，請重新登入</strong></p>
                    </div>
                </div>
            </div>
        </div>
        `,
    })
    .component('errDataModal', {
        props: ['message'],
        template:
            `
        <div class="modal" tabindex="-1" id="errDataModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger">
                        <h5 class="modal-title text-white">資料錯誤訊息</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="h5"><strong> {{ message }} </strong></p>
                    </div>
                    <div class="modal-footer p-1">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">確認
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
    })
    .component('successModal', {
        props: ['message', 'tempProduct'],
        template:
            `
        <div class="modal" tabindex="-1" id="successModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">資料完成訊息</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="h5"><strong class="text-success"> {{ tempProduct.title ? tempProduct.title : '' }} </strong> {{ message }} </p>
                    </div>
                    <div class="modal-footer p-1">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">了解</button>
                    </div>
                </div>
            </div>
        </div>
        `
    })

app.mount('#app');
