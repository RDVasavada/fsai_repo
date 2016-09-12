var React = require('react')
var ReactDOM = require('react-dom')

var BooksList = React.createClass({
    loadBooksFromServer: function(){
        $.ajax({
            url: "http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=83856&t.k=cbW9p5pFQDw&action=employers&q=apple",
            datatype: 'json',
            cache: false,
            success: function(data) {
                console.log(data)
                this.setState({data: data});
            }.bind(this)
        })
    },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadBooksFromServer();
        setInterval(this.loadBooksFromServer, 
                    this.props.pollInterval)
    }, 
    render: function() {
        if (this.state.data) {
            console.log('DATA!')
            var bookNodes = this.state.data.map(function(book){
                return <li> {book.title} </li>
            })
        }
        return (
            <div>
                <a href='https://www.glassdoor.com/index.htm'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a>
                <h1>Helloasdf React!</h1>
                <ul>
                    {bookNodes}
                </ul>
            </div>
        )
    }
})

ReactDOM.render(<BooksList pollInterval={1000} />, 
    document.getElementById('container'))
