export const moreCommentsComponent = {
    props: ["id"],
    template: `
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="/css/moreCommentStyle.css">
        </head>
        <div class="moreComment">
            <div id="getComment">
                <div id="addComments"> 
                    <p> {{comments}} {{id}} </p>
                    <div id="inputMoreComment">
                        <input id="more" type="text" name="moreComments" v-model="moreComments" placeholder="add you comments"> 
                        <input type="text" name="username" v-model="username" placeholder="username"> 
                        <button type="submit" id="upload" @click="addMoreComment">Add</button>
                    </div> 
                </div>
            </div>
            <div id="morecommentbtx"> 
                <button  @click="handleClick">X</button>
            </div>
        </div>
       
    `,
    data() {
        return { comments: [], moreComments: "", username: "" };
    },
    mounted() {
        //pour get le commentaire
    },
    methods: {
        addMoreComment() {
            console.log(this.moreComments);
            //fetch pour ajouter le nveau commentaire a la db
            let newComment = {
                comment: this.moreComments,
                username: this.username,
                comment_id: this.id,
            };
            //insert new comment
            fetch("/morecomment", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(newComment),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data[0]);
                    this.comments.pop(data[0]);
                    this.moreComments = "";
                    this.username = "";
                });
        },
        handleClick() {
            this.$emit("close", true);
        },
    },
};
