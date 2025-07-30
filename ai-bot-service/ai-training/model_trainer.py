#!/usr/bin/env python3
"""
Veterinary AI Model Trainer
Fine-tunes a language model on veterinary knowledge for our custom AI bot.
Uses state-of-the-art techniques like LoRA, QLoRA, and parameter-efficient training.
"""

import os
import json
import logging
import torch
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
from torch.utils.tensorboard import SummaryWriter

# Transformers and training
from transformers import (
    AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer,
    DataCollatorForLanguageModeling
)
from datasets import Dataset, load_dataset
from peft import LoraConfig, get_peft_model, TaskType
import wandb
from accelerate import Accelerator

# Evaluation
from sklearn.metrics import accuracy_score, f1_score
import numpy as np

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ModelConfig:
    """Configuration for model training"""
    # Base model
    base_model_name: str = "microsoft/DialoGPT-medium"  # Good for conversational AI
    model_max_length: int = 1024
    
    # LoRA configuration
    use_lora: bool = True
    lora_r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.1
    lora_target_modules: List[str] = field(default_factory=lambda: ["c_attn", "c_proj"])
    
    # Quantization - Disabled for CPU-only training
    use_4bit: bool = False  # Disabled for CPU-only training
    bnb_4bit_compute_dtype: str = "float16"
    bnb_4bit_quant_type: str = "nf4"
    
    # Training parameters - Adjusted for CPU
    output_dir: str = "models/veterinary-ai-model"
    num_train_epochs: int = 3
    per_device_train_batch_size: int = 1  # Reduced for CPU
    per_device_eval_batch_size: int = 1   # Reduced for CPU
    gradient_accumulation_steps: int = 8   # Increased to compensate for smaller batch size
    learning_rate: float = 2e-4
    weight_decay: float = 0.01
    warmup_steps: int = 100
    max_grad_norm: float = 1.0
    
    # Evaluation
    evaluation_strategy: str = "steps"
    eval_steps: int = 500
    save_steps: int = 500
    logging_steps: int = 100
    
    # Data
    train_data_path: str = "data/training_data.jsonl"
    validation_split: float = 0.1
    max_samples: Optional[int] = None  # None for all data
    
    # Monitoring (Wandb removed)
    # use_wandb: bool = False
    # wandb_project: str = "veterinary-ai-training"
    # wandb_run_name: Optional[str] = None

class VeterinaryModelTrainer:
    """Trains a custom veterinary AI model"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.accelerator = Accelerator()
        self.tokenizer = None
        self.model = None
        self.train_dataset = None
        self.eval_dataset = None
        
        # Setup directories
        Path(config.output_dir).mkdir(parents=True, exist_ok=True)
        
        # TensorBoard writer
        self.writer = SummaryWriter(log_dir=os.path.join(config.output_dir, "tensorboard"))
    
    def load_and_prepare_model(self):
        """Load base model and prepare for training"""
        logger.info(f"🤖 Loading base model: {self.config.base_model_name}")
        
        # Configure quantization if enabled (disabled for CPU-only training)
        quantization_config = None
        # Note: 4-bit quantization disabled for CPU compatibility
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config.base_model_name,
            trust_remote_code=True,
            padding_side="left"
        )
        
        # Add special tokens for veterinary context
        special_tokens = {
            "pad_token": "<|pad|>",
            "eos_token": "<|endoftext|>",
            "additional_special_tokens": [
                "<|vet|>",  # Veterinary context marker
                "<|species|>",  # Species marker
                "<|symptom|>",  # Symptom marker
                "<|treatment|>",  # Treatment marker
                "<|urgent|>",  # Urgency marker
                "<|medication|>"  # Medication marker
            ]
        }
        
        num_added_tokens = self.tokenizer.add_special_tokens(special_tokens)
        logger.info(f"Added {num_added_tokens} special tokens")
        
        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            self.config.base_model_name,
            quantization_config=quantization_config,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        # Resize token embeddings for new tokens
        self.model.resize_token_embeddings(len(self.tokenizer))
        
        # Prepare model for k-bit training if using quantization (disabled for CPU)
        # Note: 4-bit quantization disabled for CPU compatibility
        
        # Configure LoRA if enabled
        if self.config.use_lora:
            logger.info("🔧 Configuring LoRA for parameter-efficient training")
            
            peft_config = LoraConfig(
                task_type=TaskType.CAUSAL_LM,
                inference_mode=False,
                r=self.config.lora_r,
                lora_alpha=self.config.lora_alpha,
                lora_dropout=self.config.lora_dropout,
                target_modules=self.config.lora_target_modules,
                bias="none"
            )
            
            self.model = get_peft_model(self.model, peft_config)
            self.model.print_trainable_parameters()
        
        logger.info("✅ Model loaded and configured successfully")
    
    def load_and_prepare_data(self):
        """Load and prepare training data"""
        logger.info(f"📚 Loading training data from {self.config.train_data_path}")
        
        # Check if training data file exists
        if not os.path.exists(self.config.train_data_path):
            logger.warning(f"⚠️ Training data file not found: {self.config.train_data_path}")
            logger.info("📝 Creating sample training data...")
            
            # Create sample data if file doesn't exist
            sample_data = [
                {
                    "instruction": "My dog is vomiting. What should I do?",
                    "response": "Vomiting in dogs can indicate various health issues. Monitor closely and contact a veterinarian if symptoms persist.",
                    "metadata": {"species": ["dog"], "category": "emergency", "urgency": "medium"}
                },
                {
                    "instruction": "How often should I feed my cat?",
                    "response": "Adult cats typically need 2 meals per day. Consult your veterinarian for specific recommendations.",
                    "metadata": {"species": ["cat"], "category": "nutrition", "urgency": "low"}
                }
            ]
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.config.train_data_path), exist_ok=True)
            
            # Write sample data
            with open(self.config.train_data_path, 'w', encoding='utf-8') as f:
                for item in sample_data:
                    f.write(json.dumps(item) + '\n')
            
            logger.info(f"✅ Created sample training data with {len(sample_data)} examples")
            data = sample_data
        else:
            # Load existing JSONL data
            data = []
            with open(self.config.train_data_path, 'r', encoding='utf-8') as f:
                for line in f:
                    data.append(json.loads(line))
        
        # Limit samples if specified
        if self.config.max_samples:
            data = data[:self.config.max_samples]
        
        logger.info(f"Loaded {len(data)} training examples")
        
        # Convert to dataset
        df = pd.DataFrame(data)
        dataset = Dataset.from_pandas(df)
        
        # Split into train/validation
        train_test_split = dataset.train_test_split(
            test_size=self.config.validation_split,
            seed=42
        )
        
        self.train_dataset = train_test_split['train']
        self.eval_dataset = train_test_split['test']
        
        # Tokenize datasets
        self.train_dataset = self.train_dataset.map(
            self.tokenize_function,
            batched=True,
            remove_columns=self.train_dataset.column_names
        )
        
        self.eval_dataset = self.eval_dataset.map(
            self.tokenize_function,
            batched=True,
            remove_columns=self.eval_dataset.column_names
        )
        
        logger.info(f"✅ Prepared {len(self.train_dataset)} training and {len(self.eval_dataset)} validation examples")
    
    def tokenize_function(self, examples):
        """Tokenize training examples with veterinary-specific formatting"""
        tokenized_inputs = []
        tokenized_labels = []
        
        for i in range(len(examples['instruction'])):
            # Format input with veterinary context
            species_info = ""
            if 'metadata' in examples and examples['metadata'][i]:
                metadata = examples['metadata'][i]
                if isinstance(metadata, str):
                    metadata = json.loads(metadata)
                
                species = metadata.get('species', [])
                category = metadata.get('category', 'general')
                
                if species and species != ['general']:
                    species_info = f"<|species|>{', '.join(species)}<|species|>"
                
                if category != 'general':
                    species_info += f" Category: {category}."
            
            # Create formatted conversation
            conversation = (
                f"<|vet|>{examples['instruction'][i]} "
                f"{species_info}\n"
                f"Human: {examples['instruction'][i]}\n"
                f"Veterinarian: {examples['response'][i]}<|endoftext|>"
            )
            
            # Tokenize
            tokenized = self.tokenizer(
                conversation,
                truncation=True,
                max_length=self.config.model_max_length,
                padding="max_length",
                return_tensors="pt"
            )
            
            tokenized_inputs.append(tokenized['input_ids'].squeeze())
            tokenized_labels.append(tokenized['input_ids'].squeeze())  # For causal LM, labels = input_ids
        
        return {
            'input_ids': tokenized_inputs,
            'attention_mask': [torch.ones_like(ids) for ids in tokenized_inputs],
            'labels': tokenized_labels
        }
    
    def compute_metrics(self, eval_pred):
        """Compute evaluation metrics"""
        predictions, labels = eval_pred
        
        # Decode predictions and labels
        decoded_preds = self.tokenizer.batch_decode(predictions, skip_special_tokens=True)
        decoded_labels = self.tokenizer.batch_decode(labels, skip_special_tokens=True)
        
        # Simple accuracy based on exact match (for evaluation purposes)
        exact_matches = sum(pred.strip() == label.strip() for pred, label in zip(decoded_preds, decoded_labels))
        accuracy = exact_matches / len(decoded_preds)
        
        return {
            'accuracy': accuracy,
            'exact_matches': exact_matches,
            'total_samples': len(decoded_preds)
        }
    
    def train_model(self):
        """Train the veterinary AI model"""
        logger.info("🚀 Starting model training...")
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=self.config.output_dir,
            num_train_epochs=self.config.num_train_epochs,
            per_device_train_batch_size=self.config.per_device_train_batch_size,
            per_device_eval_batch_size=self.config.per_device_eval_batch_size,
            gradient_accumulation_steps=self.config.gradient_accumulation_steps,
            learning_rate=self.config.learning_rate,
            weight_decay=self.config.weight_decay,
            warmup_steps=self.config.warmup_steps,
            max_grad_norm=self.config.max_grad_norm,
            evaluation_strategy=self.config.evaluation_strategy,
            eval_steps=self.config.eval_steps,
            save_steps=self.config.save_steps,
            logging_steps=self.config.logging_steps,
            save_total_limit=3,
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            greater_is_better=False,
            # report_to="wandb" if self.config.use_wandb else None,  # Wandb removed
            # run_name=self.config.wandb_run_name,  # Wandb removed
            fp16=torch.cuda.is_available(),
            dataloader_pin_memory=False,
            remove_unused_columns=False,
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False,  # Causal LM, not masked LM
            pad_to_multiple_of=8
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=self.train_dataset,
            eval_dataset=self.eval_dataset,
            tokenizer=self.tokenizer,
            data_collator=data_collator,
            compute_metrics=self.compute_metrics,
            callbacks=[TensorBoardCallback(self.writer)]
        )
        
        # Start training
        logger.info("🎯 Training started...")
        trainer.train()
        
        # Save final model
        logger.info("💾 Saving final model...")
        trainer.save_model()
        self.tokenizer.save_pretrained(self.config.output_dir)
        
        # Save training config
        config_path = Path(self.config.output_dir) / "training_config.json"
        with open(config_path, 'w') as f:
            json.dump(self.config.__dict__, f, indent=2)
        
        logger.info(f"✅ Training complete! Model saved to {self.config.output_dir}")
    
    def evaluate_model(self):
        """Evaluate the trained model"""
        logger.info("📊 Evaluating model performance...")
        
        # Load the best model
        if self.config.use_lora:
            # For LoRA models, we need to load the adapter
            from peft import PeftModel
            base_model = AutoModelForCausalLM.from_pretrained(
                self.config.base_model_name,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            model = PeftModel.from_pretrained(base_model, self.config.output_dir)
        else:
            model = AutoModelForCausalLM.from_pretrained(self.config.output_dir)
        
        model.eval()
        
        # Test on some sample veterinary questions
        test_questions = [
            "My dog is vomiting and has diarrhea. What should I do?",
            "My cat is not eating for 2 days. Is this serious?",
            "What are the symptoms of hip dysplasia in dogs?",
            "My bird is plucking its feathers. What could be wrong?",
            "How often should I feed my rabbit?"
        ]
        
        logger.info("🧪 Testing on sample questions:")
        
        for question in test_questions:
            # Format input
            formatted_input = f"<|vet|>You are a veterinary AI assistant.\nHuman: {question}\nVeterinarian:"
            
            # Tokenize
            inputs = self.tokenizer(
                formatted_input,
                return_tensors="pt",
                truncation=True,
                max_length=512
            )
            
            if torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=200,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id
                )
            
            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            response = response.replace(formatted_input, "").strip()
            
            logger.info(f"Q: {question}")
            logger.info(f"A: {response}")
            logger.info("-" * 80)
            # Log to TensorBoard
            self.writer.add_text("Evaluation/Question", question)
            self.writer.add_text("Evaluation/Response", response)
        self.writer.flush()
    
    def export_for_inference(self):
        """Export model for production inference"""
        logger.info("📦 Exporting model for inference...")
        
        inference_dir = Path(self.config.output_dir) / "inference"
        inference_dir.mkdir(exist_ok=True)
        
        # Create inference configuration
        inference_config = {
            "model_type": "veterinary-ai",
            "base_model": self.config.base_model_name,
            "use_lora": self.config.use_lora,
            "model_path": str(self.config.output_dir),
            "tokenizer_path": str(self.config.output_dir),
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
        
        with open(inference_dir / "config.json", 'w') as f:
            json.dump(inference_config, f, indent=2)
        
        # Create inference script
        inference_script = '''#!/usr/bin/env python3
"""
Veterinary AI Model Inference Server
Production-ready inference server for the trained veterinary AI model.
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import json
from pathlib import Path

class VeterinaryAIInference:
    def __init__(self, model_path: str):
        self.config = json.load(open(Path(model_path) / "inference" / "config.json"))
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.config["tokenizer_path"])
        
        # Load model
        if self.config["use_lora"]:
            base_model = AutoModelForCausalLM.from_pretrained(
                self.config["base_model"],
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            self.model = PeftModel.from_pretrained(base_model, self.config["model_path"])
        else:
            self.model = AutoModelForCausalLM.from_pretrained(self.config["model_path"])
        
        self.model.eval()
    
    def generate_response(self, question: str, species: str = None, context: str = None) -> str:
        """Generate veterinary advice response"""
        
        # Format input with veterinary context
        species_info = ""
        if species:
            species_info = f"<|species|>{species}<|species|> "
        
        formatted_input = (
            f"{self.config['special_tokens']['vet_start']}"
            f"You are a veterinary AI assistant. {species_info}"
            f"\\n{self.config['special_tokens']['human_prefix']} {question}"
            f"\\n{self.config['special_tokens']['assistant_prefix']}"
        )
        
        # Tokenize
        inputs = self.tokenizer(
            formatted_input,
            return_tensors="pt",
            truncation=True,
            max_length=512
        )
        
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                **self.config["generation_config"],
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.replace(formatted_input, "").strip()
        
        return response

# Example usage
if __name__ == "__main__":
    model = VeterinaryAIInference(".")
    
    while True:
        question = input("Ask a veterinary question: ")
        if question.lower() in ['quit', 'exit']:
            break
        
        response = model.generate_response(question)
        print(f"Veterinarian: {response}")
        print()
'''
        
        with open(inference_dir / "inference_server.py", 'w') as f:
            f.write(inference_script)
        
        logger.info(f"✅ Inference files exported to {inference_dir}")

class TensorBoardCallback:
    def __init__(self, writer):
        self.writer = writer
        self.global_step = 0

    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs is not None:
            for k, v in logs.items():
                self.writer.add_scalar(k, v, state.global_step)
            self.writer.flush()

    def on_evaluate(self, args, state, control, metrics=None, **kwargs):
        if metrics is not None:
            for k, v in metrics.items():
                self.writer.add_scalar(f"eval/{k}", v, state.global_step)
            self.writer.flush()

def main():
    """Main training function optimized for 4GB RAM VPS"""
    # Configuration optimized for low-memory VPS
    config = ModelConfig(
        base_model_name="microsoft/DialoGPT-small",  # Smaller model for 4GB RAM
        model_max_length=512,  # Reduced context length
        num_train_epochs=3,
        per_device_train_batch_size=1,  # Very small batch size for 4GB RAM
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=16,  # Compensate with more accumulation
        learning_rate=3e-4,  # Slightly higher learning rate
        use_lora=True,  # Essential for memory efficiency
        use_4bit=False,  # Disabled for CPU-only training
        lora_r=8,  # Smaller LoRA rank for memory
        lora_alpha=16,
        max_samples=5000,  # Limit training samples for faster training
        # use_wandb=False,  # Disable wandb to save memory
        eval_steps=1000,  # Less frequent evaluation
        save_steps=1000,
        logging_steps=200,
    )
    
    print("🔧 VPS Configuration (2vCPU, 4GB RAM):")
    print(f"   - Model: {config.base_model_name} (small)")
    print(f"   - Batch size: {config.per_device_train_batch_size} (memory optimized)")
    print(f"   - Max samples: {config.max_samples} (for faster training)")
    print(f"   - Expected training time: 3-6 hours")
    print()
    
    # Initialize trainer
    trainer = VeterinaryModelTrainer(config)
    
    try:
        # Load and prepare model
        trainer.load_and_prepare_model()
        
        # Load and prepare data
        trainer.load_and_prepare_data()
        
        # Train model
        trainer.train_model()
        
        # Evaluate model
        trainer.evaluate_model()
        
        # Export for inference
        trainer.export_for_inference()
        
        logger.info("🎉 Training pipeline complete!")
        
    except Exception as e:
        logger.error(f"❌ Training failed: {e}")
        raise
    
    finally:
        # Cleanup
        # if config.use_wandb: # Wandb removed
        #     wandb.finish()
        trainer.__del__()

if __name__ == "__main__":
    main()