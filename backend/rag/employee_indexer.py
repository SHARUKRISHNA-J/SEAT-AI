from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import chromadb

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["seat_ai"]

employees = db["employees"]

# ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")

collection = chroma_client.get_or_create_collection(
    name="employees"
)

# Embedding Model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

all_employees = employees.find()

for employee in all_employees:

    skills = ", ".join(
        [skill["name"] for skill in employee["skills"]]
    )

    profile_text = f"""
    Name: {employee['name']}
    Department: {employee['department']}
    Experience: {employee['experience']} years
    Skills: {skills}
    """

    embedding = model.encode(
        profile_text
    ).tolist()

    collection.add(
        ids=[str(employee["_id"])],
        documents=[profile_text],
        embeddings=[embedding]
    )

    print(
        f"Indexed {employee['name']}"
    )

print("All employees indexed successfully")