from http.client import HTTPException
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
#from groq import Groq

from llama_index.llms.groq import Groq
from dotenv import load_dotenv
import requests
import re
import os
from os.path import basename
#from pinecone import Pinecone
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings, StorageContext, load_index_from_storage
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter



app = FastAPI()

load_dotenv()

llm = Groq(
    model="llama-3.3-70b-versatile",
    api_key=os.environ.get("GROQ_API_KEY")
)

Settings.llm = llm
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
"""
documents = SimpleDirectoryReader("rulebooks", file_metadata=lambda file_name: {"file_name": basename(file_name)}).load_data(show_progress=True)
index = VectorStoreIndex.from_documents(documents,show_progress=True)
index.storage_context.persist(persist_dir='./storage')
"""
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(
            storage_context
        )


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

# Create a function to get a filtered query engine
def get_filtered_query_engine(filename):
    print("filename is {}".format(filename))
    # Create filtered query engines for both vector and summary tools
    filtered_vector_engine = index.as_query_engine(
        streaming=True,
        filters=MetadataFilters(
            filters=[ExactMatchFilter(key="file_name", value=filename)]
        )
    )
    
    filtered_summary_engine = index.as_query_engine(
        response_mode="tree_summarize",
        streaming=True,
        filters=MetadataFilters(
            filters=[ExactMatchFilter(key="file_name", value=filename)]
        )
    )

    vector_tool = QueryEngineTool(
        filtered_vector_engine,
        metadata=ToolMetadata(
            name="vector_search",
            description="Useful for searching for specific facts.",
        ),
    )

    summary_tool = QueryEngineTool(
        filtered_summary_engine,
        metadata=ToolMetadata(
            name="summary",
            description="Useful for summarizing an entire document.",
        ),
    )

    return RouterQueryEngine.from_defaults(
        [vector_tool, summary_tool], 
        select_multi=False, 
        verbose=True, 
        llm=llm
    )

@app.websocket("/message")
async def message(websocket: WebSocket, filename: str):
    await websocket.accept()
    filtered_engine = get_filtered_query_engine(filename)
    while True:
        message = await websocket.receive_text()
        response = filtered_engine.query(message)

        for chunk in response.response_gen:
            if(chunk != None):
                await websocket.send_text(chunk)
        await websocket.send_text("[END]")

@app.get("/list/{search_query}")
async def list(search_query: str):
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
async def download(search_query: str):
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
