import { moreCommentsComponent } from "./moreCommentsComponent.js";
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
                <p v-if="comments.length"> Nicht Vollständig</p>
                <li v-for="(comment, index) in comments" v-if="comments.length" @click="clickComment(comment.id, comment.comment, comment.username, comment.created_at)">
                    {{comment.username}} has wrote "{{comment.comment}}" on {{new Date(comment.created_at).getDate()}}/{{(new Date(comment.created_at).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(comment.created_at).getFullYear()}} 
                    at {{new Date(comment.created_at).getHours()}}:{{new Date(comment.created_at).getMinutes().toString().padStart(2, "0")}}
                    <div id="allmoreComments">
                        <li :v-if="allcomment.username" v-for="allcomment in moreComments">
                            {{allcomment.username}}: "{{allcomment.comment}}" on {{new Date(allcomment.created_at).getDate()}}/{{(new Date(allcomment.created_at).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(allcomment.created_at).getFullYear()}} 
                            at {{new Date(allcomment.created_at).getHours()}}:{{new Date(allcomment.created_at).getMinutes().toString().padStart(2, "0")}}
                        </li>
                    </div>
                </li>
                <p v-else> not comment </p>
            </div>
        </div>
        <more-comments-component @close="handleClose" :selectedDatum="selectedDatum" :selectedUsername="selectedUsername" :selectedcomment="selectedComment" :id="selectedCommentId" v-if="selectedCommentId"></more-comments-component>

    `,
    data() {
        return {
            comment: "",
            username: "",
            moreComments: [],
            comments: [],
            selectedComment: null,
            selectedCommentId: null,
            selectedUsername: null,
            selectedDatum: null,
            objComments: [],
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
                    console.log(this.id, data);
                    this.comments = data;
                    for (let i = 0; i < this.comments.length; i++) {
                        if (this.comments[i].id) {
                            const path2 =
                                "/moreArraycomments/" + this.comments[i].id;
                            fetch(path2)
                                .then((res) => {
                                    return res.json();
                                })
                                .then((data) => {
                                    if (data[0]) {
                                        this.moreComments.push(data[0]);
                                    }
                                    const com = [];
                                    com.push(this.comments[i]);
                                    com.push(data[0]);
                                    this.objComments.push(com);
                                });
                        }
                    }
                    console.log("++++++++++", this.objComments);
                }
            });
    },
    methods: {
        handleClick() {
            if (this.comment && this.username) {
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
                        /*alert(
                            "a new comment has been added, refresh the browser"
                        );*/
                        this.comment = "";
                        this.username = "";
                    });
            }
        },
        clickComment(id, comment, username, datum) {
            this.selectedUsername = username;
            this.selectedDatum = datum;
            this.selectedCommentId = id;
            this.selectedComment = comment;
        },
        handleClose(data) {
            this.selectedCommentId = null;
            for (let i = 0; i < data.length; i++) {
                this.moreComments.push(data[i]);
            }
        },
    },
    components: { "more-comments-component": moreCommentsComponent },
};
