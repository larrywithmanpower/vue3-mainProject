
const app = Vue.createApp({
    data() {
        return {
            products: [
                {
                    id: "1",
                    category: "1",
                    name: "LV1產品",
                    imagesUrl: ['https://ithelp.ithome.com.tw/storage/image/logo.svg'],
                    origin_price: 300,
                    price: 100,
                    is_enabled: true
                },
                {
                    id: "2",
                    category: "2",
                    name: "LV1產品2",
                    imagesUrl: [],
                    origin_price: 400,
                    price: 200,
                    is_enabled: true
                },
                {
                    id: "3",
                    category: "3",
                    name: "LV1產品3",
                    imagesUrl: [],
                    origin_price: 500,
                    price: 300,
                    is_enabled: false
                }
            ],
            // 新增編輯Modal
            productModal: "",
            // 刪除modal
            delModal: {},
            temp: {
                // 時間轉換參考http://www.eion.com.tw/Blogger/?Pid=1148
                // 寫法沒有那麼複雜，直接在函式中用淺層拷貝拷貝
                // 注意：裡面的屬性可以不用寫入，在v-model時會自動寫入屬性與值
                imagesUrl: [],
            },
            // 用isNew判斷新增或編輯
            isNew: false
        };
    },
    methods: {
        change(id) {
            this.products.forEach((item) => {
                if (id == item.id) {
                    item.is_enabled = !item.is_enabled;
                }
            });
        },
        delItem() {
            // 這邊使用splice與findIndex組合計
            // splice第一個參數索引值直接使用findIndex來尋找

            this.products.splice(this.products.findIndex((item) => item.id == this.temp.id), 1);
            delModal.hide();

        },
        // 帶入參數isNew(new, edit)是要判斷新增或編輯、帶入item是帶入那個編輯的物件
        openModal(isNew, item) {
            if (isNew == 'new') {
                this.temp = {
                    imagesUrl: []
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew == 'edit') {
                // temp淺層拷貝item(選到的物件)，否則會改到原始資料
                this.temp = { ...item };
                this.isNew = false;
                productModal.show()
            } else if (isNew == 'del') {
                this.temp = { ...item };
                delModal.show()
            }
        },
        updateProduct() {
            if (this.isNew) {
                this.products.push({
                    id: Date.now(),
                    ...this.temp
                })
                // 應該是用來清空陣列
                this.temp = {
                    imagesUrl: []
                }
                productModal.hide();
            } else {
                // 搜尋相同的id然後來進行資訊更新
                // findIndex 用法參考
                // https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
                const index = this.products.findIndex((item) => item.id === this.temp.id);
                this.products[index] = this.temp;
                productModal.hide();
            }
        },
        addImage() {
            // 先重置 清空陣列
            this.temp.imagesUrl = [];
            this.temp.imagesUrl.push('');
        }
    },
    mounted() {
        // bs Modal掛載
        productModal = new bootstrap.Modal(document.querySelector("#productModal"));
        delModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
    }
}).mount("#app");