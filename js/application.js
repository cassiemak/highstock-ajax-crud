$(document).ready(function(){

var data = [];
var postId;
// array of hashes
var annotationData = [];

// generate chart from quandi & get info and plotchart
  function getChart (){
    $.ajax({
      type: 'GET',
      url: "https://www.quandl.com/api/v1/datasets/WORLDBANK/CHN_SP_DYN_TFRT_IN.json?trim_start=1960-12-31&trim_end=2012-12-31&auth_token=5azx4CR9hEC4csUtqsPY",
      dataType: 'JSON',

      success: function(response){
        console.log('Success!');
        // console.log(response.data);

        $(response.data).each(function(){
          var china = {};
          china.x = convertDate(this[0]),
          china.y = this[1],
          data.push(china);
        });
        // console.log(data);
        plotHighStock();
        retrieveData();
      },

      error: function(){
        console.log("Error!");
      }
    })
  }
// Initialize function 
  getChart();

// trigger when click
  $(".submit").click(function(){
    postData();
  });

// click to delete respective line 
  $("body").on('click', '.delete', function(){
    // console.log('clicked');
    var targetId = $(this).data('lol'); 
    deleteData(targetId);
    // $(this).data('lol');
    // debugger
  });

// GET annotation information from server
  function retrieveData(){
    $.ajax({
      type: 'GET',
      url: 'http://ga-wdi-api.meteor.com/api/posts/search/Cass',
      dataType: 'JSON',
      success: function(response){
        console.log("successful retrieveData")
        // console.log(response);
        var html = '';

        // looping for your own annotation only
        $(response).each(function(){

          var temp = {};
          temp.x = this.x;
          temp.title = this.title;
          annotationData.push(temp);

          html += '<tr>';
          html += '<td>';
          html += this._id;
          html += '</td>';
          html += '<td>';
          html += this.title;
          html += '</td>';
          html += '<td><button type="button" data-lol=' + this._id + ' class="delete btn btn-danger btn-sm">Delete</button></td>';
          html += '</tr>';
        });

        // console.log(annotationData);

        display(html);
      },
      error: function(){
        console.log("Error!");
      }
    })
  }

  // Construct a table to display 
  function display (html){
    $('#change').html(html);
  }


// POST to server
  function postData(){
    $.ajax({
      type: 'POST',
      url: "http://ga-wdi-api.meteor.com/api/posts/",
      dataType: 'JSON',
      data: {
        // note to self, key just use "" and jquery object must use jquery language
        'user': $('.name').val(),
        'title': $('.title').val(),
        'text': $('.comment').val(),
        'x': new Date($('input[name=x]').val()).getTime()
      },
      success: function(response){
        console.log('successful input!');
        // console.log(response);
        $('.display').text(response);
        // annotationData.push("some stuff");
        retrieveData();
        getChart();
      },
      error: function(){
        console.log("cannot post!")
      }
    })
  }

// EDIT
  function editData(target){
    $.ajax({
      type: 'PUT',
      url: 'http://ga-wdi-api.meteor.com/api/posts/'+target,
      data:{
      //JSON
      },
      dataType: 'JSON',
      success: function(response){
        // console.log(response);
      }
    })
  }

// DELETE
  function deleteData(target){
    $.ajax({
      type: 'DELETE',
      url: "http://ga-wdi-api.meteor.com/api/posts/"+target,
      success: function(response){
        // console.log(response);
        retrieveData();
        console.log('Deleted!');
      },
      error: function(){
        console.log('delete unsuccessful');
      }
    })
  }

  // Convert to unix time (new date convert to date; getTime convert to unix time)
  var convertDate =  function(oldDate){
    var date = new Date(oldDate).getTime();
    // date = date.getTime();
    return date;
  }

  var plotHighStock = function(){
    $('#chart').highcharts('StockChart',{
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Fertility Rate in China'
      },
      xAxis:{
        // x = time
        type: 'datetime'
      },
      yAxis:{
        // y = num of people that has internet access
        min: 0,
        max: 3,
        title: {
          text: 'Birth per woman'
        }
      },
      legend:{
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series:[{
        name: 'China',
        data: data,
      },{
      type: 'flags',
      name: 'test',
      // data: $('form.annotationForm').serializeObject(),
      OnSeries: 'dataseries',
      data: annotationData,
      shape: 'squarepin',
      }], 
    })
  }

//Closing ready 
})