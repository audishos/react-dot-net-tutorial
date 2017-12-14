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
                <CommentForm />
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

    render() {
        return (
            <form className="commentForm">
                <input
                    type="text"
                    name="author"
                    onChange={e => this.handleChange(e)}
                    placeholder="Your name" />
                <input
                    type="text"
                    name="text"
                    onChange={e => this.handleChange(e)}
                    placeholder="Say something..." />
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
    <CommentBox url="/comments" pollInterval={2000} />,
    document.getElementById('content')
);

