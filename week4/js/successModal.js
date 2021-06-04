export default {
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
}