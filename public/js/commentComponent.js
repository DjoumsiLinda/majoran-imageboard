export const commentComponent = {
    props: ["id"],
    template: `
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="/css/commentStyle.css">
        </head>
        <div class="commentcom">
            <h3> Add a Comment! </h3>
            <textarea type="text" name="comment" v-model="comment" rows="10" cols="50" placeholder="Please write your comment here"></textarea> 
            <input type="text" name="username" v-model="username" placeholder="username">
            <button @click="handleClick">Submit</button>
            <div id="allComments">
                <li v-for="comment in comments" v-if="comments.length">
                    {{comment.username}} has wrote "{{comment.comment}}" on {{new Date(comment.created_at).getDate()}}/{{(new Date(comment.created_at).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(comment.created_at).getFullYear()}} 
                    at {{new Date(comment.created_at).getHours()}}:{{new Date(comment.created_at).getMinutes().toString().padStart(2, "0")}}
                </li>
                <p v-else> not comment </p>
            </div>
        </div>
    `,
    data() {
        return {
            comment: "",
            username: "",
            comments: [],
        };
    },
    mounted() {
        const path = "/comments/" + this.id;
        fetch(path)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data) {
                    this.comments = data;
                }
            });
    },
    methods: {
        handleClick() {
            if (this.comment && this.username) {
                console.log("Click on submit", this.comment, this.username);
                let newComment = {
                    comment: this.comment,
                    username: this.username,
                    image_id: this.id,
                };
                //insert new comment
                fetch("/comment", {
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
                        this.comments.unshift(data[0]);
                        this.comment = "";
                        this.username = "";
                    });
            }
        },
    },
};
