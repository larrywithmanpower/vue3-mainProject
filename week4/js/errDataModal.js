export default {
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
}