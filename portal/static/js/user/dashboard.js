
  $(".scroll-jail").mCustomScrollbar();
   

  $(".scroll-sail").height('25vh').mCustomScrollbar();

// $("#statusbar_2").show()
var sectorpadding = String($("#sectorContent").width() / 18).slice(0,2) + "px"
console.log(sectorpadding)
$("#pieChart").css("left",sectorpadding)


$.ajax({
    url:"/user/dashboard/marketnews/",
    method: "POST"
}).done(function(data){
    data.news.forEach(function(x) {
        $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
    })
}).fail(function() {
    $.ajax({
    url:"marketnews/",
    method: "POST"
    }).done(function(data){
        data.news.forEach(function(x) {
            $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
        })
    })
})

$.ajax({
    url:"/user/dashboard/your_sentiment/",
    method: "POST"
}).done(function(data){
    data.sentiment.forEach(function(x) {
        sentiment_value = String(x.sentiment * 100).slice(0,String(x.sentiment*100).indexOf("."))
        if (sentiment_value < 40) {
            $("#sentiment_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content'></div><div class='item-line'><div class='item-line-content' style='width:100%;text-align:center;font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:2px'>"+x.ticker+"<span style='color:rgba(255,0,0,1)'>↓"+sentiment_value+"</span></div></div></div>")            
        } else {
                $("#sentiment_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content'></div><div class='item-line'><div class='item-line-content' style='width:100%;text-align:center;font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:2px'>"+x.ticker+"<span style='color:rgba(0,255,0,1)'>↑"+sentiment_value+"</span></div></div></div>")            

        }
    }) 
}).fail(function(data) {
    $.ajax({
    url:"your_sentiment/",
    method: "POST"
    }).done(function(data){
    data.sentiment.forEach(function(x) {
        sentiment_value =  String(x.sentiment * 100).slice(0,String(x.sentiment*100).indexOf("."))
        if (sentiment_value < 40) {
            $("#sentiment_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content'></div><div class='item-line'><div class='item-line-content' style='width:100%;text-align:center;font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:2px'>"+x.stock+"<span style='color:rgba(255,0,0,1)'>"+sentiment_value+"</span></div></div></div>")            
        } else {
                $("#sentiment_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content'></div><div class='item-line'><div class='item-line-content' style='width:100%;text-align:center;font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:2px'>"+x.stock+"<span style='color:rgba(0,255,0,1)'>"+sentiment_value+"</span></div></div></div>")            

        }
    }) 
})
})

$.ajax({
    url:"/user/dashboard/top_picks/",
    method: "POST"
}).done(function(data){
    // console.log(data)
    data.picks.forEach(function(x) {
        $("#pick_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content' ><div class='item-line-title'>Expected Yield :"+x.yield+"<div class='item-line-date pull-right'>Buy on "+x['13f_date']+"</div></div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.symbol+":"+x.exchange+" - "+x.price+"$</div></div></div>")
    })
}).fail(function(data) {
    $.ajax({
        url:"top_picks/",
        method: "POST"
    }).done(function(data){
        // console.log(data)
        data.picks.forEach(function(x) {
            $("#pick_pin").append("<div class='email-list-item' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:'Helvetica Neue';'><div class='item-line-content' ><div class='item-line-title'>Expected Yield :"+x.yield+"<div class='item-line-date pull-right'>Buy on "+x['13f_date']+"</div></div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.symbol+":"+x.exchange+" - $"+x.price+"</div></div></div>")
        })
    })
})
$.ajax({
    url:"/user/dashboard/portfolio_value/",
    method: "POST"
}).done(function(data){
    // console.log(data)
    $("#totalPortfolioValue")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:24px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:7%'>$"+data.data.total+"</div>"
}).fail(function(data) {
    $.ajax({
    url:"portfolio_value/",
    method: "POST"
    }).done(function(data){
        // console.log(data)
        $("#totalPortfolioValue")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:24px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:7%'>$"+data.data.total+"</div>"
    })
})
$.ajax({
    url:"/user/dashboard/get_gain/",
    method: "POST"
}).done(function(data){
    // console.log(data)
    var change = String(data.data).slice(0,3)
    if (Number(change) > 0) {
        $("#changeVal")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:48px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:5%;color:rgba(0,255,0,1)'> <span style='font-size:54px;'>&uarr;</span>&nbsp;"+change+"%</div>"
    } else {
        $("#changeVal")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:48px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:5%;color:rgba(255,0,0,1)'> <span style='font-size:54px;'>&uarr;</span>&nbsp;"+change+"%</div>"
    }
    $("#uc_1")[0].innerText = String(data.ports[0]).slice(0,4)+"%"
    $("#uc_2")[0].innerText = String(data.ports[1]).slice(0,4)+"%"
    $("#uc_3")[0].innerText = String(data.ports[2]).slice(0,4)+"%"
    $("#dc_1")[0].innerText = String(data.ports[data.ports.length-1]).slice(0,4)+"%"
    $("#dc_2")[0].innerText = String(data.ports[data.ports.length-2]).slice(0,4)+"%"
    $("#dc_3")[0].innerText = String(data.ports[data.ports.length-3]).slice(0,4)+"%"
    // data.news.forEach(function(x) {
    //     $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
    // })
})

function graphit(r_data) {
        var pdata = [
        r_data.you[0],  
        (r_data.sp.data[0][1]/r_data.sp.data[21][1]),
        (r_data.dj.dataset.data[0][1]/r_data.dj.dataset.data[21][1]),
        (r_data.ndx.data[0][1]/r_data.ndx.data[21][1]),
    ];

    var gdata = [
        ,r_data.you[1],
        , (r_data.sp.data[21][1]/r_data.sp.data[42][1]),
        , (r_data.ndx.data[21][1]/r_data.ndx.data[42][1]),
        , (r_data.dj.dataset.data[21][1]/r_data.dj.dataset.data[42][1]),
    ];

    var ydata = [
        ,r_data.you[2],
        , (r_data.sp.data[42][1]/r_data.sp.data[63][1]),
        , (r_data.dj.dataset.data[42][1]/r_data.dj.dataset.data[63][1]),
        , (r_data.ndx.data[42][1]/r_data.ndx.data[63][1]),
    ]
    pdata.sort(function(a, b){return a-b});
    //data.sort(d3.descending());
    var pwidth = "75%",
        pheight = 25,
        goal = 100,
        perc_so_far = 0;

    var total_time = d3.sum(pdata);
    var bar_x = 0;
    var chart = d3.select("#p-chart")
        .attr("width", "75%")
        .attr("height", pheight)
        bar_x = 0;
        //var chart_width = chart.style("width").replace("px", "");
    var chart_width = parseInt(d3.select("#p-chart").style("width"));
    console.log(chart_width);

    var color = d3.scale.category20b();
        //d3.scale.ordinal()
        //.domain(["6TH", "7TH", "5TH", "4TH"])
        //.range(colorbrewer.RdBu[12]);
    var bar = chart.selectAll("g")
        .data(pdata)
        .enter().append("g");
        console.log(bar);
    bar.append("rect")
        .attr("width", function(d) { return ((d/total_time)*100) + "%"; } )
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
            return prev_perc + "%";
        })
        .attr("height", pheight)
        .attr("fill",  function(d) { return (color(d)) } );

    perc_so_far = 0;
    count = 0
    bar.append("text")
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
            return prev_perc + "%";
        })
        //.attr("y", 11)
        .attr("dy", "1.35em")
        .text(function(d) { 
            if (count == 0) {
                if (d > 0) {
                    return "+" + String(d).slice(0,5) + " % "; 
                } else {
                    return String(d).slice(0,5) + " % "; 
                }
            }
        })
        .style("fill", "white")
        .style("left", "5px")
        .style("font-family", "Helvetica Neue")
        .style("font-size", "14px")
        .style("font-weight", "200")
            
        // console.log(data.ndx.data[0][1]/data.ndx.data[21][1]  )
        // console.log(data.ndx.data[21][1]/data.ndx.data[42][1] )
        // console.log(data.ndx.data[42][1]/data.ndx.data[63][1] )

        

    gdata.sort(function(a, b){return a-b});
    var pwidth = "75%",
        pheight = 25,
        goal = 100,
        perc_so_far = 0;

    var total_time = d3.sum(gdata);
    var bar_x = 0;
    var chart = d3.select("#d-chart")
        .attr("width", "75%")
        .attr("height", pheight)
        bar_x = 0;
        //var chart_width = chart.style("width").replace("px", "");
    var chart_width = parseInt(d3.select("#d-chart").style("width"));
    var color = d3.scale.category20b();
        //d3.scale.ordinal()
        //.domain(["6TH", "7TH", "5TH", "4TH"])
        //.range(colorbrewer.RdBu[12]);
    var bar = chart.selectAll("g")
        .data(gdata)
        .enter().append("g");
    bar[0].pop()
    bar[0].pop()
    bar[0].pop()
    bar[0].pop()
    bar.append("rect")
        .attr("width", function(d) { return ((d/total_time)*100) + "%"; } )
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
            return prev_perc + "%";
        })
        .attr("height", pheight)
        .attr("fill",  function(d) { return (color(d)) } );

    perc_so_far = 0;
    count = 0
    bar.append("text")
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            return prev_perc + "%";
        })
        //.attr("y", 11)
        .attr("dy", "1.35em")
        .text(function(d) { 
            return "+" + String(d).slice(0,5) + " % "; 
        })
        .style("fill", "white")
        .style("left", "5px")
        .style("font-family", "Helvetica Neue")
        .style("font-size", "14px")
        .style("font-weight", "200")


        

    ydata.sort(function(a, b){return a-b});
    var pwidth = "75%",
        pheight = 25,
        goal = 100,
        perc_so_far = 0;

    var total_time = d3.sum(ydata);
    var bar_x = 0;
    var chart = d3.select("#dd-chart")
        .attr("width", "75%")
        .attr("height", pheight)
        bar_x = 0;
        //var chart_width = chart.style("width").replace("px", "");
    var chart_width = parseInt(d3.select("#dd-chart").style("width"));
    var color = d3.scale.category20b();
        //d3.scale.ordinal()
        //.domain(["6TH", "7TH", "5TH", "4TH"])
        //.range(colorbrewer.RdBu[12]);
    var bar = chart.selectAll("g")
        .data(ydata)
        .enter().append("g");
        console.log(bar);
    bar[0].pop()
    bar[0].pop()
    bar[0].pop()
    bar[0].pop()
    bar.append("rect")
        .attr("width", function(d) { return ((d/total_time)*100) + "%"; } )
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
            return prev_perc + "%";
        })
        .attr("height", pheight)
        .attr("fill",  function(d) { return (color(d)) } );

    perc_so_far = 0;
    count = 0
    bar.append("text")
        .attr("x", function(d) {
            var prev_perc = perc_so_far;
            var this_perc = 100*(d/total_time);
            perc_so_far = perc_so_far + this_perc;
            console.log("perc_so_far:" + perc_so_far + "; this_perc:" + this_perc + "; prev_perc:" + prev_perc + ";");
            return prev_perc + "%";
        })
        //.attr("y", 11)
        .attr("dy", "1.35em")
        .text(function(d) { 
            if (count == 0) {
                if (d > 0) {
                    return "+" + String(d).slice(0,5) + " % "; 
                } else {
                    return String(d).slice(0,5) + " % "; 
                }
            }
        })
        .style("fill", "white")
        .style("left", "5px")
        .style("font-family", "Helvetica Neue")
        .style("font-size", "14px")
        .style("font-weight", "200")
}
$.ajax({
    url:"performance_chart/",
    method: "POST"
}).done(function(r_data){

if (r_data.you[0]) {
    console.log(r_data)
    graphit(r_data)
    } else {
        $.ajax({
            url:"performance_chart/",
            method: "POST"
        }).done(function(r_data) {
            console.log(r_data)
            if (r_data.you[0]) {
                graphit(r_data)

            } else {
                $.ajax({
                    url:"user/dashboard/performance_chart/",
                    method: "POST"
                }).done(function(r_data) {
                    console.log(r_data)
                    graphit(r_data)

                })
            }
        }).fail(function(err) {
            $.ajax({
                url:"dashboard/performance_chart/",
                method: "POST"
            }).done(function(r_data) {
                    console.log(r_data)
                    graphit(r_data)

            })

        })
    }
}).fail(function(err) {
            $.ajax({
                url:"user/dashboard/performance_chart/",
                method: "POST"
            }).done(function(r_data) {
                    graphit(r_data)

            })
})

// .fail(function() {
//     $.ajax({
//     url:"get_gain/",
//     method: "POST"
//     }).done(function(data){
//         data.news.forEach(function(x) {
//             $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
//         })
//     })
// })
// $.ajax({
//     url:"/user/dashboard/your_sentiment/",
//     method: "POST"
// }).done(function(data){
//     console.log(data)
    // $("#totalPortfolioValue")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:36px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:7%'>$"+data.data.total+"</div>"
// })
// $.ajax({
//     url:"performance_chart/",
//     method: "POST"
// }).done(function(data){
//     // var change = String(data.data).slice(0,3)
//     // if (Number(change) > 0) {
//     //     $("#changeVal")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:48px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:5%;color:rgba(0,255,0,1)'> <span style='font-size:54px;'>&uarr;</span>&nbsp;"+change+"%</div>"
//     // } else {
//     //     $("#changeVal")[0].innerHTML = "<div style='text-align:center;width:100%;font-size:48px;font-weight:100;-webkit-font-smoothing: antialiased;font-family:Helvetica Neue;margin-top:5%;color:rgba(255,0,0,1)'> <span style='font-size:54px;'>&uarr;</span>&nbsp;"+change+"%</div>"
//     // }
//     console.log(data.dj.data[0][1]/data.dj.data[21][1] )
//     console.log(data.dj.data[21][1]/data.dj.data[42][1] )
//     console.log(data.dj.data[42][1]/data.dj.data[63][1] )

//     console.log(data.ndx.data[0][1]/data.ndx.data[21][1]  )
//     console.log(data.ndx.data[21][1]/data.ndx.data[42][1] )
//     console.log(data.ndx.data[42][1]/data.ndx.data[63][1] )
//     // data.news.forEach(function(x) {
//     //     $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
//     // })
// }).fail(function() {
//     $.ajax({
//     url:"dashboard/performance_chart/",
//     method: "POST"
//     }).done(function(data){
//         data.news.forEach(function(x) {
//             $("#pin").append("<a href="+x.link+" target='_blank'><div class='email-list-item' ><div class='item-line'><div class='item line-title' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:14px;letter-spacing:3px'>"+x.title+"</div></div><div class='item-line'><div class='item-line-content' style='font-weight:300;-webkit-font-smoothing: antialiased;font-family:helvetica neue;font-size:12px;letter-spacing:2px'>"+x.description+"<br></div><div class='item-line-date'>"+x.pubDate+"</div></div></div></a>")
//         })
//     })
// })
$("#statusbar_2").hide()

    





// ** Update data section (Called from the onclick)
function changeTime(s) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    month = String(month)
    if (month.length == 1) {month = "0"+ month}
    var endDate = year + "-" + month + "-" + day;
    console.log(month)
    document.getElementById('end').value = endDate;
    if (s === '1y') {
        year -=1
    } else if (s == '90d') {
        month -=3
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    } else if (s == '30d') {
        month -=1
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    }
    var startDate = year + "-" + month + "-" + day;
    console.log(startDate)
    document.getElementById('start').value = startDate;
    var market = document.getElementById('chosenMarket').innerText
    console.log(market)
    if (market == 'Nasdaq Composite') {updateData('^IXIC')}
    if (market == 'Dow Jones Industrial Average') {updateData('^DJI')}
    if (market == 'S&P 500') {updateData('^GSPC')}
}

function changeTime(s) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    month = String(month)
    if (month.length == 1) {month = "0"+ month}
    var endDate = year + "-" + month + "-" + day;
    console.log(month)
    document.getElementById('end').value = endDate;
    if (s === '1y') {
        year -=1
    } else if (s == '90d') {
        month -=3
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    } else if (s == '30d') {
        month -=1
        month = String(month)
        if (month.length == 1) {month = "0"+ month}
    }
    var startDate = year + "-" + month + "-" + day;
    console.log(startDate)
    document.getElementById('start').value = startDate;
    var market = document.getElementById('chosenMarket').innerText
    console.log(market)
    if (market == 'Nasdaq Composite') {updateData('^IXIC')}
    if (market == 'Dow Jones Industrial Average') {updateData('^DJI')}
    if (market == 'S&P 500') {updateData('^GSPC')}
}
function updateData(stock) {
if (stock == '^IXIC') {document.getElementById('chosenMarket').innerText = "Nasdaq Composite"}
if (stock == '^DJI') {document.getElementById('chosenMarket').innerText = "Dow Jones Industrial Average"}
if (stock == '^GSPC') {document.getElementById('chosenMarket').innerText = "S&P 500"}
var stock = stock;
var start = document.getElementById('start').value;
var end = document.getElementById('end').value;
console.log(start)
console.log(end)
console.log(stock)

var inputURL = "http://query.yahooapis.com/v1/public/yql"+
    "?q=select%20*%20from%20yahoo.finance.historicaldata%20"+
    "where%20symbol%20%3D%20%22"
    +stock+"%22%20and%20startDate%20%3D%20%22"
    +start+"%22%20and%20endDate%20%3D%20%22"
    +end+"%22&format=json&env=store%3A%2F%2F"
    +"datatables.org%2Falltableswithkeys";

    // Get the data again
    d3.json(inputURL, function(error, data){
        console.log(data.query)
        data.query.results.quote.forEach(function(d) {
            d.date = parseDate(d.Date);
            d.high = +d.High;
            d.low = +d.Low;
        });

        // Scale the range of the data
        x.domain(d3.extent(data.query.results.quote, function(d) {
            return d.date; }));
        y.domain([
            d3.min(data.query.results.quote, function(d) { 
                return d.low; }), 
            d3.max(data.query.results.quote, function(d) { 
                return d.high; })
        ]);

        // Select the section we want to apply our changes to
        var svg = d3.select("body").transition();

        // Make the changes
        svg.select(".line")    // change the line
            .duration(750) 
            .attr("d", valueline(data.query.results.quote))
            .style("margin-left","50px");

        svg.select(".label")   // change the label text
            .duration(750)
            .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")");
 
        svg.select(".shadow") // change the title shadow
            .duration(750)
            .text(stock);  
             
        svg.select(".stock")   // change the title
            .duration(750)
            .text(stock);
     
        svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

    });
}


