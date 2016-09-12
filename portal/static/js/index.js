var React = require('react')
var ReactDOM = require('react-dom')

var BooksList = React.createClass({
    loadBooksFromServer: function(){
        $.ajax({
            url: "/getsms",
            datatype: 'json',
            cache: false,
            success: function(data) {
                var newData = this.state.data.concat([data])[0];  
                this.setState({data: data.texts})
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
            var a = (this.state.data)
            var texts = a.map(function(x,i){
                return <li>{x.id} | {x.phone_number} | {x.user_id} | {x.message} | {x.analysis} | {x.resolution}</li>
            })
        }
        return (
            <div>
                <h1>Chatbot Portal</h1>
                <ul>
                    {texts}
                </ul>
            </div>
        )
    }
})

ReactDOM.render(<BooksList pollInterval={1000} />, 
    document.getElementById('container'))
