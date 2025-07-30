#!/usr/bin/env bash

# Unified start script for AI Pet Doctor system
# Starts web app, bot service, training, and TensorBoard (all in background)
# Logs are written to logs/ directory

mkdir -p logs

# 1. Start the web app (frontend)
echo "Starting Web App (frontend)..."
nohup npm run --prefix . run dev > logs/web-app.log 2>&1 &
WEB_PID=$!
echo "Web App started with PID $WEB_PID (log: logs/web-app.log)"

# 2. Start the bot service (backend)
echo "Starting Bot Service (backend)..."
nohup npm run --prefix ai-bot-service run dev > logs/bot-service.log 2>&1 &
BOT_PID=$!
echo "Bot Service started with PID $BOT_PID (log: logs/bot-service.log)"

# 3. Start model training (Python, in venv)
echo "Starting Model Training..."
nohup ai-bot-service/ai-training/venv/bin/python ai-bot-service/ai-training/model_trainer.py > logs/training.log 2>&1 &
TRAIN_PID=$!
echo "Model Training started with PID $TRAIN_PID (log: logs/training.log)"

# 4. Start TensorBoard for monitoring
echo "Starting TensorBoard (port 6006)..."
nohup ai-bot-service/ai-training/venv/bin/tensorboard --logdir ai-bot-service/ai-training/models/veterinary-ai-model/tensorboard --port 6006 > logs/tensorboard.log 2>&1 &
TB_PID=$!
echo "TensorBoard started with PID $TB_PID (log: logs/tensorboard.log)"

echo "\nAll services started!"
echo "- Web App:         http://<your-vps-ip>:3000"
echo "- Bot Service:     http://<your-vps-ip>:3001"
echo "- TensorBoard:     http://<your-vps-ip>:6006"
echo "\nTo stop all, use: kill $WEB_PID $BOT_PID $TRAIN_PID $TB_PID"