import chromadb
from sentence_transformers import SentenceTransformer

# Load ChromaDB
client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_collection("employees")

# Load Embedding Model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

query = input("Enter project requirement: ")

query_embedding = model.encode(
    query
).tolist()

results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3
)

print("\nRecommended Employees:\n")

for doc in results["documents"][0]:
    print(doc)
    print("-" * 50)