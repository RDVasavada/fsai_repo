var React = require('react')
var ReactDOM = require('react-dom')

var SMSList = React.createClass({
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
var MSGList = React.createClass({
    loadMessagesFromServer: function() {
        var chosen = JSON.parse(localStorage.getItem('user')).id;
        var status = JSON.parse(localStorage.getItem('user')).status;
        $.ajax({
            url: "/user/getmsg",
            datatype: 'json',
            data: {'selected' : chosen, 'status': status},
            cache: false,
            success: function(data) {
                if (status == "newfriend") {
                    this.setState({data: data.data, status:-1, chosen_id: String(chosen)})
                } else {
                    this.setState({data: data.data, status: 'friend'})
                }
            }.bind(this)
        })
    },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {  
        this.loadMessagesFromServer();
        setInterval(this.loadMessagesFromServer,
                    this.props.pollInterval)
    },
    render: function() {
        if (this.state.data) {
            var a = this.state.status
            var b = this.state.data
            var c = this.state.chosen_id
            if (a=='-1'){
                var accept = function() {
                    console.log(c)
                    $.ajax({
                        url: "/user/accept",
                        data: {'acceptid':c},
                        type: 'POST'
                    });
                    location.reload()
                }
                var username = b[0][0].username
                return (
                    <div> {username} would you like to contact you.
                        <button onClick={accept}> Accept </button>
                    </div>
                )
            } else {
                var messages = b.map(function(x,i) {
                    console.log(x.length)
                    if (x.length > 0) {
                        console.log(x[0])
                        if (x == "blank") {
                            return <span>This person has not yet accepted your friend request.</span>   
                        }
                        if (x == "newfriend") {
                            return <div> Accepted your friend request! </div>
                        } else {
                            if (x[0].content !== 'newfriend') {
                                if (x[0].content !== 'blank') {
                                    return <div> {x[0].content}</div>
                                }
                            }
                        }
                    }
                })
            }
        }
        return (
            <div>
                {messages}
            </div>
        )
    }
})
var SentList = React.createClass({
    loadMessagesFromServer: function() {
        var chosen = JSON.parse(localStorage.getItem('user')).id;
        var status = JSON.parse(localStorage.getItem('user')).status;
        $.ajax({
            url: "/user/getsent",
            data: {'selected':chosen},
            type: 'POST',
            datatype: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data.data, status: 'friend'})
            }.bind(this)
        })
    },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {  
        this.loadMessagesFromServer();
        setInterval(this.loadMessagesFromServer,
                    this.props.pollInterval)
    },
    render: function() {
        if (this.state.data) {
            var a = this.state.status
            var b = this.state.data
            var messages = b.map(function(x,i) {
                console.log(x.length)
                if (x.length > 0) {            
                    if (x[0].content !== 'newfriend') {
                        if (x[0].content !== 'blank') {
                            return <div> {x[0].content}</div>
                        }
                    }
                }
            })
        }
        return (
            <div>
                {messages}
            </div>
        )
    }
})

url = String(window.location.href)
if ((url.indexOf("inbox")) > 0 ){
    ReactDOM.render(<MSGList pollInterval={1000} />,
        document.getElementById('mcontainer'))
} else if ((url.indexOf("sent")) > 0 ) {
    ReactDOM.render(<SentList pollInterval={1000} />, 
        document.getElementById('mcontainer'))
} else if ((url.indexOf("chat_portal")) > 0 ) {
    ReactDOM.render(<SMSList pollInterval={1000} />, 
        document.getElementById('container'))
}
