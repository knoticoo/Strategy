# AI Veterinary Bot Service

A powerful, intelligent AI microservice for veterinary assistance that provides real-time pet health advice using external data sources, translation services, and AI providers.

## 🚀 Features

- **Real External Data Sources**: Wikipedia API, PetMD, VetLabel FDA database
- **Multi-language Support**: English, Latvian, Russian with auto-translation
- **Multiple AI Providers**: OpenAI GPT, Anthropic Claude, Local LLM, Intelligent Fallback
- **Real-time Web Scraping**: Live veterinary information from trusted sources
- **Medication Database**: Comprehensive pet medication information
- **Conversation Memory**: Session-based conversation history
- **Learning System**: Feedback-based improvement
- **Rate Limiting & Security**: Production-ready with proper authentication
- **Health Monitoring**: Built-in health checks and analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │────│  Bot Service    │────│  External APIs  │
│  (React/TS)     │    │  (Express/TS)   │    │  (Wiki, OpenAI) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Database      │
                       │ (SQLite/Mongo)  │
                       └─────────────────┘
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm 9+
- Optional: OpenAI API key
- Optional: Anthropic API key
- Optional: Google Translate API key

### Quick Start

1. **Clone and Install**
   ```bash
   cd ai-bot-service
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

```bash
# Service Configuration
NODE_ENV=production
PORT=3001

# AI Provider (openai|anthropic|local|fallback)
AI_PROVIDER=fallback
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Translation Service
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key_here

# Database
DATABASE_TYPE=sqlite
DATABASE_URL=./data/vet-bot.db

# Security
JWT_SECRET=your_secret_key_here
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### AI Provider Configuration

The service supports multiple AI providers with automatic fallback:

1. **OpenAI GPT** (Recommended)
   - Set `AI_PROVIDER=openai`
   - Add `OPENAI_API_KEY`
   - Uses GPT-3.5-turbo by default

2. **Anthropic Claude**
   - Set `AI_PROVIDER=anthropic`
   - Add `ANTHROPIC_API_KEY`
   - Uses Claude-3-sonnet by default

3. **Local LLM** (Ollama)
   - Set `AI_PROVIDER=local`
   - Requires Ollama running on localhost:11434

4. **Intelligent Fallback**
   - Set `AI_PROVIDER=fallback`
   - Uses web scraping + pattern matching
   - Works without API keys

## 🔌 API Endpoints

### Chat Endpoints

```http
POST /api/v1/chat/ask
Content-Type: application/json

{
  "query": "My dog is vomiting, what should I do?",
  "species": "dog",
  "language": "en",
  "context": {
    "petAge": "3 years",
    "symptoms": ["vomiting", "lethargy"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "sessionId": "uuid",
    "answer": "Based on your dog's symptoms...",
    "confidence": 0.85,
    "urgency": "medium",
    "recommendations": ["Consult a vet", "Monitor closely"],
    "sources": ["https://en.wikipedia.org/wiki/...", "..."],
    "metadata": {
      "processingTime": 1250,
      "aiProvider": "OpenAI GPT-3.5",
      "reasoning": "Analysis based on symptom patterns..."
    }
  }
}
```

### Other Endpoints

- `POST /api/v1/chat/translate` - Text translation
- `GET /api/v1/chat/suggestions/:species` - Get suggested questions
- `POST /api/v1/chat/feedback` - Submit feedback
- `GET /api/v1/chat/history/:sessionId` - Conversation history
- `GET /api/v1/health` - Service health check
- `GET /api/v1/medicines` - Medication database
- `GET /api/v1/analytics/stats` - Service statistics

## 🌐 Web App Integration

### Install Bot Client

```bash
# In your React app
npm install axios
```

### Use Bot Client

```typescript
import { botClient } from './services/botClient';

// Send chat message
const response = await botClient.chat({
  query: "My cat is not eating",
  species: "cat",
  language: "en"
});

// Get suggestions
const suggestions = await botClient.getSuggestions("dog", "en");

// Translate text
const translation = await botClient.translate({
  text: "Hello",
  to: "lv",
  context: "medical"
});

// Check bot health
const health = await botClient.checkHealth();
```

### Update AI Service

Replace your existing `aiService.ts`:

```typescript
import { botClient } from './botClient';

export const generateVetAdvice = async (query: string, species: PetSpecies): Promise<string> => {
  const response = await botClient.chat({ query, species });
  return response.answer;
};
```

## 🚀 VPS Deployment

### Option 1: Direct Deployment

1. **Upload to VPS**
   ```bash
   scp -r ai-bot-service/ user@your-vps:/opt/
   ```

2. **Install Dependencies**
   ```bash
   ssh user@your-vps
   cd /opt/ai-bot-service
   npm install --production
   npm run build
   ```

3. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "ai-vet-bot"
   pm2 startup
   pm2 save
   ```

4. **Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api/v1/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     ai-bot:
       build: .
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=/app/data/vet-bot.db
       volumes:
         - ./data:/app/data
       restart: unless-stopped
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## 📊 Monitoring & Analytics

### Health Check

```bash
curl http://localhost:3001/api/v1/health
```

### View Logs

```bash
# PM2 logs
pm2 logs ai-vet-bot

# Docker logs
docker-compose logs -f ai-bot
```

### Analytics Dashboard

Access analytics at: `http://your-domain.com/api/v1/analytics/stats`

## 🔧 Troubleshooting

### Common Issues

1. **Bot Service Not Responding**
   ```bash
   # Check if service is running
   pm2 status
   
   # Restart service
   pm2 restart ai-vet-bot
   ```

2. **External API Failures**
   - Check API keys in `.env`
   - Verify rate limits
   - Check network connectivity

3. **Translation Issues**
   - Ensure Google Translate API key is valid
   - Fallback dictionary will be used if API fails

4. **Database Errors**
   - Check database file permissions
   - Ensure data directory exists

### Performance Optimization

1. **Enable Caching**
   ```bash
   # Install Redis for caching
   npm install redis
   # Set REDIS_URL in .env
   ```

2. **Increase Rate Limits**
   ```bash
   # In .env
   RATE_LIMIT_MAX_REQUESTS=500
   ```

3. **Scale with Load Balancer**
   ```bash
   # Run multiple instances
   pm2 start dist/server.js -i max --name "ai-vet-bot"
   ```

## 🔐 Security

- API key authentication for admin endpoints
- Rate limiting to prevent abuse
- CORS configuration for web app integration
- Input validation with Joi schemas
- Helmet.js for security headers
- No sensitive data in logs

## 📈 Scaling

The bot service is designed to scale horizontally:

1. **Multiple Instances**: Run multiple bot services behind a load balancer
2. **Database Scaling**: Use MongoDB for distributed storage
3. **Caching**: Redis for response caching
4. **CDN**: Serve static assets via CDN

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: This README
- **Health Check**: `/api/v1/health`

---

## 🎯 Next Steps

1. **Deploy to VPS**: Follow deployment guide above
2. **Update Web App**: Integrate bot client
3. **Configure APIs**: Add your API keys
4. **Monitor**: Set up health checks
5. **Scale**: Add load balancing as needed

The AI Veterinary Bot Service is now ready to provide intelligent, real-time pet health assistance with external data sources and multiple AI providers! 🐾🤖