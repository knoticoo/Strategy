#!/usr/bin/env python3
"""
Veterinary Knowledge Data Collector
Scrapes and processes veterinary information from multiple sources
to create training data for our custom AI model.
"""

import asyncio
import aiohttp
import json
import sqlite3
import time
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from pathlib import Path
import pandas as pd
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse
import re
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class VeterinaryKnowledge:
    """Structure for veterinary knowledge entries"""
    id: str
    title: str
    content: str
    species: List[str]
    category: str
    source: str
    url: str
    language: str
    confidence: float
    symptoms: List[str]
    treatments: List[str]
    medications: List[str]
    urgency: str
    timestamp: str

class VeterinaryDataCollector:
    """Collects veterinary knowledge from multiple sources"""
    
    def __init__(self, db_path: str = "data/veterinary_knowledge.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(exist_ok=True)
        self.session = None
        self.knowledge_entries: List[VeterinaryKnowledge] = []
        
        # Initialize database
        self.init_database()
        
        # Define source configurations
        self.sources = {
            'wikipedia': {
                'base_url': 'https://en.wikipedia.org/api/rest_v1',
                'languages': ['en', 'ru'],
                'topics': [
                    'Veterinary_medicine', 'Animal_disease', 'Pet_health',
                    'Dog_health', 'Cat_health', 'Bird_disease', 'Fish_disease',
                    'Rabbit_health', 'Hamster_care', 'Guinea_pig_health',
                    'Veterinary_pharmacology', 'Animal_nutrition',
                    'Pet_first_aid', 'Animal_behavior', 'Zoonosis'
                ]
            },
            'pubmed': {
                'base_url': 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
                'search_terms': [
                    'veterinary medicine', 'animal disease', 'pet health',
                    'canine disease', 'feline disease', 'avian disease',
                    'small animal medicine', 'veterinary treatment',
                    'animal pharmacology', 'pet nutrition'
                ]
            },
            'open_sources': [
                'https://www.merckvetmanual.com',
                'https://vcahospitals.com',
                'https://www.petmd.com',
                'https://www.aspca.org'
            ]
        }

    def init_database(self):
        """Initialize SQLite database for storing collected knowledge"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS veterinary_knowledge (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                species TEXT NOT NULL,
                category TEXT NOT NULL,
                source TEXT NOT NULL,
                url TEXT,
                language TEXT NOT NULL,
                confidence REAL NOT NULL,
                symptoms TEXT,
                treatments TEXT,
                medications TEXT,
                urgency TEXT,
                timestamp TEXT NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS training_pairs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                species TEXT NOT NULL,
                category TEXT NOT NULL,
                language TEXT NOT NULL,
                confidence REAL NOT NULL,
                source_id TEXT,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (source_id) REFERENCES veterinary_knowledge (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info(f"Database initialized at {self.db_path}")

    async def collect_all_data(self):
        """Main method to collect data from all sources"""
        logger.info("🚀 Starting comprehensive veterinary data collection...")
        
        async with aiohttp.ClientSession() as session:
            self.session = session
            
            # Collect from different sources
            await self.collect_wikipedia_data()
            await self.collect_pubmed_data()
            await self.collect_open_source_data()
            
        # Process and store collected data
        self.store_knowledge_entries()
        self.generate_training_pairs()
        
        logger.info(f"✅ Data collection complete! Collected {len(self.knowledge_entries)} knowledge entries")

    async def collect_wikipedia_data(self):
        """Collect veterinary information from Wikipedia"""
        logger.info("📚 Collecting data from Wikipedia...")
        
        for lang in self.sources['wikipedia']['languages']:
            base_url = f"https://{lang}.wikipedia.org/api/rest_v1"
            
            for topic in self.sources['wikipedia']['topics']:
                try:
                    # Get page summary
                    url = f"{base_url}/page/summary/{topic}"
                    async with self.session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            await self.process_wikipedia_page(data, lang)
                    
                    # Get related pages
                    related_url = f"{base_url}/page/related/{topic}"
                    async with self.session.get(related_url) as response:
                        if response.status == 200:
                            related_data = await response.json()
                            for page in related_data.get('pages', [])[:5]:  # Limit to 5 related pages
                                await self.process_wikipedia_page(page, lang)
                    
                    await asyncio.sleep(1)  # Rate limiting
                    
                except Exception as e:
                    logger.warning(f"Error collecting Wikipedia data for {topic}: {e}")

    async def process_wikipedia_page(self, page_data: Dict, language: str):
        """Process a Wikipedia page and extract veterinary knowledge"""
        try:
            if not page_data.get('extract'):
                return
                
            title = page_data.get('title', '')
            content = page_data.get('extract', '')
            url = page_data.get('content_urls', {}).get('desktop', {}).get('page', '')
            
            # Extract species mentioned
            species = self.extract_species(content)
            
            # Categorize content
            category = self.categorize_content(content)
            
            # Extract symptoms, treatments, medications
            symptoms = self.extract_symptoms(content)
            treatments = self.extract_treatments(content)
            medications = self.extract_medications(content)
            
            # Determine urgency
            urgency = self.determine_urgency(content)
            
            # Calculate confidence based on content quality
            confidence = self.calculate_confidence(content, title, species)
            
            knowledge_entry = VeterinaryKnowledge(
                id=f"wiki_{language}_{hash(url)}",
                title=title,
                content=content,
                species=species,
                category=category,
                source='wikipedia',
                url=url,
                language=language,
                confidence=confidence,
                symptoms=symptoms,
                treatments=treatments,
                medications=medications,
                urgency=urgency,
                timestamp=datetime.now().isoformat()
            )
            
            self.knowledge_entries.append(knowledge_entry)
            
        except Exception as e:
            logger.warning(f"Error processing Wikipedia page: {e}")

    async def collect_pubmed_data(self):
        """Collect veterinary research data from PubMed"""
        logger.info("🔬 Collecting data from PubMed...")
        
        for search_term in self.sources['pubmed']['search_terms']:
            try:
                # Search for articles
                search_url = f"{self.sources['pubmed']['base_url']}/esearch.fcgi"
                params = {
                    'db': 'pubmed',
                    'term': search_term,
                    'retmax': 20,  # Limit results
                    'retmode': 'json'
                }
                
                async with self.session.get(search_url, params=params) as response:
                    if response.status == 200:
                        search_data = await response.json()
                        pmids = search_data.get('esearchresult', {}).get('idlist', [])
                        
                        # Fetch article details
                        if pmids:
                            await self.fetch_pubmed_articles(pmids)
                
                await asyncio.sleep(2)  # Rate limiting for PubMed
                
            except Exception as e:
                logger.warning(f"Error collecting PubMed data for {search_term}: {e}")

    async def fetch_pubmed_articles(self, pmids: List[str]):
        """Fetch detailed information for PubMed articles"""
        try:
            fetch_url = f"{self.sources['pubmed']['base_url']}/efetch.fcgi"
            params = {
                'db': 'pubmed',
                'id': ','.join(pmids[:10]),  # Limit to 10 articles
                'retmode': 'xml'
            }
            
            async with self.session.get(fetch_url, params=params) as response:
                if response.status == 200:
                    xml_data = await response.text()
                    # Process XML data (simplified for this example)
                    await self.process_pubmed_xml(xml_data)
                    
        except Exception as e:
            logger.warning(f"Error fetching PubMed articles: {e}")

    async def process_pubmed_xml(self, xml_data: str):
        """Process PubMed XML data and extract knowledge"""
        try:
            soup = BeautifulSoup(xml_data, 'xml')
            articles = soup.find_all('PubmedArticle')
            
            for article in articles:
                title_elem = article.find('ArticleTitle')
                abstract_elem = article.find('AbstractText')
                
                if title_elem and abstract_elem:
                    title = title_elem.get_text()
                    abstract = abstract_elem.get_text()
                    
                    # Extract veterinary knowledge from research abstract
                    species = self.extract_species(abstract)
                    category = self.categorize_content(abstract)
                    symptoms = self.extract_symptoms(abstract)
                    treatments = self.extract_treatments(abstract)
                    medications = self.extract_medications(abstract)
                    urgency = self.determine_urgency(abstract)
                    confidence = self.calculate_confidence(abstract, title, species)
                    
                    knowledge_entry = VeterinaryKnowledge(
                        id=f"pubmed_{hash(title)}",
                        title=title,
                        content=abstract,
                        species=species,
                        category=category,
                        source='pubmed',
                        url='',
                        language='en',
                        confidence=confidence,
                        symptoms=symptoms,
                        treatments=treatments,
                        medications=medications,
                        urgency=urgency,
                        timestamp=datetime.now().isoformat()
                    )
                    
                    self.knowledge_entries.append(knowledge_entry)
                    
        except Exception as e:
            logger.warning(f"Error processing PubMed XML: {e}")

    async def collect_open_source_data(self):
        """Collect data from open veterinary websites"""
        logger.info("🌐 Collecting data from open sources...")
        
        for source_url in self.sources['open_sources']:
            try:
                await self.scrape_website(source_url)
                await asyncio.sleep(3)  # Rate limiting
                
            except Exception as e:
                logger.warning(f"Error collecting data from {source_url}: {e}")

    async def scrape_website(self, base_url: str):
        """Scrape veterinary information from a website"""
        try:
            async with self.session.get(base_url) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Find article links
                    article_links = self.find_article_links(soup, base_url)
                    
                    # Process each article
                    for link in article_links[:10]:  # Limit to 10 articles per site
                        await self.scrape_article(link, base_url)
                        await asyncio.sleep(1)
                        
        except Exception as e:
            logger.warning(f"Error scraping website {base_url}: {e}")

    def find_article_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Find relevant article links on a veterinary website"""
        links = []
        
        # Common patterns for veterinary article links
        patterns = [
            'a[href*="disease"]',
            'a[href*="health"]',
            'a[href*="treatment"]',
            'a[href*="condition"]',
            'a[href*="symptom"]',
            '.article-link',
            '.health-article'
        ]
        
        for pattern in patterns:
            elements = soup.select(pattern)
            for elem in elements:
                href = elem.get('href')
                if href:
                    full_url = urljoin(base_url, href)
                    if self.is_relevant_veterinary_url(full_url):
                        links.append(full_url)
        
        return list(set(links))  # Remove duplicates

    async def scrape_article(self, url: str, source_domain: str):
        """Scrape content from a veterinary article"""
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Extract article content
                    title = self.extract_title(soup)
                    content = self.extract_article_content(soup)
                    
                    if title and content and len(content) > 100:
                        # Process the article
                        species = self.extract_species(content)
                        category = self.categorize_content(content)
                        symptoms = self.extract_symptoms(content)
                        treatments = self.extract_treatments(content)
                        medications = self.extract_medications(content)
                        urgency = self.determine_urgency(content)
                        confidence = self.calculate_confidence(content, title, species)
                        
                        knowledge_entry = VeterinaryKnowledge(
                            id=f"web_{hash(url)}",
                            title=title,
                            content=content,
                            species=species,
                            category=category,
                            source=urlparse(source_domain).netloc,
                            url=url,
                            language='en',
                            confidence=confidence,
                            symptoms=symptoms,
                            treatments=treatments,
                            medications=medications,
                            urgency=urgency,
                            timestamp=datetime.now().isoformat()
                        )
                        
                        self.knowledge_entries.append(knowledge_entry)
                        
        except Exception as e:
            logger.warning(f"Error scraping article {url}: {e}")

    def extract_species(self, text: str) -> List[str]:
        """Extract animal species mentioned in text"""
        species_patterns = {
            'dog': r'\b(dog|canine|puppy|puppies)\b',
            'cat': r'\b(cat|feline|kitten|kittens)\b',
            'bird': r'\b(bird|avian|parrot|canary|budgie)\b',
            'rabbit': r'\b(rabbit|bunny|hare)\b',
            'hamster': r'\b(hamster|gerbil)\b',
            'guinea_pig': r'\b(guinea pig|cavy)\b',
            'fish': r'\b(fish|aquatic|goldfish)\b',
            'reptile': r'\b(reptile|snake|lizard|turtle|gecko)\b'
        }
        
        found_species = []
        text_lower = text.lower()
        
        for species, pattern in species_patterns.items():
            if re.search(pattern, text_lower):
                found_species.append(species)
        
        return found_species if found_species else ['general']

    def categorize_content(self, text: str) -> str:
        """Categorize veterinary content"""
        categories = {
            'skin': r'\b(skin|dermat|itch|scratch|rash|fur|hair|coat)\b',
            'digestive': r'\b(digest|stomach|intestin|diarrhea|vomit|nausea)\b',
            'respiratory': r'\b(breath|lung|cough|sneez|respiratory|pneumonia)\b',
            'cardiac': r'\b(heart|cardiac|circulation|blood|pulse)\b',
            'neurological': r'\b(brain|neuro|seizure|paralysis|behavior)\b',
            'orthopedic': r'\b(bone|joint|muscle|ligament|fracture|arthritis)\b',
            'ophthalmologic': r'\b(eye|vision|blind|cataract|cornea)\b',
            'urinary': r'\b(kidney|bladder|urin|nephro|cystitis)\b',
            'reproductive': r'\b(reproduct|pregnan|birth|mating|estrus)\b',
            'infectious': r'\b(infect|virus|bacteria|parasit|vaccine)\b',
            'nutrition': r'\b(diet|food|nutrition|feed|eating)\b',
            'emergency': r'\b(emergency|urgent|critical|poison|trauma)\b'
        }
        
        text_lower = text.lower()
        for category, pattern in categories.items():
            if re.search(pattern, text_lower):
                return category
        
        return 'general'

    def extract_symptoms(self, text: str) -> List[str]:
        """Extract symptoms mentioned in text"""
        symptom_patterns = [
            r'\b(vomiting|vomit)\b', r'\b(diarrhea|loose stool)\b',
            r'\b(coughing|cough)\b', r'\b(sneezing|sneeze)\b',
            r'\b(lethargy|tired|weak)\b', r'\b(fever|temperature)\b',
            r'\b(loss of appetite|not eating)\b', r'\b(limping|lameness)\b',
            r'\b(scratching|itching)\b', r'\b(hair loss|balding)\b',
            r'\b(bleeding|blood)\b', r'\b(swelling|swollen)\b',
            r'\b(difficulty breathing|dyspnea)\b', r'\b(seizure|convulsion)\b'
        ]
        
        symptoms = []
        text_lower = text.lower()
        
        for pattern in symptom_patterns:
            matches = re.findall(pattern, text_lower)
            symptoms.extend(matches)
        
        return list(set(symptoms))  # Remove duplicates

    def extract_treatments(self, text: str) -> List[str]:
        """Extract treatments mentioned in text"""
        treatment_patterns = [
            r'\b(surgery|surgical)\b', r'\b(medication|medicine|drug)\b',
            r'\b(therapy|treatment)\b', r'\b(antibiotic|antimicrobial)\b',
            r'\b(pain relief|analgesic)\b', r'\b(rest|bed rest)\b',
            r'\b(diet change|dietary)\b', r'\b(exercise|physical therapy)\b',
            r'\b(vaccination|vaccine)\b', r'\b(fluid therapy|IV)\b'
        ]
        
        treatments = []
        text_lower = text.lower()
        
        for pattern in treatment_patterns:
            matches = re.findall(pattern, text_lower)
            treatments.extend(matches)
        
        return list(set(treatments))

    def extract_medications(self, text: str) -> List[str]:
        """Extract medications mentioned in text"""
        # Common veterinary medications
        medication_patterns = [
            r'\b(amoxicillin|penicillin|cephalexin)\b',
            r'\b(prednisone|prednisolone|dexamethasone)\b',
            r'\b(metacam|rimadyl|carprofen)\b',
            r'\b(tramadol|gabapentin|buprenorphine)\b',
            r'\b(furosemide|enalapril|pimobendan)\b',
            r'\b(metronidazole|sulfasalazine)\b'
        ]
        
        medications = []
        text_lower = text.lower()
        
        for pattern in medication_patterns:
            matches = re.findall(pattern, text_lower)
            medications.extend(matches)
        
        return list(set(medications))

    def determine_urgency(self, text: str) -> str:
        """Determine urgency level based on content"""
        emergency_keywords = r'\b(emergency|urgent|critical|immediate|life-threatening|toxic|poison)\b'
        high_keywords = r'\b(serious|severe|concerning|worrying|painful)\b'
        medium_keywords = r'\b(monitor|watch|observe|check)\b'
        
        text_lower = text.lower()
        
        if re.search(emergency_keywords, text_lower):
            return 'emergency'
        elif re.search(high_keywords, text_lower):
            return 'high'
        elif re.search(medium_keywords, text_lower):
            return 'medium'
        else:
            return 'low'

    def calculate_confidence(self, content: str, title: str, species: List[str]) -> float:
        """Calculate confidence score for the knowledge entry"""
        score = 0.5  # Base score
        
        # Content length bonus
        if len(content) > 500:
            score += 0.2
        elif len(content) > 200:
            score += 0.1
        
        # Species specificity bonus
        if len(species) > 0 and 'general' not in species:
            score += 0.1
        
        # Title relevance bonus
        if any(keyword in title.lower() for keyword in ['veterinary', 'animal', 'pet', 'disease', 'health']):
            score += 0.1
        
        # Medical terminology bonus
        medical_terms = len(re.findall(r'\b(treatment|diagnosis|symptom|medication|therapy|condition)\b', content.lower()))
        score += min(medical_terms * 0.02, 0.1)
        
        return min(score, 1.0)

    def is_relevant_veterinary_url(self, url: str) -> bool:
        """Check if URL is relevant to veterinary content"""
        relevant_keywords = [
            'health', 'disease', 'treatment', 'condition', 'symptom',
            'care', 'medical', 'veterinary', 'pet', 'animal'
        ]
        
        url_lower = url.lower()
        return any(keyword in url_lower for keyword in relevant_keywords)

    def extract_title(self, soup: BeautifulSoup) -> str:
        """Extract title from HTML"""
        title_selectors = ['h1', 'title', '.article-title', '.page-title']
        
        for selector in title_selectors:
            element = soup.select_one(selector)
            if element and element.get_text().strip():
                return element.get_text().strip()
        
        return ''

    def extract_article_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from HTML"""
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            element.decompose()
        
        # Try different content selectors
        content_selectors = [
            '.article-content', '.post-content', '.entry-content',
            'article', 'main', '.content', '#content'
        ]
        
        for selector in content_selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(separator=' ', strip=True)
                if len(text) > 100:
                    return text
        
        # Fallback: get all paragraph text
        paragraphs = soup.find_all('p')
        content = ' '.join([p.get_text(strip=True) for p in paragraphs])
        
        return content if len(content) > 100 else ''

    def store_knowledge_entries(self):
        """Store collected knowledge entries in database"""
        logger.info(f"💾 Storing {len(self.knowledge_entries)} knowledge entries in database...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for entry in self.knowledge_entries:
            cursor.execute('''
                INSERT OR REPLACE INTO veterinary_knowledge 
                (id, title, content, species, category, source, url, language, 
                 confidence, symptoms, treatments, medications, urgency, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                entry.id, entry.title, entry.content, json.dumps(entry.species),
                entry.category, entry.source, entry.url, entry.language,
                entry.confidence, json.dumps(entry.symptoms), 
                json.dumps(entry.treatments), json.dumps(entry.medications),
                entry.urgency, entry.timestamp
            ))
        
        conn.commit()
        conn.close()
        logger.info("✅ Knowledge entries stored successfully")

    def generate_training_pairs(self):
        """Generate question-answer pairs for training"""
        logger.info("🧠 Generating training question-answer pairs...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        training_pairs = []
        
        for entry in self.knowledge_entries:
            # Generate different types of questions
            questions = self.generate_questions_for_entry(entry)
            
            for question in questions:
                answer = self.generate_answer_for_question(question, entry)
                
                training_pairs.append({
                    'question': question,
                    'answer': answer,
                    'species': json.dumps(entry.species),
                    'category': entry.category,
                    'language': entry.language,
                    'confidence': entry.confidence,
                    'source_id': entry.id,
                    'timestamp': datetime.now().isoformat()
                })
        
        # Store training pairs
        for pair in training_pairs:
            cursor.execute('''
                INSERT INTO training_pairs 
                (question, answer, species, category, language, confidence, source_id, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                pair['question'], pair['answer'], pair['species'],
                pair['category'], pair['language'], pair['confidence'],
                pair['source_id'], pair['timestamp']
            ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"✅ Generated {len(training_pairs)} training pairs")

    def generate_questions_for_entry(self, entry: VeterinaryKnowledge) -> List[str]:
        """Generate relevant questions for a knowledge entry"""
        questions = []
        
        # Species-specific questions
        for species in entry.species:
            if species != 'general':
                questions.extend([
                    f"What health issues affect {species}s?",
                    f"How do I care for my {species}?",
                    f"What are common {species} diseases?",
                    f"My {species} is sick, what should I do?"
                ])
        
        # Symptom-based questions
        for symptom in entry.symptoms[:3]:  # Limit to 3 symptoms
            questions.extend([
                f"My pet has {symptom}, what could it be?",
                f"What causes {symptom} in pets?",
                f"How do I treat {symptom}?"
            ])
        
        # Category-based questions
        if entry.category != 'general':
            questions.extend([
                f"What are {entry.category} problems in pets?",
                f"How do I prevent {entry.category} issues?",
                f"What are signs of {entry.category} disease?"
            ])
        
        # Treatment questions
        for treatment in entry.treatments[:2]:  # Limit to 2 treatments
            questions.append(f"When is {treatment} used in veterinary medicine?")
        
        return questions[:10]  # Limit to 10 questions per entry

    def generate_answer_for_question(self, question: str, entry: VeterinaryKnowledge) -> str:
        """Generate appropriate answer for a question based on knowledge entry"""
        # Create a comprehensive answer using the entry content
        answer_parts = []
        
        # Add main content (truncated)
        main_content = entry.content[:300] + "..." if len(entry.content) > 300 else entry.content
        answer_parts.append(main_content)
        
        # Add specific information based on question type
        if any(word in question.lower() for word in ['symptom', 'sign', 'what are']):
            if entry.symptoms:
                answer_parts.append(f"Common symptoms include: {', '.join(entry.symptoms[:5])}")
        
        if any(word in question.lower() for word in ['treat', 'treatment', 'how']):
            if entry.treatments:
                answer_parts.append(f"Treatment options may include: {', '.join(entry.treatments[:3])}")
        
        if any(word in question.lower() for word in ['medication', 'medicine', 'drug']):
            if entry.medications:
                answer_parts.append(f"Medications that may be prescribed: {', '.join(entry.medications[:3])}")
        
        # Add urgency information
        if entry.urgency in ['emergency', 'high']:
            answer_parts.append("⚠️ This condition may require immediate veterinary attention.")
        
        # Add general veterinary advice
        answer_parts.append("Always consult with a qualified veterinarian for proper diagnosis and treatment.")
        
        return " ".join(answer_parts)

    def export_training_data(self, output_path: str = "data/training_data.jsonl"):
        """Export training data in JSONL format for model training"""
        logger.info("📤 Exporting training data...")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT question, answer, species, category, language, confidence
            FROM training_pairs
            WHERE confidence > 0.6
            ORDER BY confidence DESC
        ''')
        
        output_path = Path(output_path)
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            for row in cursor.fetchall():
                question, answer, species, category, language, confidence = row
                
                training_example = {
                    "instruction": "You are a veterinary AI assistant. Provide helpful and accurate veterinary advice.",
                    "input": question,
                    "output": answer,
                    "metadata": {
                        "species": json.loads(species),
                        "category": category,
                        "language": language,
                        "confidence": confidence
                    }
                }
                
                f.write(json.dumps(training_example, ensure_ascii=False) + '\n')
        
        conn.close()
        logger.info(f"✅ Training data exported to {output_path}")

    def get_statistics(self):
        """Get collection statistics"""
        conn = sqlite3.connect(self.db_path)
        
        # Knowledge entries stats
        knowledge_df = pd.read_sql_query('''
            SELECT category, language, source, COUNT(*) as count, AVG(confidence) as avg_confidence
            FROM veterinary_knowledge
            GROUP BY category, language, source
        ''', conn)
        
        # Training pairs stats
        training_df = pd.read_sql_query('''
            SELECT category, language, COUNT(*) as count, AVG(confidence) as avg_confidence
            FROM training_pairs
            GROUP BY category, language
        ''', conn)
        
        conn.close()
        
        logger.info("📊 Collection Statistics:")
        logger.info(f"Knowledge entries by category:\n{knowledge_df}")
        logger.info(f"Training pairs by category:\n{training_df}")

async def main():
    """Main function to run the data collection"""
    collector = VeterinaryDataCollector()
    
    # Collect all data
    await collector.collect_all_data()
    
    # Export training data
    collector.export_training_data()
    
    # Show statistics
    collector.get_statistics()
    
    logger.info("🎉 Veterinary knowledge collection complete!")

if __name__ == "__main__":
    asyncio.run(main())