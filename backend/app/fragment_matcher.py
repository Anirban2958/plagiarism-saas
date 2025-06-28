# =====================
# 1. Import dependencies
# =====================
from sentence_transformers import SentenceTransformer  # For text embeddings
from pinecone import Pinecone  # Pinecone vector database client
import os  # For environment variable access
import nltk  # Natural Language Toolkit for tokenization

# =====================
# 2. Download NLTK punkt tokenizer (for sentence/word splitting)
# =====================
nltk.download('punkt')
from nltk.tokenize import sent_tokenize, word_tokenize

# =====================
# 3. Initialize the embedding model
# =====================
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# =====================
# 4. Initialize Pinecone vector database
# =====================
pc = Pinecone(api_key=os.getenv("pcsk_6FXJ9Z_7D3jaQtwN4qHeYJ6SqmS7dUkDVmqKQyYoFy2RT6xtsTZyDkL3RKsb3oP5a3ApvY"))
index = pc.Index("plagiarism-check")

# =====================
# 5. Helper: Break a sentence into n-word fragments (sliding window)
# =====================
def chunk_sentence(sentence, n=5):
    """
    Split a sentence into overlapping n-word fragments.
    Example: 'I love AI and coding.' with n=3 -> ['I love AI', 'love AI and', 'AI and coding']
    """
    words = word_tokenize(sentence)
    chunks = []
    for i in range(len(words) - n + 1):
        chunk = ' '.join(words[i:i + n])
        chunks.append(chunk)
    return chunks

# =====================
# 6. Main function: Check for fragment-level plagiarism
# =====================
def check_fragment_level_plagiarism(text, threshold=0.85):
    """
    For each sentence in the input text, break it into fragments and check each fragment
    against the Pinecone index for similarity. Returns a list of sentences with plagiarized fragments.
    """
    final_results = []
    sentences = sent_tokenize(text)

    for sentence in sentences:
        fragments = chunk_sentence(sentence, n=5)
        flagged_fragments = []

        for fragment in fragments:
            embedding = model.encode([fragment])[0].tolist()
            result = index.query(vector=embedding, top_k=1, include_metadata=True)
            if result['matches']:
                score = result['matches'][0]['score']
                if score >= threshold:
                    flagged_fragments.append(fragment)
            # else: no matches, skip fragment

        # Only add to final_results if there are flagged fragments
        if flagged_fragments:
            final_results.append({
                "sentence": sentence,
                "plagiarized_fragments": flagged_fragments
            })

    return final_results
