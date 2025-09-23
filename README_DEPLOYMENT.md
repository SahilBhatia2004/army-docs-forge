# Indian Army Document Management System - Deployment Guide

## Overview
This is a professional document management system built for the Indian Army with role-based access control, AI-powered search, and secure document storage.

## Current Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentication**: Supabase Auth (currently configured)
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage
- **AI Search**: Grok AI API (llama-3-groq-70b-tool-use)

## Migration to Self-Hosted Infrastructure

### 1. Backend Migration (Django)

#### Setup Django Backend
```bash
# Create Django project
django-admin startproject army_dms
cd army_dms
python manage.py startapp documents
python manage.py startapp authentication
```

#### Required Django Packages
```bash
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary  # For PostgreSQL
pip install python-multipart  # For file uploads
pip install celery redis  # For background tasks
pip install requests  # For AI API calls
```

#### Database Configuration
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'army_dms',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 2. Authentication System Migration

#### Replace Supabase Auth with Django Auth
```python
# authentication/models.py
from django.contrib.auth.models import AbstractUser

class ArmyUser(AbstractUser):
    ROLE_CHOICES = [
        ('clerk', 'Clerk'),
        ('officer', 'Officer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    service_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
```

#### API Endpoints
```python
# authentication/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    # Custom JWT token with user role
    pass

@api_view(['POST'])
def register_user(request):
    # User registration endpoint
    pass
```

### 3. File Storage Migration

#### Replace Supabase Storage with Local/Network Storage
```python
# documents/models.py
class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(ArmyUser, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list)
    file_type = models.CharField(max_length=50)
    file_size = models.BigIntegerField()

# documents/views.py
@api_view(['POST'])
def upload_document(request):
    # Handle file upload
    pass

@api_view(['GET'])
def search_documents(request):
    # AI-powered document search
    pass
```

### 4. AI Search Integration

#### Grok API Integration
```python
# services/ai_search.py
import requests

class GrokSearchService:
    def __init__(self):
        self.api_key = "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"
        self.model = "llama-3-groq-70b-tool-use"
        self.base_url = "https://api.groq.com/openai/v1"
    
    def search_documents(self, query, documents):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Prepare document content for AI analysis
        doc_context = self.prepare_documents_context(documents)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an AI assistant helping to search and rank documents based on relevance to user queries."
                },
                {
                    "role": "user",
                    "content": f"Search query: {query}\n\nDocuments: {doc_context}\n\nReturn the most relevant documents with relevance scores."
                }
            ]
        }
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
        return response.json()
```

### 5. Frontend Configuration Changes

#### Update API Endpoints in React
```typescript
// src/config/api.ts
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-django-server.com/api' 
    : 'http://localhost:8000/api',
  ENDPOINTS: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    UPLOAD: '/documents/upload/',
    SEARCH: '/documents/search/',
    DOWNLOAD: '/documents/download/',
  }
};

// src/services/api.ts
export const authService = {
  login: (credentials) => 
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  register: (userData) => 
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
};
```

### 6. Security Configuration

#### Environment Variables Setup
```bash
# .env (Django)
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost
DATABASE_URL=postgresql://user:pass@localhost/army_dms
GROK_API_KEY=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
MEDIA_ROOT=/secure/documents/
```

#### Security Settings
```python
# settings.py
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# File upload security
FILE_UPLOAD_MAX_MEMORY_SIZE = 100 * 1024 * 1024  # 100MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 100 * 1024 * 1024
```

### 7. Deployment Steps

#### 1. Server Setup
```bash
# Install dependencies
sudo apt update
sudo apt install python3 python3-pip postgresql nginx redis-server

# Setup PostgreSQL
sudo -u postgres createdb army_dms
sudo -u postgres createuser army_user
```

#### 2. Django Deployment
```bash
# Clone and setup
git clone your-repo
cd army_dms
pip install -r requirements.txt

# Database migration
python manage.py migrate
python manage.py collectstatic

# Setup Gunicorn
gunicorn army_dms.wsgi:application --bind 0.0.0.0:8000
```

#### 3. Frontend Build
```bash
# Build React app
npm run build

# Serve with Nginx
sudo cp dist/* /var/www/army_dms/
```

#### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/army_dms;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Configuration Points

### Where to Add Keys:

1. **Supabase Keys** (Current Setup):
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your build environment
   - Create `.env.local` file in project root (ignored by git)

2. **Grok API Key** (AI Search):
   - Backend: Add to Django settings as environment variable
   - Currently hardcoded: `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`

3. **Database Credentials**:
   - Configure in Django settings.py
   - Use environment variables for production

### Migration Timeline:
1. **Phase 1**: Current Supabase integration (immediate deployment)
2. **Phase 2**: Parallel Django backend development
3. **Phase 3**: Gradual migration and testing
4. **Phase 4**: Full self-hosted deployment

## Support and Maintenance

For technical support during migration:
- Document all API endpoints and their expected payloads
- Maintain data backup procedures
- Implement proper logging and monitoring
- Regular security updates and patches

## Security Considerations

- Enable HTTPS in production
- Implement proper access controls
- Regular security audits
- Encrypted file storage
- API rate limiting
- Input validation and sanitization