SELECT fn_create_activity(
    'Counting Game',
    'The student is shown a card with a number or number of objects on it, and they are asked to count from 1 up to that number.',
    'numbers',
    '{
       "columns":
       [
         {
           "title":"first column title",
           "number":1,
           "data_type":"numeric"
         },
         {
           "title":"second column title",
           "number":2,
           "data_type":"string"
         }
       ],
       "rows":
       [
         {
           "title":"first row title",
           "number":1
         },
         {
           "title":"second row title",
           "number":2
         }
       ]
     }'::JSON
);

SELECT fn_create_activity(
    'Vocabulary Game',
    'The student is shown a card with an animal or object on it, and they are asked to identify the animal or object.',
    'words',
    '{
       "columns":
       [
         {
           "title":"first column title (second activity)",
           "number":1,
           "data_type":"numeric"
         },
         {
           "title":"second column title (second activity)",
           "number":2,
           "data_type":"string"
         }
       ],
       "rows":
       [
         {
           "title":"first row title (second activity)",
           "number":1
         },
         {
           "title":"second row title (second activity)",
           "number":2
         }
       ]
     }'::JSON
);

SELECT fn_create_activity(
    'Time with the Animals',
    'The student is taken to the animal petting area and asked to pet/play with the animals.',
    'words',
    '{
       "columns":
       [
         {
           "title":"first column title (third activity)",
           "number":1,
           "data_type":"numeric"
         },
         {
           "title":"second column title (third activity)",
           "number":2,
           "data_type":"string"
         }
       ],
       "rows":
       [
         {
           "title":"first row title (third activity)",
           "number":1
         },
         {
           "title":"second row title (third activity)",
           "number":2
         }
       ]
     }'::JSON
);

