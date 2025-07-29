#!/usr/bin/env python3
"""
Veterinary AI Inference Server
Standalone Python server for veterinary AI model inference.
Communicates with Node.js via stdin/stdout for integration.
"""

import sys
import json
import logging
import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import signal
import threading
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VeterinaryAIInferenceServer:
    def __init__(self, model_path: str):
        self.model_path = Path(model_path)
        self.config = None
        self.tokenizer = None
        self.model = None
        self.is_running = True
        
        # Load configuration
        self.load_config()
        
        # Load model and tokenizer
        self.load_model()
        
        logger.info("Model loaded successfully")
        print("Model loaded successfully", flush=True)  # Signal to Node.js
    
    def load_config(self):
        """Load inference configuration"""
        config_path = self.model_path / "inference" / "config.json"
        
        if config_path.exists():
            with open(config_path, 'r') as f:
                self.config = json.load(f)
        else:
            # Default configuration
            self.config = {
                "model_type": "veterinary-ai",
                "base_model": "microsoft/DialoGPT-small",
                "use_lora": True,
                "model_path": str(self.model_path),
                "tokenizer_path": str(self.model_path),
                "generation_config": {
                    "max_new_tokens": 200,
                    "temperature": 0.7,
                    "do_sample": True,
                    "top_p": 0.9,
                    "repetition_penalty": 1.1
                },
                "special_tokens": {
                    "vet_start": "<|vet|>",
                    "species_start": "<|species|>",
                    "species_end": "<|species|>",
                    "human_prefix": "Human:",
                    "assistant_prefix": "Veterinarian:",
                    "eos_token": "<|endoftext|>"
                }
            }
    
    def load_model(self):
        """Load the trained veterinary AI model"""
        logger.info(f"Loading model from {self.model_path}")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config["tokenizer_path"],
            padding_side="left"
        )
        
        # Ensure pad token is set
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Load model
        if self.config["use_lora"]:
            # Load base model first
            base_model = AutoModelForCausalLM.from_pretrained(
                self.config["base_model"],
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None,
                low_cpu_mem_usage=True
            )
            
            # Load LoRA adapter
            self.model = PeftModel.from_pretrained(base_model, self.config["model_path"])
        else:
            self.model = AutoModelForCausalLM.from_pretrained(
                self.config["model_path"],
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
        
        self.model.eval()
        logger.info("✅ Model loaded and ready for inference")
    
    def generate_response(self, request: dict) -> dict:
        """Generate veterinary advice response"""
        try:
            query = request.get('query', '')
            species = request.get('species', 'general')
            language = request.get('language', 'en')
            context = request.get('context', '')
            
            # Format input with veterinary context
            species_info = ""
            if species and species != 'general':
                species_info = f"<|species|>{species}<|species|> "
            
            # Create the formatted prompt
            formatted_input = (
                f"{self.config['special_tokens']['vet_start']}"
                f"You are a veterinary AI assistant. {species_info}"
                f"\n{self.config['special_tokens']['human_prefix']} {query}"
                f"\n{self.config['special_tokens']['assistant_prefix']} "
            )
            
            # Tokenize input
            inputs = self.tokenizer(
                formatted_input,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            
            # Move to GPU if available
            if torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=self.config["generation_config"]["max_new_tokens"],
                    temperature=self.config["generation_config"]["temperature"],
                    do_sample=self.config["generation_config"]["do_sample"],
                    top_p=self.config["generation_config"]["top_p"],
                    repetition_penalty=self.config["generation_config"]["repetition_penalty"],
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                    use_cache=True
                )
            
            # Decode response
            response_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the generated part (remove the input prompt)
            assistant_start = f"{self.config['special_tokens']['assistant_prefix']} "
            if assistant_start in response_text:
                response_text = response_text.split(assistant_start, 1)[1].strip()
            
            # Clean up the response
            response_text = self.clean_response(response_text)
            
            # Calculate confidence based on response quality
            confidence = self.calculate_confidence(response_text, query)
            
            return {
                'answer': response_text,
                'confidence': confidence,
                'reasoning': 'Generated using local trained veterinary AI model',
                'model_info': {
                    'model_type': self.config['model_type'],
                    'base_model': self.config['base_model'],
                    'use_lora': self.config['use_lora']
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {
                'answer': 'I apologize, but I encountered an error while processing your request. Please consult with a qualified veterinarian for your pet\'s health concerns.',
                'confidence': 0.1,
                'reasoning': f'Error in model inference: {str(e)}',
                'error': str(e)
            }
    
    def clean_response(self, response: str) -> str:
        """Clean and format the AI response"""
        # Remove special tokens that might have leaked through
        special_tokens = ['<|vet|>', '<|species|>', '<|endoftext|>', '<|pad|>']
        for token in special_tokens:
            response = response.replace(token, '')
        
        # Remove repetitive patterns
        lines = response.split('\n')
        cleaned_lines = []
        prev_line = ""
        
        for line in lines:
            line = line.strip()
            if line and line != prev_line:  # Remove empty lines and duplicates
                cleaned_lines.append(line)
                prev_line = line
        
        response = '\n'.join(cleaned_lines)
        
        # Ensure the response ends properly
        if response and not response.endswith(('.', '!', '?')):
            response += '.'
        
        return response.strip()
    
    def calculate_confidence(self, response: str, query: str) -> float:
        """Calculate confidence score for the response"""
        confidence = 0.5  # Base confidence
        
        # Length bonus (reasonable length responses are better)
        if 50 <= len(response) <= 500:
            confidence += 0.2
        elif len(response) > 20:
            confidence += 0.1
        
        # Medical terminology bonus
        medical_terms = [
            'veterinarian', 'treatment', 'symptoms', 'diagnosis', 'medication',
            'condition', 'disease', 'health', 'care', 'monitor', 'consult'
        ]
        
        response_lower = response.lower()
        term_count = sum(1 for term in medical_terms if term in response_lower)
        confidence += min(term_count * 0.05, 0.2)
        
        # Avoid generic responses penalty
        generic_phrases = ['i don\'t know', 'i cannot', 'i\'m not sure', 'unclear']
        if any(phrase in response_lower for phrase in generic_phrases):
            confidence -= 0.2
        
        # Query relevance bonus
        query_words = set(query.lower().split())
        response_words = set(response_lower.split())
        overlap = len(query_words.intersection(response_words))
        if overlap > 0:
            confidence += min(overlap * 0.02, 0.1)
        
        return max(0.1, min(1.0, confidence))
    
    def run(self):
        """Main server loop - read from stdin, process, write to stdout"""
        logger.info("🚀 Inference server started, waiting for requests...")
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGTERM, self.signal_handler)
        signal.signal(signal.SIGINT, self.signal_handler)
        
        try:
            while self.is_running:
                try:
                    # Read request from stdin
                    line = sys.stdin.readline()
                    if not line:
                        break
                    
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Parse JSON request
                    try:
                        request = json.loads(line)
                    except json.JSONDecodeError as e:
                        logger.error(f"Invalid JSON request: {e}")
                        continue
                    
                    # Generate response
                    response = self.generate_response(request)
                    
                    # Send response to stdout
                    response_json = json.dumps(response, ensure_ascii=False)
                    print(response_json, flush=True)
                    
                except EOFError:
                    logger.info("EOF received, shutting down...")
                    break
                except Exception as e:
                    logger.error(f"Error processing request: {e}")
                    error_response = {
                        'answer': 'An error occurred while processing your request.',
                        'confidence': 0.1,
                        'reasoning': f'Server error: {str(e)}',
                        'error': str(e)
                    }
                    print(json.dumps(error_response), flush=True)
        
        except KeyboardInterrupt:
            logger.info("Received interrupt signal")
        finally:
            self.cleanup()
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}, shutting down gracefully...")
        self.is_running = False
    
    def cleanup(self):
        """Cleanup resources"""
        logger.info("🔄 Cleaning up resources...")
        
        # Clear GPU memory if using CUDA
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        logger.info("✅ Cleanup complete")

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print("Usage: python inference_server.py <model_path>", file=sys.stderr)
        sys.exit(1)
    
    model_path = sys.argv[1]
    
    try:
        # Initialize and run server
        server = VeterinaryAIInferenceServer(model_path)
        server.run()
        
    except Exception as e:
        logger.error(f"Failed to start inference server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()