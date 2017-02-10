#!/usr/bin/env python
# Name: Alex Wittebrood
# Student number: 10288880
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
#from bs4 import BeautifulSoup
from pattern.web import URL, DOM, plaintext


TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).
    
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    
    list_highest_rated_series = []
    
    for i in range(0,50):
             
        # extracts title of the series and saves it to the string
        tv_title = dom("h3.lister-item-header")[i].by_tag('a')[0].content.encode("latin-1")
        serie_detail = (tv_title + ", ")

        # extracts genre of the serie and saves it to the string
        genre = dom.by_class("genre")[i].content[1:].rstrip().encode("latin-1")
        serie_detail += (genre + ", ") 
        
        # extracts runtime of an episode and saves it to the string
        runtime = dom.by_class("runtime")[i+1].content[:-3].encode("latin-1")
        serie_detail += (runtime + ", ")
        
        # extracts the 4 lead actors of the series and saves it to the string
        actors = ""
        for j in range(0,4):
            actors += dom.by_class("lister-item-content")[i].by_tag("p")[2].by_tag("a")[j].content.encode("latin-1") + ","
        serie_detail += actors

        # extracts the rating of the series and saves it to the string
        rating = plaintext(dom.by_class("inline-block ratings-imdb-rating")[i].content)
        serie_detail += (rating.encode("latin-1"))
       
       
        list_highest_rated_series.append(serie_detail)
    return list_highest_rated_series  # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    writer.writerows([x.split(',') for x in tvseries])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
   
    tvseries = extract_tvseries(dom)
    
    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)