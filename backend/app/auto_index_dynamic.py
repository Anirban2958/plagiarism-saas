# =====================
# 1. Import dependencies
# =====================
import os  # For file paths and environment variable access
import nltk  # Natural Language Toolkit for tokenization and stopwords
from dotenv import load_dotenv  # Loads environment variables from .env file
from sentence_transformers import SentenceTransformer  # For text embeddings
from pinecone import Pinecone  # Pinecone vector database client
from nltk.tokenize import sent_tokenize  # Sentence tokenization
from collections import Counter  # For keyword frequency counting
import re  # Regular expressions for keyword extraction
import numpy as np  # For vector similarity calculation
import warnings  # To suppress warnings from libraries
import wikipedia  # To fetch Wikipedia articles
import requests  # To fetch data from Gutenberg and NewsAPI

# =====================
# 2. Suppress noisy warnings from Wikipedia library
# =====================
warnings.filterwarnings("ignore", category=UserWarning, module="wikipedia")

# =====================
# 3. Load environment variables from .env file
# =====================
load_dotenv()

# =====================
# 4. Ensure NLTK punkt tokenizer is available
#    (Required for sentence splitting)
# =====================
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.data.path.append(os.path.join(os.path.dirname(__file__), '../../nltk_data'))

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    raise RuntimeError('NLTK punkt tokenizer not found. Please copy it to backend/nltk_data/tokenizers/punkt')

# =====================
# 5. Load the sentence embedding model
#    (Used to convert sentences to vector representations)
# =====================
MODEL_PATH = os.getenv('SENTENCE_TRANSFORMER_PATH', 'all-MiniLM-L6-v2')
model_path_full = os.path.join(os.path.dirname(__file__), MODEL_PATH)
model = SentenceTransformer(model_path_full)

# =====================
# 6. Initialize Pinecone vector database
#    (Optional: Used if you want to store/query embeddings in Pinecone)
# =====================
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("plagiarism-check")

# =====================
# 7. Extract keywords from user text
#    (Used to search for relevant sources)
# =====================
def extract_keywords(text, top_n=7):
    """
    Extract the top N keywords from the input text, ignoring common stopwords.
    Returns a list of keywords.
    """
    words = re.findall(r'\b\w{4,}\b', text.lower())
    stopwords = set(nltk.corpus.stopwords.words('english'))
    keywords = [w for w in words if w not in stopwords]
    most_common = [w for w, _ in Counter(keywords).most_common(top_n)]
    return most_common

# =====================
# 8. Fetch sentences from Wikipedia articles for each keyword
#    (Returns sentences, their sources, and URLs)
# =====================
def fetch_wikipedia_sentences(keywords, max_articles=2):
    """
    For each keyword, search Wikipedia and fetch sentences from the top articles.
    Returns lists of sentences, sources, and URLs.
    """
    sentences = []
    sources = []
    urls = []
    for kw in keywords:
        try:
            search_results = wikipedia.search(kw)
            for title in search_results[:max_articles]:
                page = wikipedia.page(title)
                sents = sent_tokenize(page.content)
                sentences += sents
                sources += [("Wikipedia", title)] * len(sents)
                urls += [page.url] * len(sents)
        except Exception:
            pass
    return sentences, sources, urls

# =====================
# 9. Fetch sentences from Project Gutenberg books for each keyword
#    (Returns sentences, their sources, and URLs)
# =====================
def fetch_gutenberg_sentences(keywords, max_books=1):
    """
    For each keyword, search Gutenberg and fetch sentences from the top books.
    Returns lists of sentences, sources, and URLs.
    """
    sentences = []
    sources = []
    urls = []
    for kw in keywords:
        url = f"https://gutendex.com/books/?search={kw}"
        try:
            r = requests.get(url)
            r.raise_for_status()
            data = r.json()
            for book in data.get('results', [])[:max_books]:
                book_id = book['id']
                title = book['title']
                book_url = f"https://www.gutenberg.org/files/{book_id}/{book_id}-0.txt"
                book_page_url = f"https://www.gutenberg.org/ebooks/{book_id}"
                book_r = requests.get(book_url)
                if book_r.status_code == 200:
                    text = book_r.text
                    start = text.find("*** START OF THIS PROJECT GUTENBERG EBOOK")
                    end = text.find("*** END OF THIS PROJECT GUTENBERG EBOOK")
                    if start != -1 and end != -1:
                        text = text[start:end]
                    sents = sent_tokenize(text)
                    sentences += sents
                    sources += [("Gutenberg", title)] * len(sents)
                    urls += [book_page_url] * len(sents)
        except Exception:
            pass
    return sentences, sources, urls

# =====================
# 10. Fetch sentences from NewsAPI articles for each keyword
#     (Returns sentences, their sources, and URLs)
# =====================
def fetch_newsapi_sentences(api_key, keywords, page_size=3):
    """
    For each keyword, search NewsAPI and fetch sentences from the top articles.
    Returns lists of sentences, sources, and URLs.
    """
    sentences = []
    sources = []
    urls = []
    for kw in keywords:
        url = f"https://newsapi.org/v2/everything?q={kw}&pageSize={page_size}&apiKey={api_key}"
        try:
            r = requests.get(url)
            r.raise_for_status()
            articles = r.json().get("articles", [])
            for article in articles:
                content = article.get("content")
                title = article.get("title", "")
                article_url = article.get("url", "")
                if content:
                    sents = sent_tokenize(content)
                    sentences += sents
                    sources += [("NewsAPI", title)] * len(sents)
                    urls += [article_url] * len(sents)
        except Exception:
            pass
    return sentences, sources, urls

# =====================
# 11. Main function: Check user text for plagiarism
#     (Compares user sentences to fetched sentences using embeddings)
# =====================
def check_live_plagiarism(user_text, similarity_threshold=0.6):
    """
    Given user_text, fetch relevant sentences from Wikipedia, Gutenberg, and NewsAPI,
    compute embeddings, and compare for similarity. Returns a list of matches.
    """
    keywords = extract_keywords(user_text, top_n=5)
    wiki_sentences, wiki_sources, wiki_urls = fetch_wikipedia_sentences(keywords)
    gutenberg_sentences, gutenberg_sources, gutenberg_urls = fetch_gutenberg_sentences(keywords)
    newsapi_key = os.getenv("NEWSAPI_KEY")
    news_sentences, news_sources, news_urls = fetch_newsapi_sentences(newsapi_key, keywords) if newsapi_key else ([],[],[])
    all_sentences = wiki_sentences + gutenberg_sentences + news_sentences
    all_sources = wiki_sources + gutenberg_sources + news_sources
    all_urls = wiki_urls + gutenberg_urls + news_urls
    print(f"[DEBUG] Keywords: {keywords}")
    print(f"[DEBUG] Wikipedia sentences: {len(wiki_sentences)}")
    print(f"[DEBUG] Gutenberg sentences: {len(gutenberg_sentences)}")
    print(f"[DEBUG] NewsAPI sentences: {len(news_sentences)}")
    print(f"[DEBUG] Total sentences to compare: {len(all_sentences)}")
    user_sentences = sent_tokenize(user_text)
    user_embeddings = model.encode(user_sentences)
    fetched_embeddings = model.encode(all_sentences) if all_sentences else []
    results = []
    for i, user_emb in enumerate(user_embeddings):
        for j, fetched_emb in enumerate(fetched_embeddings):
            sim = np.dot(user_emb, fetched_emb) / (np.linalg.norm(user_emb) * np.linalg.norm(fetched_emb))
            if sim > similarity_threshold:
                results.append({
                    "user_sentence": user_sentences[i],
                    "matched_sentence": all_sentences[j],
                    "similarity": float(sim),
                    "source": all_sources[j][0],
                    "title": all_sources[j][1],
                    "url": all_urls[j]
                })
    print(f"[DEBUG] Matches found: {len(results)}")
    return results

# =====================
# 12. Command-line usage for manual testing
# =====================
if __name__ == "__main__":
    user_text = input("Enter text to check for live plagiarism: ")
    results = check_live_plagiarism(user_text)
    if results:
        print("Plagiarism Detected!\n")
        for match in results:
            print(f"User sentence: {match['user_sentence']}")
            print(f"Matched sentence: {match['matched_sentence']}")
            print(f"Similarity: {match['similarity']:.2f}")
            print(f"Source: {match['source']}")
            print(f"Title: {match['title']}")
            print(f"URL: {match['url']}\n")
    else:
        print("No plagiarism detected.")
