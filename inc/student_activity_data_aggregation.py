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
        num_of_rows = query_rows[-1][0]
        num_of_cols = query_rows[-1][2]

        data_grid = []
        for y in range(num_of_rows):
            data_grid.append([])
            for x in range(num_of_cols):
                data_grid[y].append(None)

        row_titles        = []
        column_titles     = []
        current_query_row = None

        for current_data_row_index in range(num_of_rows):
            for current_data_col_index in range(num_of_cols):
                # find the current query row
                for query_row in query_rows:
                    if query_row[0] - 1 == current_data_row_index and query_row[2] - 1 == current_data_col_index:
                        current_query_row = query_row


                # pull out stuff from current_query_row
                if current_data_row_index == 0: # only grab the column titles on the first pass through so we don't get duplicates
                    column_titles.append(current_query_row[3])

                data_grid[current_data_row_index][current_data_col_index] = {"data":current_query_row[4], "data_type":current_query_row[5]}

            # grab the row title after we exit the column loop so we don't get duplicates
            row_titles.append(current_query_row[1])

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

