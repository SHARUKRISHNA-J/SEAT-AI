import chromadb
from sentence_transformers import SentenceTransformer

# Load ChromaDB
client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_collection(
    "employees"
)

# Load Embedding Model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def search_employees(query, n_results=3):

    query_embedding = model.encode(
        query
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return {
    "documents": results["documents"][0],
    "distances": results["distances"][0]
    }


# Run only when file is executed directly
if __name__ == "__main__":

    query = input(
        "Enter project requirement: "
    )

    employees = search_employees(
        query,
        n_results=3
    )

    print("\nRecommended Employees:\n")

    for employee in employees:
        print(employee)
        print("-" * 50)