# Day 6 statistics:

Input Downloaded: 12/6/2025, 12:00:06 AM  
Part 1 submitted: 12/6/2025, 12:07:28 AM (+00:07:21)  
Part 2 submitted: 12/6/2025, 12:33:50 AM (+00:26:22)

_Input download happens automatically when I first run the part 1 template file. I do this immediately after opening the puzzle for the first time._

Spent about 10 minutes on an otherwise correct part 2 trying to figure out why the last column of my input was getting cut off. It's because there's a trim() command in my template to remove the last blank line. In this case, it was also removing the whitespace after the last operator. Updated the template to use slice and the example-paste code to add a blank line so the example input will match the format of the real input.

Part 1 Run Time: 15ms

Part 2 Run Time: 57ms

_Code is run on a 2020 M1 Macbook Pro with 16GB of RAM_
