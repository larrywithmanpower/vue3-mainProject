const apiPath = 'larry';
const apiUrl = 'https://vue3-course-api.hexschool.io';

export default {
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
                                    <input type="file" id="photoFile" class="form-control" placeholder="請輸入圖片路徑" @change="uploadToCloud">
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
            },
            // ! 在內層加入上傳圖片方法
            uploadToCloud() {
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
                        // console.log(res.data);
                        // ! 判斷tempProduct.imageUrl是否存在，不存在就加入倒imageUrl(單張)，存在新增到陣列imagesUrl中
                        if (!this.tempProduct.imageUrl) {
                            this.tempProduct.imageUrl = res.data.imageUrl;
                        } else {
                            this.tempProduct.imagesUrl.push(res.data.imageUrl);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
    },
}