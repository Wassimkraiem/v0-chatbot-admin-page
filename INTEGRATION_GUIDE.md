# ChatBot Admin Dashboard - Integration Guide

This is a fully functional UI for a chatbot admin dashboard. The UI is complete and ready for backend integration. Here's where you need to add your API calls:

## 📋 Pages Overview

### 1. **FAQs Page** (`/app/admin/faqs/page.tsx`)
- **Displays**: All FAQs from your vector database
- **Features**: 
  - Search/filter FAQs
  - Delete FAQs
  - Link to add new FAQ

**Integration Points:**
```typescript
// Line 25-37: Replace the mock data with API call
// TODO: Replace with actual API call
// Example:
// const response = await fetch('/api/faqs');
// const data = await response.json();
// setFaqs(data);

// Line 56: Replace with actual API call
// TODO: Replace with actual API call to DELETE /api/faqs/{id}
// Example:
// await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
```

### 2. **Add FAQ Page** (`/app/admin/add-faq/page.tsx`)
- **Displays**: Form to add new Q&A pair
- **Features**:
  - Question input
  - Answer input (textarea)
  - Form validation
  - Loading states

**Integration Points:**
```typescript
// Line 38-57: Replace with actual API call
// TODO: Replace with actual API call POST /api/faqs
// Example:
// const response = await fetch('/api/faqs', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ question, answer })
// });
```

### 3. **Test Chatbot Page** (`/app/admin/test/page.tsx`)
- **Displays**: Test interface to query the chatbot
- **Features**:
  - Send a test question
  - Display chatbot response
  - Show source FAQs with similarity scores
  - Display which chunks/FAQs were used for the response

**Integration Points:**
```typescript
// Line 41-60: Replace with actual API call
// TODO: Replace with actual API call POST /api/test
// Example:
// const response = await fetch('/api/test', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ question })
// });
// const data = await response.json();
// // data should have: { answer, sourceChunks }
```

**Expected Response Format:**
```json
{
  "question": "What is your pricing?",
  "answer": "Our pricing starts at...",
  "sourceChunks": [
    {
      "id": "chunk-1",
      "text": "What is your pricing? Our pricing starts at...",
      "similarity": 0.95
    }
  ],
  "timestamp": "14:30:45"
}
```

### 4. **Chat Page** (`/app/admin/chat/page.tsx`)
- **Displays**: Conversation interface
- **Features**:
  - Send/receive messages
  - Chat history
  - Auto-scroll to latest message
  - Clear chat option
  - Loading states

**Integration Points:**
```typescript
// Line 51-66: Replace with actual API call
// TODO: Replace with actual API call POST /api/chat
// Example:
// const response = await fetch('/api/chat', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ message: input })
// });
// const data = await response.json();
// // data should have: { content }
```

## 🔌 Component Structure

```
/app
  /admin
    layout.tsx          # Wraps all admin pages
    /faqs
      page.tsx          # FAQ list and management
    /add-faq
      page.tsx          # Add new FAQ form
    /test
      page.tsx          # Chatbot testing interface
    /chat
      page.tsx          # Chat conversation
/components
  /admin
    sidebar.tsx         # Navigation sidebar
```

## 🎯 Quick Integration Checklist

- [ ] **FAQs API**: Implement `GET /api/faqs` (fetch all)
- [ ] **FAQs API**: Implement `DELETE /api/faqs/{id}` (delete FAQ)
- [ ] **Add FAQ API**: Implement `POST /api/faqs` (create new)
- [ ] **Test API**: Implement `POST /api/test` (test query)
- [ ] **Chat API**: Implement `POST /api/chat` (chat message)
- [ ] Update all `// TODO: Replace with actual API call` comments

## 📝 Notes

- All pages use mock data/functionality for demonstration
- Loading states and error handling are already implemented
- Form validation is ready to use
- The sidebar navigation auto-highlights the current page
- All styling is responsive and follows the dark theme design
- Use `console.log()` to debug API responses

## 🚀 Environment Variables

If your APIs need authentication or configuration, add them to `.env.local`:
```
NEXT_PUBLIC_API_URL=your_backend_url
API_KEY=your_api_key
```

Then use them in your API calls:
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`);
```

## 💡 Testing the UI

You can test the UI without backend integration by:
1. Filling out forms
2. Clicking buttons
3. Observing the mock responses
4. Then swap the mock implementations with real API calls

Happy integrating! 🎉
