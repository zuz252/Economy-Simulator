# Economy Simulator - Hosting and Authentication Strategy

## Overview
This document outlines the hosting infrastructure and authentication system required to make the Economy Simulator accessible to authorized users with username/password authentication.

## Hosting Architecture

### 1. Cloud Infrastructure Options

#### Option A: AWS (Recommended)
- **EC2**: Application servers for backend and frontend
- **RDS**: PostgreSQL database with automated backups
- **ElastiCache**: Redis for caching and sessions
- **S3**: Static assets and file storage
- **CloudFront**: CDN for global content delivery
- **Route 53**: DNS management
- **Load Balancer**: Application Load Balancer for traffic distribution
- **Auto Scaling**: Automatic scaling based on demand

#### Option B: Google Cloud Platform
- **Compute Engine**: Virtual machines for application servers
- **Cloud SQL**: Managed PostgreSQL database
- **Memorystore**: Redis for caching
- **Cloud Storage**: Object storage for files
- **Cloud CDN**: Content delivery network
- **Cloud Load Balancing**: Traffic distribution

#### Option C: Azure
- **Virtual Machines**: Application hosting
- **Azure Database for PostgreSQL**: Managed database
- **Azure Cache for Redis**: Caching service
- **Azure Storage**: File and blob storage
- **Azure CDN**: Content delivery
- **Azure Load Balancer**: Traffic management

### 2. Container Orchestration

#### Docker Compose (Development/Staging)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./src/frontend
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.economysimulator.com
    volumes:
      - frontend-build:/app/.next

  backend:
    build: ./src/backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/economy_sim
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=economy_sim
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

  mcp-server:
    build: ./src/infrastructure/mcp-servers/ffiec-ubpr-mcp-server
    environment:
      - FFIEC_USERNAME=${FFIEC_USERNAME}
      - FFIEC_PASSWORD=${FFIEC_PASSWORD}

volumes:
  postgres-data:
  redis-data:
  frontend-build:
```

#### Kubernetes (Production)
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: economy-simulator-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: economy-simulator-backend
  template:
    metadata:
      labels:
        app: economy-simulator-backend
    spec:
      containers:
      - name: backend
        image: economysimulator/backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
```

## Authentication System

### 1. User Management

#### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### User Roles
- **admin**: Full system access, user management
- **analyst**: Bank selection, UBPR data access, analysis tools
- **viewer**: Read-only access to selected data
- **user**: Basic access, limited features

### 2. Authentication Flow

#### JWT-Based Authentication
```typescript
// src/backend/services/auth/AuthService.ts
export class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.validateCredentials(username, password);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateJWT(user);
    await this.createSession(user.id, token);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token,
      expiresIn: '24h'
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Validate user data
    // Hash password
    // Create user
    // Send verification email
    // Return auth response
  }

  async logout(token: string): Promise<void> {
    await this.invalidateSession(token);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    // Validate refresh token
    // Generate new access token
    // Return new auth response
  }
}
```

### 3. Frontend Authentication

#### React Context for Auth State
```typescript
// src/frontend/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    localStorage.setItem('authToken', response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Protected Routes
```typescript
// src/frontend/components/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredRole?: string;
}> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## Security Considerations

### 1. Password Security
- **bcrypt** for password hashing (cost factor 12)
- **Password requirements**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Password history**: Prevent reuse of last 5 passwords
- **Account lockout**: 5 failed attempts = 15-minute lockout

### 2. JWT Security
- **Short expiration**: 24 hours for access tokens
- **Refresh tokens**: 7 days with rotation
- **Secure storage**: HttpOnly cookies for refresh tokens
- **Token blacklisting**: Invalidate tokens on logout

### 3. API Security
- **Rate limiting**: 100 requests per minute per user
- **CORS**: Configured for specific domains
- **Input validation**: Joi schemas for all inputs
- **SQL injection prevention**: Parameterized queries
- **XSS protection**: Content Security Policy headers

### 4. Infrastructure Security
- **HTTPS only**: TLS 1.3 with strong ciphers
- **Security headers**: HSTS, CSP, X-Frame-Options
- **Database encryption**: At rest and in transit
- **VPC**: Isolated network segments
- **IAM**: Least privilege access

## Deployment Pipeline

### 1. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm run test:backend
          npm run test:frontend

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t economysimulator/backend:${{ github.sha }} ./src/backend
          docker build -t economysimulator/frontend:${{ github.sha }} ./src/frontend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy to AWS/GCP/Azure
          # Update Kubernetes deployments
          # Run database migrations
```

### 2. Environment Management
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/economy_sim
REDIS_URL=redis://host:6379
JWT_SECRET=super-secret-jwt-key
JWT_REFRESH_SECRET=super-secret-refresh-key
FFIEC_USERNAME=your-ffiec-username
FFIEC_PASSWORD=your-ffiec-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Monitoring and Logging

### 1. Application Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and alerts
- **Sentry**: Error tracking and performance monitoring
- **Log aggregation**: ELK stack (Elasticsearch, Logstash, Kibana)

### 2. Infrastructure Monitoring
- **CloudWatch** (AWS) / **Stackdriver** (GCP) / **Azure Monitor**
- **Uptime monitoring**: Pingdom or UptimeRobot
- **SSL certificate monitoring**: Automatic renewal alerts

## Cost Estimation

### Monthly Costs (AWS)
- **EC2**: $150-300 (t3.medium instances)
- **RDS**: $100-200 (db.t3.medium)
- **ElastiCache**: $50-100
- **S3**: $10-20
- **CloudFront**: $20-50
- **Total**: $330-670/month

### Scaling Considerations
- **Auto-scaling**: Handle traffic spikes
- **Database read replicas**: For high read loads
- **CDN**: Global content delivery
- **Load balancing**: Distribute traffic

## Implementation Timeline

### Phase 1: Authentication Foundation (2-3 weeks)
1. Set up user database schema
2. Implement JWT authentication
3. Create login/register pages
4. Add protected routes

### Phase 2: Infrastructure Setup (2-3 weeks)
1. Set up cloud infrastructure
2. Configure CI/CD pipeline
3. Deploy basic application
4. Set up monitoring

### Phase 3: Security Hardening (1-2 weeks)
1. Implement security headers
2. Add rate limiting
3. Set up SSL certificates
4. Configure backup strategies

### Phase 4: Production Deployment (1 week)
1. Deploy to production
2. Configure domain and DNS
3. Set up monitoring alerts
4. Performance testing

## Next Steps

1. **Choose cloud provider** based on team expertise and budget
2. **Set up development environment** with authentication
3. **Create user management interface** for admins
4. **Implement email verification** and password reset
5. **Set up CI/CD pipeline** for automated deployments
6. **Configure monitoring** and alerting
7. **Plan data migration** strategy for existing data

This hosting strategy ensures the Economy Simulator can be securely accessed by authorized users while maintaining scalability, security, and reliability. 