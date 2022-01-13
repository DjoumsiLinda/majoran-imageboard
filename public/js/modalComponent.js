import { commentComponent } from "./commentComponent.js";
export const modalComponent = {
    props: ["id"],
    template: `
        <div class="modal">
            <div class="getImage">
            <div class="image">
                <img :src="image.url">
                <div id="info">
                    <h3>{{image.title}}</h3>
                    <p>{{image.description}}</p>
                    <p>Uploaded on {{image.created_at}}</p>
                    <p>Uploaded on {{new Date(image.created_at).getDate()}}/
                    {{(new Date(image.created_at).getMonth() + 1).toString().padStart(2, "0")}}/
                    {{new Date(image.created_at).getFullYear()}} ---
                    {{new Date(image.created_at).getHours()-1}}:
                    {{new Date(image.created_at).getMinutes()}}:
                    {{new Date(image.created_at).getSeconds()}}
                    </p>
                </div>
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
            image: {},
        };
    },
    mounted() {
        const path = "/images/" + this.id;
        fetch(path)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.image = data[0];
            });
    },
    methods: {
        handleClick() {
            this.$emit("close");
        },
    },
    components: { "comment-component": commentComponent },
};
