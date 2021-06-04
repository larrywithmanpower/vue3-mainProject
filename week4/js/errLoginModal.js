export default {
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
}