export default {
    props: {
        product: {
            type: Object,
        }
    },
    template:
        `
    <div class="modal" tabindex="-1" ref="productModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title">{{ tempProduct.title }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6">
                        <img class="img-fluid rounded-2" :src="tempProduct.imageUrl" alt="">
                    </div>
                    <div class="col-6">
                            <span class="badge bg-success">{{ tempProduct.category }}</span>
                            <p class="">商品介紹：{{ tempProduct.description }}</p>
                            <p>詳細內容：{{ tempProduct.content }}</p>
                            <div class="d-flex">
                                <p><small><del>原價 {{ tempProduct.origin_price }}</del></small></p>
                                <p class="ms-auto text-danger h5"><strong>特價$ {{ tempProduct.price }} 元</strong></p>
                            </div>
                            <div class="input-group mb-3">
                                <input type="number" class="form-control" min="1" v-model.number="qty">
                                <button class="btn btn-success" type="button" id="button-addon2"
                                @click="$emit('add-cart', tempProduct.id, qty)"
                                >
                                    加入購物車
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            productModal: '',
            tempProduct: {},
            // ! 使用qty綁定數量，但為何不使用products回傳的num??
            qty: 1
        }
    },
    //! 使用watch 來賦予給tempProduct
    watch: {
        product() {
            this.tempProduct = this.product;
        }
    },
    methods: {
        openModal() {
            this.productModal.show();
        },
        hideModal() {
            this.productModal.hide();
        }
    },
    mounted() {
        this.productModal = new bootstrap.Modal(this.$refs.productModal);
    }
}