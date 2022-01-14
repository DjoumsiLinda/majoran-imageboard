import { commentComponent } from "./commentComponent.js";
export const modalComponent = {
    props: ["id"],
    template: `
        <div class="modal">
            <div class="getImage">
            <div class="image"  v-if="image">
                <img :src="image.url">
                <div id="info">
                    <h3>{{image.title}}</h3>
                    <p>{{image.description}}</p>
                    <p>Uploaded on {{new Date(image.created_at).getDate()}}/{{(new Date(image.created_at).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(image.created_at).getFullYear()}} 
                    at {{new Date(image.created_at).getHours()-1}}:{{new Date(image.created_at).getMinutes().toString().padStart(2, "0")}}
                    </p>
                </div>
                <p id="notdeleteimage" v-if="nottodelete">Sorry, but you cannot delete this image! </p>
                <button @click="deleteImage" id="deleteImage">Delete Image</button>
            </div>
            <div id="comment"> 
                <button id="btx" @click="handleClick">X</button> 
                <comment-component :id="id"></comment-component>
            </div>
            
            </div>
        </div>
    `,
    data() {
        return {
            image: null,
            nottodelete: false,
        };
    },
    mounted() {
        const path = "/images/" + this.id;
        fetch(path)
            .then((res) => {
                return res.json();
            })
            .then((image) => {
                if (image[0]) {
                    this.image = image[0];
                } else {
                    this.$emit("close", true);
                }
            });
    },
    methods: {
        handleClick() {
            this.$emit("close", true);
        },
        deleteImage() {
            //die erste 3 bilder von DB sollte nicgt gelöscht werden
            if (this.id <= 3) {
                this.nottodelete = true;
                return;
            }
            const path = "/delete/" + this.id;
            fetch(path)
                .then((res) => {
                    return res.json();
                })
                .then((rowCount) => {
                    console.log("Image succeffulL Delete:", rowCount);
                });
        },
    },
    components: { "comment-component": commentComponent },
};
