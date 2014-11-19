$( document ).ready(function(){

    var insert_table = function(str1, str2, form){
      var tbody = "";
      var counter = 1
      for(var i = 0; i < 9; i++){
        tbody += "<tr id=tr" + i + ">";
        for(var j = 0; j < 9; j++){
            tbody += "<td id=td" + counter + ">";
            if (form == true){
              tbody += str1 + counter + str2;
            } else {
              tbody += str1;
            }

            tbody += "</td>";
            counter++;
        }
        tbody += "</tr>";
      }
      document.getElementById('table_container').innerHTML = "<table border='3'>" +tbody+ "</table>";
    };


    var get_user_input = function(){
      var user_input = ""
      for(var i = 1; i <= 81; i++){
        var current_value = $('#input'+i).val();
        if (current_value == ""){ current_value = "0" };
        user_input += current_value;
        }
        return user_input;
    };

    var alert_impossible_board = function(){
      $('#impossible_board_alert').append("<div class='alert alert-danger' role='alert'>Unsolvable! Please enter a valid board.</div>");
    };

    var insert_original_table = function(str1, str2, form){
      var tbody = "";
      var counter = 1
      for(var i = 0; i < 9; i++){
        tbody += "<tr id=tr" + i + ">";
        for(var j = 0; j < 9; j++){
            tbody += "<td id=tdo" + counter + ">";
            if (form == true){
              tbody += str1 + counter + str2;
            } else {
              tbody += str1;
            }

            tbody += "</td>";
            counter++;
        }
        tbody += "</tr>";
      }
      document.getElementById('original-board').innerHTML = "<table border='3'>" +tbody+ "</table>";
    };

    var insert_solved_table = function(str1, str2, form){
      var tbody = "";
      var counter = 1
      for(var i = 0; i < 9; i++){
        tbody += "<tr id=tr" + i + ">";
        for(var j = 0; j < 9; j++){
            tbody += "<td id=tds" + counter + ">";
            if (form == true){
              tbody += str1 + counter + str2;
            } else {
              tbody += str1;
            }

            tbody += "</td>";
            counter++;
        }
        tbody += "</tr>";
      }
      document.getElementById('solved-board').innerHTML = "<table border='3'>" +tbody+ "</table>";
    };

    var populate_original_table = function(str){
      for(var i = 1; i <= 81; i++){
        if (str[0] == 0){
          $('#tdo'+i).append("");
        }else{
          $('#tdo'+i).append(str[0]);
        };

        str=str.substring(1);
        };
    };

    var populate_solved_table = function(str){
      for(var i = 1; i <= 81; i++){
        $('#tds'+i).append(str[0]);
        str=str.substring(1);
        }
    };

    insert_table("<input type='text' maxlength='1' id=input", ">", true);
    $('#table_container').prepend("<form class='sudoku_form'>");
    $('#table_container').append("</form>");

  $('#solve_button').click(function(event){
    event.preventDefault();
    var user_input = get_user_input();
    var board = new Sudoku(user_input);
    insert_table("<input type='text' maxlength='1' id=input", ">", true);

    insert_solved_table("", "", false);
    $('#solved-board').prepend("<h3>Solved Board</h3>");


    if (board.passes_presolve_check() == true){
      board.solve();
      if (board.passes_postsolve_check() == true){
        populate_solved_table(board.change_2d_puzzle_into_string());
      } else {
        alert_impossible_board();
      };
    } else {
      alert_impossible_board();
    };

    insert_original_table("", "", false);
    populate_original_table(user_input);
    $('#original-board').prepend("<h3>Original Board</h3>");
    $('.footer').css({'position': 'relative'});


  });
});
