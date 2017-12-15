var data = [
    { Id: 1, Author: "Daniel Lo Nigro", Text: "Hello ReactJS.NET World!" },
    { Id: 2, Author: "Pete Hunt", Text: "This is one comment" },
    { Id: 3, Author: "Jordan Walke", Text: "This is *another* comment" }
];

class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    loadCommentsFromServer() {
        fetch(this.props.url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.setState({
                    ...this.state,
                    data: data
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    handleCommentSubmit(comment) {
        const requestDetails = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        };

        console.log(requestDetails);

        fetch(this.props.submitUrl, requestDetails)
            .then(() => {
                comment.Id = this.state.data.length + 1;
                this.setState({
                    ...this.state,
                    data: [
                        ...this.state.data,
                        comment
                    ]
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    componentWillMount() {
        this.loadCommentsFromServer();
        //window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }

    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={e => this.handleCommentSubmit(e)} />
            </div>
        );
    };
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map((comment) => {
            return <Comment author={comment.Author} key={comment.Id}>{comment.Text}</Comment>
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    };
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            author: '',
            text: ''
        };
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!author || !text) {
            return;
        }

        this.props.onCommentSubmit({
            Author: author,
            Text: text
        });

        this.setState({
            ...this.state,
            author: '',
            text: ''
        });
    }

    render() {
        return (
            <form className="commentForm" onSubmit={e => this.handleSubmit(e)}>
                <input
                    type="text"
                    name="author"
                    onChange={e => this.handleChange(e)}
                    placeholder="Your name"
                    value={this.state.author} />
                <input
                    type="text"
                    name="text"
                    onChange={e => this.handleChange(e)}
                    placeholder="Say something..."
                    value={this.state.text} />
                <input type="submit" value="Post" />
            </form>
        );
    };
}

class Comment extends React.Component {
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }

    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    };
}

ReactDOM.render(
    <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
    document.getElementById('content')
);

