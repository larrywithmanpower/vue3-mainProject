export default {
    props: ['page'],
    template: `
    <nav aria-label="Page navigation">
        <ul class="pagination pagination-success">
            <li class="page-item"
                :class="{ 'disabled': !page.has_pre }">
                <a class="page-link link-success" href="#"
                    @click.prevent="$emit('get-data', page.current_page - 1)">Previous</a>
            </li>
            <li class="page-item" 
                :class="{ 'active': item === page.current_page }"
                v-for="item in page.total_pages" :key="item">
                <a class="page-link link-success" href="#" @click.prevent="$emit('get-data', item)">{{ item }}</a>
            </li>
            <li class="page-item"
                :class="{ 'disabled': !page.has_next }">
                <a class="page-link link-success" href="#"
                    @click.prevent="$emit('get-data', page.current_page + 1)"
                >Next</a>
            </li>
        </ul>
    </nav>
    `,
    created() {
        console.log(this.page);
    }
}