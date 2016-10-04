var React = require('react')
var ReactDOM = require('react-dom')
var FaTrash = require('react-icons/lib/fa/trash-o')
var FaStarO = require('react-icons/lib/fa/star-o')
var FaStar = require('react-icons/lib/fa/star')

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
                    }).done(function(x) {
                        // this.setState({})
                        // var str = "#a" + String(c)
                        // $("'a"+str+"'")[0].innerText = "asdf"
                        // localStorage.setItem('user',JSON.stringify({'id':0,'status':'none'}))
                        setTimeout(function(){ 
                            window.location = "/user/inbox";
                        }, 200);                        
                    });
                }
                var username = b[0][0].username
                var divStyle = {
                    textAlign: 'center',
                    margin: '50px',
                };
                var buttonStyle = {
                    backgroundColor: 'transparent',
                    borderRadius: '4px',
                    border: '1px solid white',
                    padding: '5px 20px',
                    marginTop: '25px,'
                };
                return (
                    <div style={divStyle}> {username} would you like to contact you.
                        <br />
                        <button style={buttonStyle} onClick={accept}> Accept </button>
                    </div>
                )
            } else {
                var messages = b.map(function(x,i) {
                    if (x.length > 0) {
                        var divStyle = {
                            position: 'relative',
                            top:'20px'
                        }
                        if (x == "blank") {
                            return <span style={divStyle}>This person has not yet accepted your friend request.</span>   
                        }
                        if (x == "newfriend") {
                            return <div> Accepted your friend request! </div>
                        } else {
                            if (x[0].content !== 'newfriend') {
                                if (x[0].content !== 'blank') {
                                    if (x[0].content) {
                                        var you = $("div.name")[0].innerText
                                        var ct = String(x[0].content)
                                        var trim = x[0].content.indexOf('>')
                                        var str = ct.slice(trim+3)
                                        var writer = ct.slice(1,trim)
                                        if (writer == you) {
                                            var style = {
                                                marginRight: '75px',
                                                fontSize: '12px',
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '10px',
                                                position: 'relative',
                                                textAlign: 'right',
                                                marginTop: '10px',
                                            }
                                            var spanRight = {
                                                float: 'right',
                                                position: 'relative',
                                                left: '15px'
                                            }
                                            var iconDel = {
                                                verticalAlign: 'middle',
                                                color: 'white',
                                                margin: '5px',
                                                top: '15px',
                                                position: 'relative',
                                                right: '37px',
                                                color:'white',
                                            } 
                                            var iconStar = {
                                                verticalAlign: 'middle',
                                                color: 'white',
                                                margin: '5px',
                                                top: '15px',
                                                position: 'relative',
                                                right: '30px',
                                                color:'white'
                                            }
                                            var divStyle = {
                                                position: 'relative',
                                                bottom: '23px'
                                            }
                                            var starid = "star"+String(x[0].id)                                             
                                            var starMe = function(id){
                                                $.ajax({
                                                    url: '/user/starmsg',
                                                    type: 'POST',
                                                    data: {'id': id},
                                                    datatype: 'json'
                                                }).done(function(res) {
                                                    if (String(res.data) == 'star') {
                                                        var starid = "star"+id
                                                        ReactDOM.render(<FaStar id={starid} style={iconStar} />,
                                                            document.getElementById(starid))                          
                                                    } else {
                                                        var starid = "star"+id
                                                        ReactDOM.render(<FaStarO id={starid}  style={iconStar} />,
                                                            document.getElementById(starid))                          
                                                    }    
                                                })
                                            }
                                            var delMe = function(id) {
                                               $.ajax({
                                                    url: '/user/delmsg',
                                                    type: 'POST',
                                                    data: {'delid': id},
                                                    datatype: 'json'
                                                }).done(function(res) {
                                                   console.log(res)
                                                   this.forceUpdate()
                                                })                                                
                                            }
                                            var myStar = React.createClass
                                            return(
                                                <div>
                                                    <span style={spanRight}>{you}
                                                     <FaTrash onClick={() => { delMe(x[0].id) }} style={iconDel} />
                                                     <myStar />
                                                     <div id={starid} style={divStyle}>
                                                     <FaStarO onClick={() => { starMe(x[0].id) }} id={starid} style={iconStar} />
                                                     </div>
                                                    </span>
                                                    <div style={style}>{str}</div>
                                                </div>
                                            )
                                        } else {
                                            var style = {
                                                marginLeft: '75px',
                                                fontSize: '12px',
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '10px',
                                                position: 'relative',
                                                textAlign: 'left',
                                                marginTop: '10px'
                                            }
                                            var spanLeft = {
                                                float: 'left'
                                            }
                                            var iconDel = {
                                                verticalAlign: 'middle',
                                                color: 'white',
                                                margin: '5px',
                                                top: '15px',
                                                position: 'relative',
                                                right: '37px',
                                                color:'white'
                                            } 
                                            var iconStar = {
                                                verticalAlign: 'middle',
                                                color: 'white',
                                                margin: '5px',
                                                top: '15px',
                                                position: 'relative',
                                                right: '30px',
                                                color:'white'
                                            }            
                                            var starMe = function(id){
                                               $("#"+starid)[0].innerHTML = <FaStar  id={starid} style={iconStar} />
                                            }                                
                                            return( 
                                                <div>
                                                    <span style={spanLeft}>{writer}
                                                     <FaStarO onClick={() => { starMe(x[0].id) }} style={iconStar} />
                                                    </span>                                                    
                                                    <div style={style}>{str}</div>
                                                </div>
                                            )
                                        } 
                                    }
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
                if (x.length > 0) {            
                    if (x[0].content !== 'newfriend') {
                        if (x[0].content !== 'blank') {
                            if (x[0].content) {
                                var you = $("div.name")[0].innerText.indexOf(',')
                                you = $("div.name")[0].innerText.slice(you+2)
                                var ct = String(x[0].content)
                                var trim = x[0].content.indexOf('>')
                                var str = ct.slice(trim+3)
                                var writer = ct.slice(1,trim)
                                if (writer == you) {
                                    var style = {
                                        marginRight: '75px',
                                        fontSize: '12px',
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '10px',
                                        position: 'relative',
                                        textAlign: 'right',
                                        marginTop: '10px',
                                    }
                                    var spanRight = {
                                        float: 'right'
                                    }
                                    return(
                                        <div>
                                            <span style={spanRight}>{you}</span>
                                            <div style={style}>{str}</div>
                                        </div>
                                    )
                                } else {
                                    var style = {
                                        marginLeft: '75px',
                                        fontSize: '12px',
                                        background: 'rgba(0,0,0,0.2)',
                                        padding: '10px',
                                        position: 'relative',
                                        textAlign: 'left',
                                        marginTop: '10px'
                                    }
                                    var spanLeft = {
                                        float: 'left'
                                    }                                                                                
                                    return( 
                                        <div>
                                            <span style={spanLeft}>{writer}</span>
                                            <div style={style}>{str}</div>
                                        </div>
                                    )
                                } 
                            }
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
// var StarredList = React.createClass({
//     loadMessagesFromServer: function() {
//         var chosen = JSON.parse(localStorage.getItem('user')).id;
//         var status = JSON.parse(localStorage.getItem('user')).status;
//         $.ajax({
//             url: "/user/getstarred",
//             data: {'selected':chosen},
//             type: 'POST',
//             datatype: 'json',
//             cache: false,
//             success: function(data) {
//                 this.setState({data: data.data, status: 'friend'})
//             }.bind(this)
//         })
//     },

//     getInitialState: function() {
//         return {data: []};
//     },

//     componentDidMount: function() {  
//         this.loadMessagesFromServer();
//         setInterval(this.loadMessagesFromServer,
//                     this.props.pollInterval)
//     },
//     render: function() {
//         if (this.state.data) {
//             var a = this.state.status
//             var b = this.state.data
//             var messages = b.map(function(x,i) {
//                 if (x.length > 0) {            
//                     if (x[0].content !== 'newfriend') {
//                         if (x[0].content !== 'blank') {
//                             if (x[0].content) {
//                                 var you = $("div.name")[0].innerText.indexOf(',')
//                                 you = $("div.name")[0].innerText.slice(you+2)
//                                 var ct = String(x[0].content)
//                                 var trim = x[0].content.indexOf('>')
//                                 var str = ct.slice(trim+3)
//                                 var writer = ct.slice(1,trim)
//                                 if (writer == you) {
//                                     var style = {
//                                         marginRight: '75px',
//                                         fontSize: '12px',
//                                         background: 'rgba(0,0,0,0.2)',
//                                         padding: '10px',
//                                         position: 'relative',
//                                         textAlign: 'right',
//                                         marginTop: '10px',
//                                     }
//                                     var spanRight = {
//                                         float: 'right'
//                                     }
//                                     return(
//                                         <div>
//                                             <span style={spanRight}>{you}</span>
//                                             <div style={style}>{str}</div>
//                                         </div>
//                                     )
//                                 } else {
//                                     var style = {
//                                         marginLeft: '75px',
//                                         fontSize: '12px',
//                                         background: 'rgba(0,0,0,0.2)',
//                                         padding: '10px',
//                                         position: 'relative',
//                                         textAlign: 'left',
//                                         marginTop: '10px'
//                                     }
//                                     var spanLeft = {
//                                         float: 'left'
//                                     }                                                                                
//                                     return( 
//                                         <div>
//                                             <span style={spanLeft}>{writer}</span>
//                                             <div style={style}>{str}</div>
//                                         </div>
//                                     )
//                                 } 
//                             }
//                         }
//                     }
//                 }
//             })
//         }
//         return (
//             <div>
//                 {messages}
//             </div>
//         )
//     }
// })
// var DelList = React.createClass({
//     loadMessagesFromServer: function() {
//         var chosen = JSON.parse(localStorage.getItem('user')).id;
//         var status = JSON.parse(localStorage.getItem('user')).status;
//         $.ajax({
//             url: "/user/getdeleted",
//             data: {'selected':chosen},
//             type: 'POST',
//             datatype: 'json',
//             cache: false,
//             success: function(data) {
//                 this.setState({data: data.data, status: 'friend'})
//             }.bind(this)
//         })
//     },

//     getInitialState: function() {
//         return {data: []};
//     },

//     componentDidMount: function() {  
//         this.loadMessagesFromServer();
//         setInterval(this.loadMessagesFromServer,
//                     this.props.pollInterval)
//     },
//     render: function() {
//         if (this.state.data) {
//             var a = this.state.status
//             var b = this.state.data
//             var messages = b.map(function(x,i) {
//                 if (x.length > 0) {            
//                     if (x[0].content !== 'newfriend') {
//                         if (x[0].content !== 'blank') {
//                             if (x[0].content) {
//                                 var you = $("div.name")[0].innerText.indexOf(',')
//                                 you = $("div.name")[0].innerText.slice(you+2)
//                                 var ct = String(x[0].content)
//                                 var trim = x[0].content.indexOf('>')
//                                 var str = ct.slice(trim+3)
//                                 var writer = ct.slice(1,trim)
//                                 if (writer == you) {
//                                     var style = {
//                                         marginRight: '75px',
//                                         fontSize: '12px',
//                                         background: 'rgba(0,0,0,0.2)',
//                                         padding: '10px',
//                                         position: 'relative',
//                                         textAlign: 'right',
//                                         marginTop: '10px',
//                                     }
//                                     var spanRight = {
//                                         float: 'right'
//                                     }
//                                     return(
//                                         <div>
//                                             <span style={spanRight}>{you}</span>
//                                             <div style={style}>{str}</div>
//                                         </div>
//                                     )
//                                 } else {
//                                     var style = {
//                                         marginLeft: '75px',
//                                         fontSize: '12px',
//                                         background: 'rgba(0,0,0,0.2)',
//                                         padding: '10px',
//                                         position: 'relative',
//                                         textAlign: 'left',
//                                         marginTop: '10px'
//                                     }
//                                     var spanLeft = {
//                                         float: 'left'
//                                     }                                                                                
//                                     return( 
//                                         <div>
//                                             <span style={spanLeft}>{writer}</span>
//                                             <div style={style}>{str}</div>
//                                         </div>
//                                     )
//                                 } 
//                             }
//                         }
//                     }
//                 }
//             })
//         }
//         return (
//             <div>
//                 {messages}
//             </div>
//         )
//     }
// })
var ContactList = React.createClass({
    loadBooksFromServer: function(){
        $.ajax({
            url: "/user/getconnections",
            datatype: 'json',
            type: 'POST',
            cache: false,
            success: function(data) {
                this.setState({data: data.data})
                var newData = this.state.data.concat([data])[0];  
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
            var linkStyle = {
                margin: '25px 25px 25px 25px',
                width: '100%',
                position: 'relative',
                textAlign: 'center',
                padding: '10px 0px 10px 0px',
                borderTopRightRadius: '0px',
                borderTopLeftRadius: '0px',
                border:' 0px',
                color: "#FFF" ,               
            }
            var divStyle = {
                minWidth: 'calc(100% - 100px)',
                position: 'relative',
                background: 'rgba(0,0,0,0.2)',
                margin: '20px',
                padding: '8px'
            }
            var icon = {color:'white',
                        float:'right'}
            var a = (this.state.data)
            var texts = a.map(function(x,i){
                return(
                    <div style={divStyle}>
                        <FaTrash onClick={() => { delFriend(x.id) }} style={icon} />
                        <a href="#" onClick={() => { select(x.id, x.status) }} style={linkStyle}>{x.username}</a>
                    </div>
                )
            })
        }
        return (
            <div>
                {texts}
            </div>
        )
    }
})
var delFriend = (function(id) {
    $.ajax({
        url: '/user/delfriend',
        data: {'delid':id},
        datatype: 'JSON',
        type: 'POST'
    }).done(function(res) {
        console.log(res)
    })
})
var select = (function(id, status) {
    $("#selected")[0].value = id
    if (status == 'New Friend Request') {
        var user = {'id': String(id), 'status': 'newfriend'}
        localStorage.setItem('user',JSON.stringify(user))
    } else {
        var user = {'id':String(id), 'status':'friends'}
        localStorage.setItem('user',JSON.stringify(user));
    }                
})
url = String(window.location.href)
if ((url.indexOf("inbox")) > 0 ){
    ReactDOM.render(<MSGList pollInterval={1000} />,
        document.getElementById('mcontainer'))
    ReactDOM.render(<ContactList pollInterval={1000} />,
        document.getElementById('acontainer'))    
} else if ((url.indexOf("sent")) > 0 ) {
    ReactDOM.render(<SentList pollInterval={1000} />, 
        document.getElementById('mcontainer'))
    ReactDOM.render(<ContactList pollInterval={1000} />,
        document.getElementById('acontainer'))       
}
//  else if ((url.indexOf("starred")) > 0 ) {
//     ReactDOM.render(<StarredList pollInterval={1000} />, 
//         document.getElementById('mcontainer'))
//     ReactDOM.render(<ContactList pollInterval={1000} />,
//         document.getElementById('acontainer'))       
// }
//  else if ((url.indexOf("deleted")) > 0 ) {
//     ReactDOM.render(<DelList pollInterval={1000} />, 
//         document.getElementById('mcontainer'))
//     ReactDOM.render(<ContactList pollInterval={1000} />,
//         document.getElementById('acontainer'))       
// } else if ((url.indexOf("chat_portal")) > 0 ) {
//     ReactDOM.render(<SMSList pollInterval={1000} />, 
//         document.getElementById('container'))
// }
