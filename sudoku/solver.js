function Sudoku(board_string){
      this.board_string = board_string;
      this.solved = false;
      this.boxes=[];
      this.boxes[0]=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
      this.boxes[1]=[[0,3],[0,4],[0,5],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5]];
      this.boxes[2]=[[0,6],[0,7],[0,8],[1,6],[1,7],[1,8],[2,6],[2,7],[2,8]];
      this.boxes[3]=[[3,0],[3,1],[3,2],[4,0],[4,1],[4,2],[5,0],[5,1],[5,2]];
      this.boxes[4]=[[3,3],[3,4],[3,5],[4,3],[4,4],[4,5],[5,3],[5,4],[5,5]];
      this.boxes[5]=[[3,6],[3,7],[3,8],[4,6],[4,7],[4,8],[5,6],[5,7],[5,8]];
      this.boxes[6]=[[6,0],[6,1],[6,2],[7,0],[7,1],[7,2],[8,0],[8,1],[8,2]];
      this.boxes[7]=[[6,3],[6,4],[6,5],[7,3],[7,4],[7,5],[8,3],[8,4],[8,5]];
      this.boxes[8]=[[6,6],[6,7],[6,8],[7,6],[7,7],[7,8],[8,6],[8,7],[8,8]];

      this.transform_puzzle_string_into_2d_array = function (board_string){
        var array_of_9_arrays = [];
        for(var i = 0; i < 9; i++){
          var row = [];
          for(var j = 0; j < 9; j++){
            element = board_string[0];
            element = parseInt(element);
            if (element == 0){
              element = null;
            }
            row.push(element);
            board_string=board_string.substring(1);
          }
          array_of_9_arrays.push(row);
        }

        return array_of_9_arrays;
      };

      this.puzzle = this.transform_puzzle_string_into_2d_array(board_string);

      this.get_values_in_current_column= function (current_coordinate){
        var array_with_values_in_column=[];
        for(var i = 0; i < 9; i++){
          array_with_values_in_column.push(this.puzzle[i][current_coordinate[1]])
        }
        return array_with_values_in_column;
      };

      this.get_values_in_current_box = function (current_coordinate) {
        var box_values=[];
        for(var i = 0; i < 9; i++){
          // console.log(this.boxes[i])
          for(var j = 0; j < 9; j++){
              if ((this.boxes[i][j][0] == current_coordinate[0]) && (this.boxes[i][j][1] == current_coordinate[1])){
                // console.log("inside if");
                // console.log(this.boxes[i][j][0]);
                // console.log(this.boxes[i][j][1]);
                for(var k = 0; k < 9; k++){
                box_values.push(this.puzzle[this.boxes[i][k][0]][this.boxes[i][k][1]]);
              }
            }
          }
        }
        return box_values;
      };

      this.get_remaining_possibilities_array = function (current_coordinate){
        var remaining = [];
        row = this.puzzle[current_coordinate[0]];
        column = this.get_values_in_current_column(current_coordinate);
        box = this.get_values_in_current_box(current_coordinate);
        var existing_values = row.concat(column).concat(box);
        for(var i = 0; i < existing_values.length; i++){
          if (existing_values[i]==null){ existing_values.splice(i, 1); }
        };
        var existing_values = existing_values.filter(function(elem, pos) {
          return existing_values.indexOf(elem) == pos;
        });
        for(var i = 1; i <= 9; i++){
          if (existing_values.indexOf(i) <= -1){
            remaining.push(i);
          }
        }
        return remaining;
      };

      this.solve = function (){
        var row_counter = 0;
        while (row_counter < 9){
          var column_counter = 0;
          while (column_counter < 9){
            if ((this.puzzle[row_counter][column_counter]) == null) {
              var remaining_possibilities = this.get_remaining_possibilities_array([row_counter, column_counter]);
              if (remaining_possibilities.length == 0){
                return
              };
              for(var i = 0; i < remaining_possibilities.length; i++){
                this.puzzle[row_counter][column_counter] = remaining_possibilities[i];
                this.solve();
                if (this.solved == false){
                  this.puzzle[row_counter][column_counter] = null;
                };
                if (this.solved == true){
                  return
                };
              };
              if (this.puzzle[row_counter][column_counter] == null){
                  return
                };
            };
            column_counter++;
          };
          row_counter++;
        };

        return (this.solved = true)
      };

      this.change_2d_puzzle_into_string = function(){
        solved_str = ""
        var row_counter = 0;
        while (row_counter < 9){
          var column_counter = 0;
          while (column_counter < 9){
            solved_str += this.puzzle[row_counter][column_counter];
            column_counter++;
          };
          row_counter++;
        };
        return solved_str;
      };

      this.passes_presolve_check = function(){
        var row_counter = 0;
        while (row_counter < 9){
          var column_counter = 0;
          while (column_counter < 9){
            if (this.puzzle[row_counter][column_counter] == null){
              row = this.puzzle[row_counter];
              column = this.get_values_in_current_column([row_counter, column_counter]);
              box = this.get_values_in_current_box([row_counter, column_counter]);
              column = column.sort();
              box = box.sort();
              for(var i = 0; i < row.length-1; i++){
                current_value = row[i];
                for(var j = i+1; j < row.length; j++){
                  next_value = row[j];
                  if ((current_value == next_value) && (current_value != null)){
                  return false;
                  };
                };
              };
              for(var i = 0; i < column.length-1; i++){
                current_value = column[i];
                next_value = column[i + 1];
                if ((current_value == next_value) && (current_value != null)){
                  return false;
                };
              };
              for(var i = 0; i < box.length-1; i++){
                current_value = box[i];
                next_value = box[i + 1];
                if ((current_value == next_value) && (current_value != null)){
                  return false;
                };
              };
            };
            column_counter++;
          };
          row_counter++;
        };
        return true;
      };


      this.passes_postsolve_check = function(){
        var row_counter = 0;
        while (row_counter < 9){
          var column_counter = 0;
          while (column_counter < 9){
            if (this.puzzle[row_counter][column_counter] == null){
              return false;
            }
            column_counter++;
          };
          row_counter++;
        };
        return true;
      };

    };

// var sudoku = new Sudoku("000700000123000000456000000000000000000000000000000000000000000000000000000000000")
// var sudoku = new Sudoku("000400000000000000000000000000400000000000000000000000000000000000000000000000000")
// console.log(sudoku.puzzle);
// console.log(sudoku.passes_presolve_check());
// sudoku.solve();
// console.log(sudoku.puzzle);
// console.log(sudoku.passes_presolve_check());
