import json
from json import JSONEncoder
################################
##### The Class Definition #####
################################

class student_activity_data_aggregation:

    # query_rows are in the following form:

    # activity_row.number 0
    # activity_row.title  1
    # activity_col.number 2
    # activity_col.title  3
    # activity_cell.data  4
    # data_type.label     5

    def __init__(self, query_rows):

        # build the data grid

        # get the row num and col num of last element in query results in order to
        # figure out the total number of rows and columns in the data grid
        num_of_rows = query_rows[-1][0] + 1
        num_of_cols = query_rows[-1][2] + 1

        data_grid = []
        for y in range(num_of_rows):
            data_grid.append([])
            for x in range(num_of_cols):
                data_grid[y].append(None)


        current_data_row = 0
        current_data_col = 0
        row_titles    = []
        column_titles = []

        # this should work because the query results are ordered by the row number then column number
        for query_row in query_rows:
            # grab the first row title
            if current_data_row == 0 and current_data_col == 0:
                row_titles.append(query_row[1])

            if query_row[0] != current_data_row:
                current_data_row += 1
                current_data_col  = 0

                # grab the rest of the rows titles while im here
                row_titles.append(query_row[1])

            # grab the column titles from the first row
            if current_data_row == 0:
                column_titles.append(query_row[3])

            data_grid[current_data_row][current_data_col] = {"data":query_row[4], "data_type":query_row[5]}
            current_data_col += 1


        self.row_titles    = row_titles
        self.column_titles = column_titles
	self.data_grid 	   = data_grid


    # getters

    def get_num_of_rows(self):
        return len(self.row_titles)

    def get_row_title(self, row_index):
        return self.row_titles[row_index]

    def get_num_of_columns(self):
        return len(self.column_titles)

    def get_column_title(self, col_index):
        return self.column_titles[col_index]

    def get_cell_data(self, col_index, row_index):
        return self.data_grid[col_index][row_index]

    # misc

    def toJSON(self):
	return json.dumps(self.__dict__);

