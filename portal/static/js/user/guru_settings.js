var get_guru = function(id) {
  $("#chosenGuru")[0].value = id
  $("#pickPin").empty()
  $.ajax({
    url: '/user/guru_portfolio/'+id,
    type: 'POST',
    data: {'data':'adata'}
  }).done(function(portfolio) {
      portfolio.data.forEach(function(stock,i=1) {
        var rtnstr = ("<tr><td>"+(i+1)+"</td><td>"+stock.symbol+"</td><td>"+stock.company+"</td><td>"+stock.value+"</td><td>"+stock.change+"</td><td>"+stock.exchange+"</td><td>"+stock['13f_date']+"</td><td>"+stock.impact+"</td><td>"+stock.share+"</td><td>"+stock.yield+"</td><td>"+stock.industry+"</td><td>"+stock.sector+"</td><td>"+stock.position+"</td><td>"+stock.pct+"</td><td>"+stock.mktcap+"</td></tr>")
        $("#pickPin").append(rtnstr)
      })
  })
}