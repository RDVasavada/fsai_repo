$("body").css('display','none');
   
   var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
                if (xhr.readyState==4 && xhr.status==200)
                {
                    var data = JSON.parse(xhr.responseText).items;
                    var urgent_news = [];
                    var important_news = [];
                    var earnings_corner = [];
                    var stockNames = ["AMOV","AMX","CX","KOF","ICA","FMX","OMAB","PAC","ASR","BSMX","SIM","TV","IBC","ASD","TFSC","TFSCW","PIH","XXII","FCvCY","SRCE","TWOU","CFAD","EGHT","AVHI"];
                    var portfolioTypes = ["High Risk Portfolio","Tech Portfolio","Safe Portfolio"];
                    function fillInData(urgent, important, earnings) {
                        urgent.forEach(function(x){
                            var newClone = $("#urgent-incoming").clone().removeAttr('id');
                            console.log(newClone[0])
                            var newItem = "<td class='col-md-2'>"+x.date+"</td><td  class='col-md-2'>"+x.name+"</td><td class='col-md-2'>"+x.type+"</td><td class='col-md-2'>"+x.sentiment+"</td><td  class='col-md-2'><a href='"+x.link+"' target='_blank'>"+x.title+"</a></td>";
                            newClone[0].innerHTML = newItem ; 
                            newClone.appendTo($("#urgent-pin"))

                        });
                        important.forEach(function(x){
                            var newClone = $("#important-incoming").clone().removeAttr('id');
                            var newItem = "<td class='col-md-2'>"+x.date+"</td><td  class='col-md-2'>"+x.name+"</td><td class='col-md-2'>"+x.type+"</td><td class='col-md-2'>"+x.sentiment+"</td><td  class='col-md-2'><a href='"+x.link+"' target='_blank'>"+x.title+"</a></td>";
                            newClone[0].innerHTML = newItem ; 
                            newClone.appendTo($("#important-pin"))

                        });
                        earnings.forEach(function(x){
                            var newClone = $("#earnings-incoming").clone().removeAttr('id');
                            var newItem = "<td class='col-md-2'>"+x.date+"</td><td  class='col-md-2'>"+x.name+"</td><td class='col-md-2'>"+x.type+"</td><td class='col-md-2'>"+x.sentiment+"</td><td  class='col-md-2'><a href='"+x.link+"' target='_blank'>"+x.title+"</a></td>";
                            newClone[0].innerHTML = newItem; 
                            newClone.appendTo($("#earnings-pin"))

                        })                                                  
                    }
                    data.forEach(function(desc,i){
                            var sentiment = Math.floor((Math.random() * 100) + 0);
                            var newItem = {
                                title: desc.title,
                                date: desc.pubDate,
                                link: desc.link,
                                type: portfolioTypes[(Math.floor((Math.random() * 3) + 0))],
                                name: stockNames[(Math.floor((Math.random() * 3) + 0))],
                                sentiment: String(sentiment) + "%"
                            };
                            console.log(newItem)
                            var priority = Math.floor((Math.random() * 3) + 0);
                            if (priority == 0) {
                                urgent_news.push(newItem);
                            } else if (priority == 1) {
                                important_news.push(newItem)
                            } else if (priority == 2) {
                                earnings_corner.push(newItem)
                            };
                            if (i === data.length-1) {
                                console.log(urgent_news)
                                console.log(important_news)
                                console.log(earnings_corner)
                                fillInData(urgent_news, important_news, earnings_corner)
                            };
                    })
                }
            };
        xhr.open('GET','http://rss2json.com/api.json?rss_url=http://finance.yahoo.com/rss/headline?s=yhoo,msft,tivo',true);
        xhr.send();   