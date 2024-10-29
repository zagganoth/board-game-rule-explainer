from http.client import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
import os
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_downloadable(url):
    h = requests.head(url, allow_redirects=True)
    header = h.headers
    content_type = header.get('content-type')
    if 'text' in content_type.lower():
        return False
    if 'html' in content_type.lower():
        return False
    return True

@app.get("/list/{search_query}")
async def root(search_query: str):
    print("search_query is", search_query)
    if(search_query is None or len(search_query) == 0):
        raise HTTPException("Bad input")
    request = requests.get('https://en.1jour-1jeu.com/rules/search?q='+search_query)
    text = request.text
    matches = re.findall(r'<a class="dark-link" href="(https://cdn[^"]*?pdf)".*?>(.*?)</a>.*?<p class="dark-mixed mb-1">(.*?)</p>', text)
    retDict = {}
    for obj in matches:
        retDict[obj[1]] = obj[2]
    print(retDict)
    return {'message': retDict}

@app.get("/download/{search_query}")
async def root(search_query: str):
    print("search_query is", search_query)
    if(search_query is None or len(search_query) == 0):
        raise HTTPException("Bad input")
    request = requests.get('https://en.1jour-1jeu.com/rules/search?q='+search_query)
    text = request.text
    matches = re.findall(r'<a class="dark-link" href="(https://cdn[^"]*?pdf)".*?>(.*?)</a>', text)
    for obj in matches:
        filename = 'rulebooks\\'+obj[1].replace(":", " ")+".pdf"
        if(not(os.path.isfile(filename))):
            r = requests.get(obj[0], allow_redirects=True)
            print("Creating file:",filename)
            open(filename, 'wb').write(r.content)
    return {'message': matches}
