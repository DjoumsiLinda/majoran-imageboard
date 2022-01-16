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
        // browser url changed, e.g. because the user
        // navigated back and forth with the browser history buttons
        window.addEventListener("popstate", () => {
            this.selectedImageId = location.pathname.slice(1);
        });
    },
    data() {
        return { selectedImageId: location.pathname.slice(1), loadMore: false };
    },
    methods: {
        handleselectedId(imageId) {
            history.pushState({}, "", "/" + imageId);
            this.selectedImageId = imageId;
        },
        handleClose(invalid = false, deleteImage = false) {
            if (!invalid) {
                // navigate to URL WITH adding an entry to the browser history
                history.pushState({}, "", "/");
            } else {
                // navigate to URL WITHOUT adding an entry to the browser history
                history.replaceState({}, "", "/");
            }
            if (deleteImage) {
                let position = 0;
                for (const i in this.images) {
                    if (this.images[i].id === this.selectedImageId) {
                        position = i;
                        break;
                    }
                }
                this.images.splice(position, 1);
                if (this.images.length <= 2) {
                    this.loadMoreImages();
                }
            }

            this.selectedImageId = null;
        },
        loadMoreImage() {
            this.loadMoreImages();
        },
        loadMoreImages() {
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
