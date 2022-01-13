import { modalComponent } from "./modalComponent.js";
export const getImageComponent = {
    props: ["images"],
    template: `
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="/css/modalStyle.css">
        </head>
        <div class="im">
            <h1>Latest Images</h1>
            <div id="imageboards">
                <div v-for="image in images" id="imageboard" @click="handleselectedId(image.id)">
                        <img :src="image.url">
                    <p id="title">{{image.title}}</p>    
                </div>   
            </div>  
            <div id="cen">
                <button @click="loadMoreImage" v-if="loadMore" type="more" id="more">More Images</button> 
            </div>  
        </div>
        <modal-component @close="handleClose" :id="selectedImageId" v-if="selectedImageId"></modal-component>

    `,
    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.$emit("images", data);
                this.loadMoreButton(data);
            });
    },
    data() {
        return { selectedImageId: null, loadMore: false };
    },
    methods: {
        handleselectedId(id) {
            this.selectedImageId = id;
        },
        handleClose() {
            this.selectedImageId = null;
        },
        loadMoreImage() {
            // id of the last image the user currently sees on screen
            const lastId = this.images[this.images.length - 1].id;

            fetch(`/images/more?after=${lastId}`)
                .then((res) => {
                    return res.json();
                })
                .then((nextImages) => {
                    for (const i in nextImages) {
                        this.images.push(nextImages[i]);
                    }
                    this.loadMoreButton(nextImages);
                });
        },

        loadMoreButton(data) {
            if (data[data.length - 1].id === data[data.length - 1].lowestid) {
                this.loadMore = false;
            } else {
                this.loadMore = true;
            }
        },
    },
    components: { "modal-component": modalComponent },
};
